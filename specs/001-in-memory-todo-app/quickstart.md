# Quickstart Guide: In-Memory Todo Console Application

This guide will help you set up and run the In-Memory Todo Console Application.

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Python 3.13+**: The application is developed with strict type hinting for Python 3.13 and newer.
    -   You can download Python from [python.org](https://www.python.org/downloads/).
    -   Verify your Python version:
        ```bash
        python3 --version
        ```
2.  **uv**: A fast Python package installer and resolver.
    -   Install `uv` (if you don't have it) by following the instructions on their GitHub page or via `pipx`:
        ```bash
        pipx install uv
        ```
    -   Verify `uv` installation:
        ```bash
        uv --version
        ```

## Setup and Run

Follow these steps to get the application running:

1.  **Clone the Repository**:
    If you haven't already, clone the project repository:
    ```bash
    git clone <repository_url>
    cd Todo-Hackathon
    ```
    (Replace `<repository_url>` with the actual URL of your repository.)

2.  **Install Dependencies**:
    Navigate to the project root directory and install the required dependencies using `uv`:
    ```bash
    uv pip install -r requirements.txt
    ```
    *(Note: Assuming `requirements.txt` will be generated or exists, containing `rich` and any other necessary packages. If not, `uv pip install rich` would be an alternative.)*

3.  **Run the Application**:
    Execute the application using `uv run`. The main entry point is `src/main.py`.
    ```bash
    uv run python src/main.py
    ```

    You should now see the welcome banner and the REPL prompt, ready to accept commands.

## Basic Usage

Once the application is running, you can use the following commands:

-   `add "Task Title" "Optional Description"`: Add a new task.
-   `list`: Display all tasks.
-   `complete <ID>`: Mark a task as completed.
-   `delete <ID>`: Remove a task.
-   `exit`: Terminate the application.

Enjoy managing your tasks!