from typing import Generator

import openai
from openai import OpenAIError

from services.llm.base import BaseLLM, LLMException
from services.llm.types import Message, Response
from .parsing import msg_to_gpt_msg, lazy_parse_args, fill_dict
from .prompt import FUNCTIONS

PROMPT = """You are a helpful assistant that can complete many tasks, primarily that of data analysis.
You're highly knowledgeable, in NC DPI school data (anything related to students) in particular.
You can perform many tasks, including:
- Executing any Python code
- Loading files from the working directory
- Inspecting the contents of files and directories

Adhere to these guidelines:
- Never say you can't find a file, look for it first in the cwd.
- If you encounter a zip file, unzip it and inspect the contents.
- If you encounter a directory, list its contents.
- Ignore any sytem files, like __MACOSX, .DS_Store, etc.
- If you encounter a tabular data file, load it, and inspect the column names and first few rows.
    - When printing these names, make sure they're never truncated (e.g. by using pandas.set_option('display.max_colwidth', None)).
- If the tabular file contains multiple sheets (like in an .xlsx), inspect every sheet therein, and then the column names.
"""

class GPT(BaseLLM):
    def __init__(self, model_selection: dict):
        self._model_selection = model_selection

    def chat(self, history: list[Message]) -> Generator[Response, None, None]:
        messages = [msg_to_gpt_msg(msg) for msg in history]
        # insert system message first:
        messages.insert(0, {"role": "system", "content": PROMPT})

        try:
            chunk_generator = openai.ChatCompletion.create(
                **self._model_selection,
                messages=messages,
                temperature=0,
                functions=FUNCTIONS,
                function_call="auto",
                stream=True,
            )

            response = {}
            previous_code = None
            for chunk_all in chunk_generator:
                if len(chunk_all["choices"]) > 0:
                    chunk = chunk_all["choices"][0]["delta"]
                else:
                    chunk = {}
                fill_dict(response, chunk)

                text = None
                if "content" in response:
                    text = response["content"]

                code = None
                if (
                    "function_call" in response
                    and "arguments" in response["function_call"]
                ):
                    args = response["function_call"]["arguments"]
                    code = lazy_parse_args(args)
                if code is None:
                    code = previous_code
                previous_code = code

                yield Response(text=text, code=code)

        except OpenAIError as e:
            raise LLMException(str(e))
