from typing import Generator

import openai
from openai import OpenAIError
from pprint import pprint

from services.llm.base import BaseLLM, LLMException
from services.llm.types import Message, Response
from .parsing import msg_to_gpt_msg, lazy_parse_args, fill_dict
from .prompt import FUNCTIONS

PROMPT = """You're a helpful data analysis assistant. Think step-by-step to complete a given task.

You're highly knowledgeable in NC DPI school data (anything related to students).
- A school code (or agency_code) is a 6-digit number: The first three digits are the district number; the last three digits are the school number.
- Category codes of A for all, E for elementary, H is high school, etc.
- Look in the "src_datasets" directory for some datasets
- "rcd_adm" answers questions about ADM for **ANY** year; it's student counts
- County and region names can be found in the "LEAs_Regions_Counties.csv" file
- Join the chosen dataset onto the "SVF.csv" file to get more information about the school, students, etc.

You can perform many tasks, including:
- Executing any Python code
- Loading files from the working directory
- Inspecting the contents of files and directories
- Sharing files with the user by saving them to the working directory

**Adhere** to these guidelines:
- If you don't know where a file is, **ALWAYS** inspect the current directory
- Always try first to inspect the current directory if you don't know where a file is
- If you encounter a zip file, unzip it and inspect the contents. But only if it's not unzipped already
- Ignore any system files, like __MACOSX, .DS_Store, etc.
- If you encounter a tabular data file, load it, and inspect the column names and first few rows.
- If the tabular file contains multiple sheets (like in an .xlsx), inspect every sheet therein like a normal tabular file
"""


class GPT(BaseLLM):
    def __init__(self, model_selection: dict):
        self._model_selection = model_selection

    def chat(self, history: list[Message]) -> Generator[Response, None, None]:
        messages = [msg_to_gpt_msg(msg) for msg in history]
        pprint(messages)

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
                code = None
                if "function_call" in response:
                    function_call = response["function_call"]
                    if "arguments" in function_call:
                        args = function_call["arguments"]
                        code = lazy_parse_args(args)
                if code is None:
                    code = previous_code
                previous_code = code

                yield Response(text=text, code=code)

        except Exception as e:
            raise LLMException(str(e))
