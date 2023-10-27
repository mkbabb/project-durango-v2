import React from "react";
import { BiSend } from "react-icons/bi";

export default function ChatInput({
  innerRef,
  disabled,
  onMessage,
}: {
  innerRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  disabled: boolean;
  onMessage: (message: string) => void;
}) {
  const [message, setMessage] = React.useState<string>("");

  const canSend = !disabled && message.length > 0;

  const adjustSize = () => {
    const el = innerRef.current;
    if (el !== null) {
      el.style.height = "0";
      el.style.height = Math.min(el.scrollHeight, 24 * 4) + "px";
    }
  };

  const onSend = () => {
    if (canSend) {
      onMessage(message);
      setMessage("");
      innerRef.current!.value = "";
      adjustSize();
    }
  };

  return (
    <div>
      <div className="flex gap-2 bg-zinc-500 drop-shadow-lg border border-none rounded-md p-4 focus-within:border-neutral-500 text-white">
        <div className="flex-1">
          <textarea
            ref={innerRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustSize();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSend();
            }}
            disabled={disabled}
            placeholder={disabled ? "Please wait..." : "Send a message"}
            className="block bg-zinc-500 w-full outline-none border-none disabled:bg-transparent resize-none overflow-hidden"
            rows={1}
          />
        </div>
        <button onClick={onSend} disabled={!canSend}>
          <BiSend size={24}
          className={
            canSend ? "cursor-pointer text-green-400" : "cursor-not-allowed text-zinc-400"
          }
          
          />
        </button>
      </div>
    </div>
  );
}
