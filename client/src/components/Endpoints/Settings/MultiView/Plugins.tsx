import Settings from '../Plugins';
import AgentSettings from '../AgentSettings';
import { useSetOptions } from '~/hooks';
import { useRecoilValue } from 'recoil';
import store from '~/store';

export default function PluginsView({ models }) {
  const showAgentSettings = useRecoilValue(store.showAgentSettings);
  const { setOption, setAgentOption, getConversation } = useSetOptions();

  const conversation = getConversation();
  if (!conversation) {
    return null;
  }

  return showAgentSettings ? (
    <AgentSettings conversation={conversation} setOption={setAgentOption} models={models} />
  ) : (
    <Settings conversation={conversation} setOption={setOption} models={models} />
  );
}
