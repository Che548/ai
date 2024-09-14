import { useMemo, useState, useCallback } from 'react';
import { useConversationsInfiniteQuery } from '~/data-provider';
import { ConversationListResponse } from 'librechat-data-provider';
import {
  MessageCircle,
  ArchiveRestore,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Search,
} from 'lucide-react';
import { useAuthContext, useLocalize, useNavScrolling, useArchiveHandler } from '~/hooks';
import { DeleteButton } from '~/components/Conversations/ConvoOptions';
import {
  TooltipAnchor,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
  Skeleton,
  Button,
  Input,
} from '~/components';
import { cn } from '~/utils';

export default function ArchivedChatsTable() {
  const localize = useLocalize();
  const { isAuthenticated } = useAuthContext();
  const [showLoading, setShowLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationsInfiniteQuery(
    { pageNumber: '1', isArchived: true },
    { enabled: isAuthenticated },
  );

  const { containerRef, moveToTop } = useNavScrolling<ConversationListResponse>({
    setShowLoading,
    hasNextPage: hasNextPage,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage: isFetchingNextPage,
  });

  const conversations = useMemo(
    () => data?.pages.flatMap((page) => page.conversations) || [],
    [data],
  );

  const archiveHandler = useArchiveHandler(conversationId ?? '', false, moveToTop);

  const handleChatClick = useCallback((conversationId: string) => {
    window.open(`/c/${conversationId}`, '_blank');
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      (conversation.title?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  const paginatedConversations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredConversations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredConversations, currentPage]);

  const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);

  if (!data || conversations.length === 0) {
    return <div className="text-gray-300">{localize('com_nav_archived_chats_empty')}</div>;
  }

  const getRandomWidth = () => Math.floor(Math.random() * (400 - 170 + 1)) + 170;

  const skeletons = Array.from({ length: 11 }, (_, index) => {
    const randomWidth = getRandomWidth();
    return (
      <div key={index} className="flex h-10 w-full items-center">
        <div className="flex w-[410px] items-center">
          <Skeleton className="h-4" style={{ width: `${randomWidth}px` }} />
        </div>
        <div className="flex flex-grow justify-center">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="mr-2 flex justify-end">
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    );
  });

  return (
    <div
      className={cn(
        'grid w-full gap-2',
        'flex-1 flex-col overflow-y-auto pr-2 transition-opacity duration-500',
        'max-h-[629px]',
      )}
      ref={containerRef}
    >
      <div className="flex items-center">
        <Search className="size-4 text-text-secondary" />
        <Input
          type="text"
          placeholder={localize('com_nav_search_placeholder')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border-none"
        />
      </div>
      <Separator />
      {filteredConversations.length === 0 ? (
        <div className="mt-4 text-text-secondary">{localize('com_nav_no_search_results')}</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%] p-4">{localize('com_nav_archive_name')}</TableHead>
                <TableHead className="w-[35%] p-1">
                  {localize('com_nav_archive_created_at')}
                </TableHead>
                <TableHead className="w-[15%] p-1 text-right">
                  {localize('com_assistants_actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedConversations.map((conversation) => {
                if (conversation.conversationId == null) {
                  return null;
                }
                return (
                  <TableRow key={conversation.conversationId}>
                    <TableCell className="flex items-center py-3 text-text-primary">
                      <button
                        className="flex"
                        onClick={() =>
                          conversation.conversationId != null &&
                          handleChatClick(conversation.conversationId)
                        }
                      >
                        <MessageCircle className="mr-1 h-5 w-5" />
                        <u>{conversation.title}</u>
                      </button>
                    </TableCell>
                    <TableCell className="p-1">
                      <div className="flex justify-between">
                        <div className="flex justify-start text-text-secondary">
                          {new Date(conversation.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center justify-end gap-2 p-1">
                      <TooltipAnchor
                        description={localize('com_ui_unarchive')}
                        onClick={() => {
                          setConversationId(conversation.conversationId);
                          archiveHandler();
                        }}
                        className="flex size-7 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-surface-hover hover:text-text-primary"
                      >
                        <ArchiveRestore className="size-4" />
                      </TooltipAnchor>
                      <DeleteButton
                        conversationId={conversation.conversationId}
                        retainView={moveToTop}
                        title={conversation.title ?? ''}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-6 px-2 py-4">
            <div className="text-sm font-bold text-text-primary">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 10, 1))}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 10, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
      {(isFetchingNextPage || showLoading) && skeletons}
    </div>
  );
}
