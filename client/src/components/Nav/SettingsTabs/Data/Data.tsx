import React, { useState, useRef } from 'react';
import { useClearConversationsMutation } from 'librechat-data-provider/react-query';
import { useConversation, useConversations, useOnClickOutside } from '~/hooks';
import { DeleteCacheButton } from './DeleteCacheButton';
import ImportConversations from './ImportConversations';
import { RevokeAllKeys } from './RevokeAllKeys';
import { ClearChats } from './ClearChats';
import SharedLinks from './SharedLinks';

function Data() {
  const dataTabRef = useRef(null);
  const [confirmClearConvos, setConfirmClearConvos] = useState(false);
  useOnClickOutside(dataTabRef, () => confirmClearConvos && setConfirmClearConvos(false), []);

  return (
    <div className="flex flex-col gap-3 p-1 text-sm text-text-primary">
      <div className="border-b border-border-medium pb-3 last-of-type:border-b-0">
        <ImportConversations />
      </div>
      <div className="border-b border-border-medium pb-3 last-of-type:border-b-0">
        <SharedLinks />
      </div>
      <div className="border-b border-border-medium pb-3 last-of-type:border-b-0">
        <RevokeAllKeys />
      </div>
      <div className="border-b border-border-medium pb-3 last-of-type:border-b-0">
        <DeleteCacheButton />
      </div>
      <div className="border-b border-border-medium pb-3 last-of-type:border-b-0">
        <ClearChats />
      </div>
    </div>
  );
}

export default React.memo(Data);
