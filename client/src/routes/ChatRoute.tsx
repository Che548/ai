import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGetModelsQuery, useGetEndpointsQuery } from 'librechat-data-provider/react-query';
import { defaultOrderQuery } from 'librechat-data-provider';
import type { TPreset } from 'librechat-data-provider';
import { useGetConvoIdQuery, useListAssistantsQuery } from '~/data-provider';
import { useNewConvo, useAppStartup } from '~/hooks';
import ChatView from '~/components/Chat/ChatView';
import useAuthRedirect from './useAuthRedirect';
import { getDefaultModelSpec } from '~/utils';
import { Spinner } from '~/components/svg';
import store from '~/store';
import { data as modelSpecs } from '~/components/Chat/Menus/Models/fakeData';

export default function ChatRoute() {
  useAppStartup();
  const index = 0;
  const { conversationId } = useParams();

  const { conversation } = store.useCreateConversationAtom(index);
  const { isAuthenticated } = useAuthRedirect();
  const { newConversation } = useNewConvo();
  const hasSetConversation = useRef(false);

  const modelsQuery = useGetModelsQuery({
    enabled: isAuthenticated,
    refetchOnMount: 'always',
  });
  const initialConvoQuery = useGetConvoIdQuery(conversationId ?? '', {
    enabled: isAuthenticated && conversationId !== 'new',
  });
  const endpointsQuery = useGetEndpointsQuery({ enabled: isAuthenticated });
  const { data: assistants = null } = useListAssistantsQuery(defaultOrderQuery, {
    select: (res) =>
      res.data.map(({ id, name, metadata, model }) => ({ id, name, metadata, model })),
  });

  useEffect(() => {
    if (
      modelSpecs &&
      conversationId === 'new' &&
      endpointsQuery.data &&
      modelsQuery.data &&
      !modelsQuery.data?.initial &&
      !hasSetConversation.current
    ) {
      const spec = getDefaultModelSpec(modelSpecs);
      newConversation({
        modelsData: modelsQuery.data,
        template: conversation ? conversation : undefined,
        preset: {
          ...spec.preset,
          iconURL: spec.iconURL,
          spec: spec.name,
        },
      });
      hasSetConversation.current = true;
    } else if (
      modelSpecs &&
      initialConvoQuery.data &&
      endpointsQuery.data &&
      modelsQuery.data &&
      !modelsQuery.data?.initial &&
      !hasSetConversation.current
    ) {
      newConversation({
        template: initialConvoQuery.data,
        /* this is necessary to load all existing settings */
        preset: initialConvoQuery.data as TPreset,
        modelsData: modelsQuery.data,
        keepLatestMessage: true,
      });
      hasSetConversation.current = true;
    } else if (
      modelSpecs &&
      !hasSetConversation.current &&
      !modelsQuery.data?.initial &&
      conversationId === 'new' &&
      assistants
    ) {
      const spec = getDefaultModelSpec(modelSpecs);
      newConversation({
        modelsData: modelsQuery.data,
        template: conversation ? conversation : undefined,
        preset: {
          ...spec.preset,
          iconURL: spec.iconURL,
          spec: spec.name,
        },
      });
      hasSetConversation.current = true;
    } else if (
      modelSpecs &&
      !hasSetConversation.current &&
      !modelsQuery.data?.initial &&
      assistants
    ) {
      newConversation({
        template: initialConvoQuery.data,
        preset: initialConvoQuery.data as TPreset,
        modelsData: modelsQuery.data,
        keepLatestMessage: true,
      });
      hasSetConversation.current = true;
    }
    /* Creates infinite render if all dependencies included due to newConversation invocations exceeding call stack before hasSetConversation.current becomes truthy */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConvoQuery.data, endpointsQuery.data, modelsQuery.data, assistants]);

  if (endpointsQuery.isLoading || modelsQuery.isLoading) {
    return <Spinner className="m-auto text-black dark:text-white" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // if not a conversation
  if (conversation?.conversationId === 'search') {
    return null;
  }
  // if conversationId not match
  if (conversation?.conversationId !== conversationId && !conversation) {
    return null;
  }
  // if conversationId is null
  if (!conversationId) {
    return null;
  }

  return <ChatView index={index} />;
}
