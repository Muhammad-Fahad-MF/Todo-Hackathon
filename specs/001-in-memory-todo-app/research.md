# Research Notes

## CLI Command Parsing

- **Decision**: Implement a custom command parsing loop for the REPL interface.
- **Rationale**: Given the simplicity of the required commands (add, list, complete, delete, exit) and the REPL nature of the application, a custom parsing loop provides sufficient functionality with minimal overhead. This approach offers fine-grained control over command recognition and argument extraction without introducing a heavy dependency like `typer` or `click`, which are typically more suited for complex command-line applications with subcommands and extensive argument validation.
- **Alternatives considered**:
    - **Typer**: A modern, easy-to-use CLI library built on Pydantic. Provides excellent type hinting and automatic documentation.
    - **Click**: A widely adopted and powerful CLI creation kit.
    - **Reason for rejection**: Both `typer` and `click` introduce a level of abstraction and boilerplate that is not strictly necessary for this in-memory Todo application's command structure. The primary user interaction is through a continuous REPL, which can be efficiently managed with a simple `if/elif/else` structure and string manipulation for parsing user input. This aligns with the "Simplicity" principle of the project's constitution.