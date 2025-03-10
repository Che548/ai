// ~/server/services/Files/MistralOCR/crud.js
const fs = require('fs');
const FormData = require('form-data');
const { FileSources, envVarRegex, extractEnvVariable } = require('librechat-data-provider');
const { loadAuthValues } = require('~/server/services/Tools/credentials');
const { logger, createAxiosInstance } = require('~/config');
const { logAxiosError } = require('~/utils');

const axios = createAxiosInstance();

async function uploadDocumentToMistral({
  buffer,
  fileName,
  apiKey,
  baseURL = 'https://api.mistral.ai/v1',
}) {
  const form = new FormData();
  form.append('purpose', 'ocr');
  form.append('file', buffer, { filename: fileName });

  return axios
    .post(`${baseURL}/files`, form, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders(),
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      logger.error('Error uploading document to Mistral:', error.message);
      throw error;
    });
}

async function getSignedUrl({
  apiKey,
  fileId,
  expiry = 24,
  baseURL = 'https://api.mistral.ai/v1',
}) {
  return axios
    .get(`${baseURL}/files/${fileId}/url?expiry=${expiry}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      logger.error('Error fetching signed URL:', error.message);
      throw error;
    });
}

/**
 * @param {Object} params
 * @param {string} params.apiKey
 * @param {string} params.documentUrl
 * @param {string} [params.baseURL]
 * @returns {Promise<OCRResult>}
 */
async function performOCR({
  apiKey,
  documentUrl,
  model = 'mistral-ocr-latest',
  baseURL = 'https://api.mistral.ai/v1',
}) {
  return axios
    .post(
      `${baseURL}/ocr`,
      {
        model,
        include_image_base64: false,
        document: {
          type: 'document_url',
          document_url: documentUrl,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      logger.error('Error performing OCR:', error.message);
      throw error;
    });
}

function extractVariableName(str) {
  const match = str.match(envVarRegex);
  return match ? match[1] : null;
}

const uploadMistralOCR = async ({ req, file, file_id, entity_id }) => {
  try {
    /** @type {TCustomConfig['ocr']} */
    const ocrConfig = req.app.locals?.ocr;
    const apiKeyVarName = extractVariableName(ocrConfig.apiKey) ?? 'OCR_API_KEY';
    const baseURLVarName = extractVariableName(ocrConfig.baseURL) ?? 'OCR_BASEURL';
    const authValues = await loadAuthValues({
      userId: req.user.id,
      authFields: [baseURLVarName, apiKeyVarName],
      optional: new Set([baseURLVarName]),
    });
    const apiKey = authValues[apiKeyVarName];
    const baseURL = authValues[baseURLVarName];
    const fileBuffer = fs.readFileSync(file.path);
    const mistralFile = await uploadDocumentToMistral({
      buffer: fileBuffer,
      fileName: file.originalname,
      apiKey,
      baseURL,
    });
    const model = extractEnvVariable(ocrConfig.mistralModel) || 'mistral-ocr-latest';
    const signedUrlResponse = await getSignedUrl({ apiKey, baseURL, fileId: mistralFile.id });
    const ocrResult = await performOCR({
      apiKey,
      baseURL,
      model,
      documentUrl: signedUrlResponse.url,
    });
    let aggregatedText = '';
    const images = [];
    ocrResult.pages.forEach((page, index) => {
      if (ocrResult.pages.length > 1) {
        aggregatedText += `# PAGE ${index + 1}\n`;
      }

      aggregatedText += page.markdown + '\n\n';

      if (page.images && page.images.length > 0) {
        page.images.forEach((image) => {
          if (image.image_base64) {
            images.push(image.image_base64);
          }
        });
      }
    });

    return {
      filename: file.originalname,
      bytes: aggregatedText.length * 4,
      filepath: FileSources.mistral_ocr,
      text: aggregatedText,
      images,
    };
  } catch (error) {
    const message = 'Error uploading document to Mistral OCR API';
    logAxiosError({ error, message });
    throw new Error(message);
  }
};

module.exports = {
  uploadDocumentToMistral,
  uploadMistralOCR,
  getSignedUrl,
  performOCR,
};
