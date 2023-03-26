import React from "react";
import Conversation from "./Conversation";

export default function Conversations({
  conversations,
  conversationId,
  pageNumber,
  pages,
  nextPage,
  previousPage,
  moveToTop,
}) {
  const clickHandler = (func) => async (e) => {
    e.preventDefault();
    await func();
  };

  return (
    <>
      {conversations &&
        conversations.length > 0 &&
        conversations.map((convo) => {
          return (
            <Conversation
              key={convo.conversationId}
              conversation={convo}
              retainView={moveToTop}
            />
          );
        })}
      {pageNumber == 1 && pages == 1 ? null : (
        <div className="m-auto mt-4 mb-2 flex items-center justify-center gap-2">
          <button
            onClick={clickHandler(previousPage)}
            className={
              "btn btn-small bg-transition m-auto flex gap-2 transition hover:bg-gray-800 disabled:text-gray-300 dark:text-white dark:disabled:text-gray-400" +
              (pageNumber <= 1 ? " hidden-visibility" : "")
            }
            disabled={pageNumber <= 1}
          >
            &lt;&lt;
          </button>
          <span className="flex-none text-gray-400">
            {pageNumber} / {pages}
          </span>
          <button
            onClick={clickHandler(nextPage)}
            className={
              "btn btn-small bg-transition m-auto flex gap-2 transition hover:bg-gray-800 disabled:text-gray-300 dark:text-white dark:disabled:text-gray-400" +
              (pageNumber >= pages ? " hidden-visibility" : "")
            }
            disabled={pageNumber >= pages}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </>
  );
}
