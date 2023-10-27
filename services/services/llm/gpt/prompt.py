FUNCTIONS = [
    {
        "name": "run_python_code",
        "description": """

        Runs arbitrary Python code and returns stdout and stderr.
        The code is executed in an interactive shell, imports and variables are preserved between calls.
        The environment has internet and file system access.
        The current working directory is shared with the user, so files can be exchanged.
        There are many libraries pre-installed, including numpy, pandas, matplotlib, and scikit-learn.
        You cannot show rich outputs like plots or images, but you can store them in the working directory and point the user to them.

        If you encounter a zip file, unzip it and inspect the contents.
        If you encounter a tabular data file, load it, and inspect the column names.
        If the tabular file contains multiple sheets (like in an .xlsx), inspect every sheet therein, and then the column names.
""",
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
