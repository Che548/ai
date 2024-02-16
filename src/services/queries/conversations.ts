import { useQuery } from '@tanstack/react-query';
import {
  getAllUserConversations,
  getConversationEvents,
  getConversationMessages,
} from '../api/conversations';
import { useAuthStore } from '~/zustand';

export function useConversationEvents(conversationId: string | null) {
  return useQuery({
    queryKey: ['events', conversationId],
    queryFn: () => getConversationEvents(conversationId!),
    enabled: !!conversationId,
  });
}

export function useConversationMessages(conversationId: string | null) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(conversationId!, user!),
    enabled: !!conversationId && !!user,
  });
}

export function useConversations() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => getAllUserConversations(user?.user_id!),
    enabled: !!user?.user_id,
  });
}
