FUNCTIONS = [
    {
        "name": "run_python_code",
        "description": """Runs Python code in an interactive shell; imports and variables are preserved between calls.
The env. has internet and file system access.
The current working directory is shared with the user.

There are many libraries pre-installed, including numpy, pandas, matplotlib, and scikit-learn.
You cannot show rich outputs like plots or images, but you can store them in the working directory and link the user to them.
You can unzip files, list directories, and read files in the working directory.
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
