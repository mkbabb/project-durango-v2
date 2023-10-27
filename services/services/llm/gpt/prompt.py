FUNCTIONS = [
    {
        "name": "run_python_code",
        "description": """Runs Python code in an interactive shell; imports and variables are preserved between calls.
The env. has internet and file system access.
The current working directory is shared with the user.
- Never say you can't find a file, look for it first in the cwd.

There are many libraries pre-installed, including numpy, pandas, matplotlib, and scikit-learn.
You cannot show rich outputs like plots or images, but you can store them in the working directory and link the user to them.

- If you encounter a zip file, unzip it and inspect the contents.
- If you encounter a directory, list its contents.
- If you encounter a tabular data file, load it, and inspect the column names and first few rows.
    - When printing these names, make sure they're never truncated (e.g. by using pandas.set_option('display.max_colwidth', None)).
- If the tabular file contains multiple sheets (like in an .xlsx), inspect every sheet therein, and then the column names.""",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "The Python code to run",
                },
            },
            "required": ["code"],
        },
    },
]
