import React from "react";
import { Message } from "@/app/session/communication/message";
import ChatInput from "@/app/session/chat/chat_input";
import ChatHistory from "@/app/session/chat/chat_history";
import InterpreterIO from "@/app/session/approval/interpreter_io";
import Interpreter from "@/app/session/communication/interpreter";
import { useApprover } from "@/app/session/approval/approver";
import {
  ChatRound,
  ChatRoundState,
} from "@/app/session/communication/chat_round";
import { Header } from "@/app/session/chat/header";
import Brand from "@/app/session/chat/brand";
import useScroller from "@/app/helper/scroller";
import { AUTH_ERROR_MSG, AuthContext } from "@/app/authentication";

export default function Session({
  refreshSession,
  version,
}: {
  refreshSession: () => void;
  version: string;
}) {
  const [history, setHistory] = React.useState<Message[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [showIO, setShowIO] = React.useState<boolean>(false);

  const [chatRoundState, setChatRoundState] =
    React.useState<ChatRoundState>("not active");
  const [approverIn, askApproveIn, autoApproveIn] = useApprover();
  const [approverOut, askApproveOut, autoApproveOut] = useApprover();

  const [codeResult, setCodeResult] = React.useState<string | null>(null);
  const chatInputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const interpreterRef = React.useRef<Interpreter | null>(null);
  if (interpreterRef.current === null) {
    interpreterRef.current = new Interpreter();
  }

  const authToken = React.useContext(AuthContext);

  const code = history.findLast((msg) => msg.code !== undefined)?.code ?? null;
  React.useEffect(() => {
    if (code !== null) {
      setShowIO(true);
    }
  }, [code]);

  const focusChatInput = () => {
    setTimeout(() => chatInputRef.current && chatInputRef.current.focus(), 100);
  };
  React.useEffect(focusChatInput, []);

  const startChatRound = (message: string) => {
    if (authToken === null) {
      setError(AUTH_ERROR_MSG);
      return;
    }
    const chatRound = new ChatRound(
      history,
      setHistory,
      approverIn,
      approverOut,
      interpreterRef.current!,
      setChatRoundState,
      setCodeResult,
      authToken,
    );
    chatRound
      .run(message)
      .then(focusChatInput)
      .catch((e) => {
        setError(e.message);
      });
  };

  const scrollRef = useScroller(history);

  return (
    <div className="relative h-full bg-zinc-700 overflow-x-hidden">
      <div
        className={`absolute top-0 left-0 h-full flex flex-col items-center transition-all duration-500 ${
          showIO ? "w-1/2" : "w-[calc(100%-100px)]"
        }`}
      >
        <Header
          error={error}
          onNew={refreshSession}
          showNew={history.length > 0}
        />
        <div
          className="flex-1 h-0 overflow-y-auto px-8 flex flex-col w-full max-w-6xl"
          ref={scrollRef}
        >
          {history.length === 0 ? (
            <Brand />
          ) : (
            <ChatHistory
              history={history}
              thinking={chatRoundState === "waiting for model"}
            />
          )}
        </div>
        <div className="px-16 mt-8 mb-4 w-full max-w-4xl">
          <ChatInput
            innerRef={chatInputRef}
            disabled={chatRoundState !== "not active" || error !== null}
            onMessage={startChatRound}
          />
        </div>
        <div className="text-zinc-700 italic text-center text-xs pb-4">
          Version {version}
        </div>
      </div>
      <div
        className={`absolute top-0 right-0 w-1/2 h-full flex flex-col px-4 bg-zinc-800 shadow-[0_0_25px_10px_rgba(0,0,0,0.15)] transition-all duration-250 ${
          showIO
            ? ""
            : "translate-x-[calc(100%-100px)] opacity-50 hover:transition-none hover:opacity-100 cursor-pointer"
        }`}
        onClick={() => {
            if (showIO) {
                setShowIO(false);
            } else {
                setShowIO(true);
            }
        }}
      >
        <div className="flex-1 flex flex-col h-0">
          <div className="flex-1 h-0">
            <InterpreterIO
              title="Code"
              content={code}
              askApprove={askApproveIn}
              autoApprove={autoApproveIn}
              approver={approverIn}
              disabled={error !== null}
              busy={false}
              language="python"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col h-0">
          <div className="flex-1 h-0">
            <InterpreterIO
              title="Result"
              content={codeResult}
              askApprove={askApproveOut}
              autoApprove={autoApproveOut}
              approver={approverOut}
              disabled={error !== null}
              busy={chatRoundState === "waiting for interpreter"}
              language="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
