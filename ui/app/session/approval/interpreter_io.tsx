import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
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
          askApprove ? "border-red-400" : "border-transparent"
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
            style={docco}
            className="!overflow-x-visible bg-zinc-700"
          >
            {content ?? ""}
          </SyntaxHighlighter>
        )}
      </div>
      <div className="flex justify-end items-center my-2 text-green-500 ">
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
          className="ml-4 px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-md"
          onClick={() => approver.approve(false)}
          disabled={!askApprove || disabled}
        >
          Reject
        </button>
        <button
          className="ml-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-md"
          onClick={() => approver.approve(true)}
          disabled={!askApprove || disabled}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
