import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Approver } from "@/app/session/approval/approver";
import Running from "@/app/session/approval/running";
import useScroller from "@/app/helper/scroller";

export default function InterpreterIO({
  title,
  content,
  askApprove,
  approver,
  autoApprove,
  disabled,
  busy,
  language,
}: {
  title: string;
  content: string | null;
  askApprove: boolean;
  approver: Approver;
  autoApprove: boolean;
  disabled: boolean;
  busy: boolean;
  language: string;
}) {
  const scrollRef = useScroller(content);

  return (
    <div className="h-full flex flex-col rounded-md">
      <div className="text-2xl font-bold mt-2 text-green-400">{title}</div>
      <div
        className={`flex-1 text-white rounded-md ${
          busy ? "bg-zinc-600" : "bg-zinc-700"
        } overflow-auto h-0 mt-2 ${
          askApprove ? "border-transparent" : "border-transparent"
        } border-2`}
        ref={scrollRef}
      >
        {busy ? (
          <div className="m-2">
            <Running />
          </div>
        ) : (
          <SyntaxHighlighter
            language={language}
            style={darcula}
            className="overflow-x-visible bg-zinc-700 h-full v-full"
          >
            {content ?? ""}
          </SyntaxHighlighter>
        )}
      </div>
      <div className="flex justify-end items-center my-2 text-zinc-300 ">
        <div>
          <input
            className="align-middle accent-green-500"
            type="checkbox"
            checked={autoApprove}
            onChange={(e) => approver.setAutoApprove(e.target.checked)}
            disabled={disabled}
          />{" "}
          auto-approve
        </div>
        <button
          className="ml-4 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md hover:cursor-pointer"
          onClick={() => approver.approve(true)}
          disabled={!askApprove || disabled}
        >
          Approve
        </button>
        <button
          className="ml-2 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md hover:cursor-pointer"
          onClick={() => approver.approve(false)}
          disabled={!askApprove || disabled}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
