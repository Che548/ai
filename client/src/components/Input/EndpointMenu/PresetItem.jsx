import { DropdownMenuRadioItem, EditIcon, TrashIcon } from '~/components';
import { getIcon } from '~/components/Endpoints';

export default function PresetItem({ preset = {}, value, onChangePreset, onDeletePreset }) {
  const { endpoint } = preset;

  const icon = getIcon({
    size: 20,
    endpoint: preset?.endpoint,
    model: preset?.model,
    error: false,
    className: 'mr-2',
  });

  const getPresetTitle = () => {
    let _title = `${endpoint}`;

    if (endpoint === 'azureOpenAI' || endpoint === 'openAI') {
      const { chatGptLabel, model } = preset;
      if (model) {
        _title += `: ${model}`;
      }
      if (chatGptLabel) {
        _title += ` as ${chatGptLabel}`;
      }
    } else if (endpoint === 'google') {
      const { modelLabel, model } = preset;
      if (model) {
        _title += `: ${model}`;
      }
      if (modelLabel) {
        _title += ` as ${modelLabel}`;
      }
    } else if (endpoint === 'bingAI') {
      const { jailbreak, toneStyle } = preset;
      if (toneStyle) {
        _title += `: ${toneStyle}`;
      }
      if (jailbreak) {
        _title += ' as Sydney';
      }
    } else if (endpoint === 'chatGPTBrowser') {
      const { model } = preset;
      if (model) {
        _title += `: ${model}`;
      }
    } else if (endpoint === 'gptPlugins') {
      const { model } = preset;
      if (model) {
        _title += `: ${model}`;
      }
    } else if (endpoint === null) {
      null;
    } else {
      null;
    }
    return _title;
  };

  // regular model
  return (
    <DropdownMenuRadioItem
      value={value}
      className="group dark:font-semibold dark:text-gray-100 dark:hover:bg-gray-800"
    >
      {icon}
      <small className="text-[11px]">{preset?.title}</small>
      <small className="ml-1 text-[10px]">({getPresetTitle()})</small>
      <div className="flex w-4 flex-1" />
      <button
        className="m-0 mr-1 rounded-md p-2 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:invisible md:group-hover:visible"
        onClick={(e) => {
          e.preventDefault();
          onChangePreset(preset);
        }}
      >
        <EditIcon />
      </button>
      <button
        className="m-0 rounded-md text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:invisible md:group-hover:visible"
        onClick={(e) => {
          e.preventDefault();
          onDeletePreset(preset);
        }}
      >
        <TrashIcon />
      </button>
    </DropdownMenuRadioItem>
  );
}
