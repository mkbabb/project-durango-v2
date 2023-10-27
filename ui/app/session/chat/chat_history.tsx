import { Message } from "@/app/session/communication/message";
import { TbUser } from "react-icons/tb";
import React from "react";

export default function ChatHistory({
  history,
  thinking,
}: {
  history: Message[];
  thinking: boolean;
}) {
  const historyFiltered = history.filter(
    (msg, idx) =>
      msg.role === "user" ||
      (msg.role === "model" &&
        (msg.text !== undefined || (thinking && idx == history.length - 1))),
  );

  return (
    <div className="mt-auto">
      {historyFiltered.map((msg, idx) => (
        <div key={idx} className="flex mt-4">
          {msg.role === "model" ? (
            <div className="mr-4 mt-2 min-w-[36px] relative">
              <img src="./icon.png" alt="robot" width={36} />
              {thinking && idx === historyFiltered.length - 1 && (
                <img
                  src="./thinking.gif"
                  alt="thinking"
                  className="absolute block w-[30px] top-[-20px] right-[-30px] z-10"
                />
              )}
            </div>
          ) : (
            <div className="flex-1 min-w-[20px]" />
          )}
          <div
            className={
              "drop-shadow-md rounded-md p-4 whitespace-pre-wrap text-white " +
              (msg.role === "user" ? "bg-zinc-600" : "bg-zinc-400")
            }
          >
            {msg.text === "" || msg.text === undefined ? "..." : msg.text}
          </div>
          {msg.role === "user" ? (
            <div className="ml-4 mt-2">
              <TbUser size={36} />
            </div>
          ) : (
            <div className="flex-1 min-w-[20px]" />
          )}
        </div>
      ))}
    </div>
  );
}
