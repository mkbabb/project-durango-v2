import re
import json

from services.llm.types import Message
import textwrap


def msg_to_gpt_msg(msg: Message) -> dict:
    if msg.role == "user":
        return {"role": "user", "content": msg.text}
    if msg.role == "model":
        response = {
            "role": "assistant",
            "content": msg.text or None,
        }
        if msg.code:
            response["function_call"] = {
                "name": "run_python_code",
                "arguments": json.dumps({"code": msg.code}),
            }
        return response
    if msg.role == "interpreter":
        return {
            "role": "function",
            "name": "run_python_code",
            "content": msg.code_result,
        }
    raise ValueError(f"Invalid message role {msg.role}")


def lazy_parse_args(args_partial: str):
    try:
        args = json.loads(args_partial)
        if "code" not in args:
            return None

        return args["code"]
    except json.JSONDecodeError:
        args_partial = args_partial.strip()

        if "code" in args_partial:
            if args_partial.startswith('{"code":'):
                args_partial = args_partial.removeprefix('{"code":')
                args_partial = args_partial.strip('"')
                args_partial = args_partial.strip("'")
                args_partial = args_partial.removesuffix("}")

                args_partial = textwrap.fill(args_partial, width=60)
               
                args_partial = args_partial.replace("\n", " \n")
            else:
                args_partial = "..."

        return args_partial


def fill_dict(dst: dict, chunk: dict):
    for key in chunk:
        if chunk[key] is None:
            dst[key] = None
        elif isinstance(chunk[key], dict):
            if key not in dst:
                dst[key] = {}
            fill_dict(dst[key], chunk[key])
        elif isinstance(chunk[key], str):
            if key not in dst:
                dst[key] = ""
            dst[key] += chunk[key]
        else:
            raise ValueError(f"Unsupported type {type(chunk[key])}")
