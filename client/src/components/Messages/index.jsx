import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Spinner from "../svg/Spinner";
import { CSSTransition } from "react-transition-group";
import ScrollToBottom from "./ScrollToBottom";
import MultiMessage from "./MultiMessage";

import store from "~/store";

export default function Messages() {
  const [currentEditId, setCurrentEditId] = useState(-1);
  const messagesTree = useRecoilValue(store.messagesTree);
  const conversation = useRecoilValue(store.conversation) || {};
  const { conversationId, model, chatGptLabel } = conversation;
  const models = useRecoilValue(store.models) || [];
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollableRef = useRef(null);
  const messagesEndRef = useRef(null);

  const modelName = models.find((element) => element.model == model)?.name;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
      const diff = Math.abs(scrollHeight - scrollTop);
      const percent = Math.abs(clientHeight - diff) / clientHeight;
      const hasScrollbar = scrollHeight > clientHeight && percent > 0.2;
      setShowScrollButton(hasScrollbar);
    }, 650);

    // Add a listener on the window object
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [messagesTree]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  }, [messagesEndRef]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
    const diff = Math.abs(scrollHeight - scrollTop);
    const percent = Math.abs(clientHeight - diff) / clientHeight;
    if (percent <= 0.2) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  let timeoutId = null;
  const debouncedHandleScroll = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleScroll, 100);
  };

  const scrollHandler = (e) => {
    e.preventDefault();
    scrollToBottom();
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      ref={scrollableRef}
      onScroll={debouncedHandleScroll}
    >
      {/* <div className="flex-1 overflow-hidden"> */}
      <div className="dark:gpt-dark-gray h-full">
        <div className="dark:gpt-dark-gray flex h-full flex-col items-center text-sm">
          <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-sm text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
            Model: {modelName} {chatGptLabel ? `(${chatGptLabel})` : null}
          </div>
          {messagesTree === null ? (
            <Spinner />
          ) : (
            <>
              <MultiMessage
                key={conversationId} // avoid internal state mixture
                conversation={conversation}
                messagesTree={messagesTree}
                scrollToBottom={scrollToBottom}
                currentEditId={currentEditId}
                setCurrentEditId={setCurrentEditId}
              />
              <CSSTransition
                in={showScrollButton}
                timeout={400}
                classNames="scroll-down"
                unmountOnExit={false}
                // appear
              >
                {() =>
                  showScrollButton && (
                    <ScrollToBottom scrollHandler={scrollHandler} />
                  )
                }
              </CSSTransition>
            </>
          )}
          <div
            className="dark:gpt-dark-gray group h-32 w-full flex-shrink-0 dark:border-gray-900/50 md:h-48"
            ref={messagesEndRef}
          />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
