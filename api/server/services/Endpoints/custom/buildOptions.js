const buildOptions = (endpoint, parsedBody, endpointType) => {
  const { chatGptLabel, promptPrefix, resendFiles, imageDetail, iconURL, greeting, ...rest } =
    parsedBody;
  const endpointOption = {
    endpoint,
    endpointType,
    chatGptLabel,
    promptPrefix,
    resendFiles,
    imageDetail,
    iconURL,
    greeting,
    modelOptions: {
      ...rest,
    },
  };

  return endpointOption;
};

module.exports = buildOptions;
