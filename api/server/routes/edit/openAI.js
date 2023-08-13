const express = require('express');
const router = express.Router();
const { getResponseSender } = require('librechat-data-provider');
const { initializeClient } = require('../endpoints/openAI');
const { saveMessage, getConvoTitle, getConvo } = require('../../../models');
const { sendMessage, createOnProgress } = require('../../utils');
const {
  handleAbort,
  createAbortController,
  handleAbortError,
  setHeaders,
  requireJwtAuth,
  validateEndpoint,
  buildEndpointOption,
} = require('../../middleware');

router.post('/abort', requireJwtAuth, handleAbort());

router.post(
  '/',
  requireJwtAuth,
  validateEndpoint,
  buildEndpointOption,
  setHeaders,
  async (req, res) => {
    let {
      text,
      generation,
      endpointOption,
      conversationId,
      responseMessageId,
      parentMessageId = null,
      overrideParentMessageId = null,
    } = req.body;
    console.log('edit log');
    console.dir({ text, conversationId, endpointOption }, { depth: null });
    let metadata;
    let userMessage;
    let lastSavedTimestamp = 0;
    const userMessageId = parentMessageId;
    const user = req.user.id;

    const addMetadata = (data) => (metadata = data);
    const getIds = (data) => (userMessage = data.userMessage);

    const { onProgress: progressCallback, getPartialText } = createOnProgress({
      generation,
      onProgress: ({ text: partialText }) => {
        const currentTimestamp = Date.now();

        if (currentTimestamp - lastSavedTimestamp > 500) {
          lastSavedTimestamp = currentTimestamp;
          saveMessage({
            messageId: responseMessageId,
            sender: getResponseSender(endpointOption),
            conversationId,
            parentMessageId: overrideParentMessageId || userMessageId,
            text: partialText,
            model: endpointOption.modelOptions.model,
            unfinished: true,
            cancelled: false,
            error: false,
          });
        }
      },
    });

    const getAbortData = () => ({
      sender: getResponseSender(endpointOption),
      conversationId,
      messageId: responseMessageId,
      parentMessageId: overrideParentMessageId ?? userMessageId,
      text: getPartialText(),
      userMessage,
    });

    const { abortController, onStart } = createAbortController(
      res,
      req,
      endpointOption,
      getAbortData,
    );

    try {
      const { client } = initializeClient(req, endpointOption);

      let response = await client.sendMessage(text, {
        user,
        isEdited: true,
        conversationId,
        parentMessageId,
        responseMessageId,
        overrideParentMessageId,
        getIds,
        onStart,
        addMetadata,
        abortController,
        onProgress: progressCallback.call(null, {
          res,
          text,
          parentMessageId: overrideParentMessageId || userMessageId,
        }),
      });

      if (metadata) {
        response = { ...response, ...metadata };
      }

      console.log(
        'promptTokens, completionTokens:',
        response.promptTokens,
        response.completionTokens,
      );
      await saveMessage(response);

      sendMessage(res, {
        title: await getConvoTitle(req.user.id, conversationId),
        final: true,
        conversation: await getConvo(req.user.id, conversationId),
        requestMessage: userMessage,
        responseMessage: response,
      });
      res.end();
    } catch (error) {
      const partialText = getPartialText();
      handleAbortError(res, req, error, {
        partialText,
        conversationId,
        sender: getResponseSender(endpointOption),
        messageId: responseMessageId,
        parentMessageId: userMessageId,
      });
    }
  },
);

module.exports = router;
