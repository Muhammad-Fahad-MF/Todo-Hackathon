import typer
from rich.console import Console
from todo.manager import TaskManager # Import TaskManager

console = Console()
app = typer.Typer()
task_manager = TaskManager() # Instantiate TaskManager

@app.command()
def start():
    """Starts the Todo application REPL."""
    console.print("[bold blue]Welcome to the Todo App![/bold blue]")
    while True:
        try:
            command_line = console.input("[bold green]TodoApp> [/bold green]").strip()
            if not command_line:
                continue

            command_parts = command_line.split(maxsplit=1)
            command = command_parts[0].lower()
            args = command_parts[1] if len(command_parts) > 1 else ""

            if command == "exit":
                console.print("[bold blue]Exiting Todo App. Goodbye![/bold blue]")
                break
            elif command == "add":
                title = ""
                description = ""

                # If args provided, try to parse title and description
                if args:
                    # Simple parsing: first part is title, rest is description
                    # This could be improved with more robust parsing/quoting
                    arg_parts = args.split('"', 2) # split by quote, for "title" "description"
                    if len(arg_parts) > 1 and arg_parts[0].strip() == '':
                        title = arg_parts[1].strip()
                        if len(arg_parts) > 2 and arg_parts[2].strip().startswith('"'):
                            description = arg_parts[2].strip()[1:].strip()
                        elif len(arg_parts) > 2:
                            description = arg_parts[2].strip()
                    else: # No quotes, assume first word is title, rest is description
                        first_space = args.find(' ')
                        if first_space != -1:
                            title = args[:first_space].strip()
                            description = args[first_space+1:].strip()
                        else:
                            title = args.strip()

                if not title: # If title is still empty, prompt for it
                    title = console.input("  Enter task title: ").strip()
                
                if not title:
                    console.print("[bold red]Error: Task title cannot be empty.[/bold red]")
                    continue

                if not description and (args == "" or not args.startswith('"')): # Only prompt if no description was given in args AND args wasn't a quoted string
                    description = console.input("  Enter task description (optional): ").strip()
                
                try:
                    new_task = task_manager.add_task(title, description)
                    console.print(f"[bold green]Task '{new_task.title}' added with ID {new_task.id}.[/bold green]")
                except ValueError as e:
                    console.print(f"[bold red]Error: {e}[/bold red]")

            elif command == "list":
                tasks = task_manager.list_tasks()
                if not tasks:
                    console.print("[bold yellow]No tasks found.[/bold yellow]")
                else:
                    console.print("[bold blue]Your Tasks:[/bold blue]")
                    for task in tasks:
                        status_color = "green" if task.status == "Completed" else "yellow"
                        console.print(f"  ID: {task.id}, Title: {task.title}, Status: [{status_color}]{task.status}[/{status_color}], Description: {task.description}")
            elif command == "complete":
                if not args:
                    task_id_str = console.input("  Enter task ID to complete: ").strip()
                else:
                    task_id_str = args.strip()

                try:
                    task_id = int(task_id_str)
                    task = task_manager.find_task_by_id(task_id) # Need to find the task first
                    if task:
                        if task.status == "Completed":
                            console.print(f"[bold yellow]Task {task_id} is already Completed.[/bold yellow]")
                        else:
                            updated_task = task_manager.update_task_status(task_id, "Completed")
                            if updated_task:
                                console.print(f"[bold green]Task {updated_task.id} marked as Completed.[/bold green]")
                            else:
                                console.print(f"[bold red]Error: Could not update task {task_id}.[/bold red]")
                    else:
                        console.print(f"[bold red]Error: Task with ID {task_id} not found.[/bold red]")
                except ValueError:
                    console.print("[bold red]Invalid ID: Please enter a number.[/bold red]")
            elif command == "delete":
                if not args:
                    task_id_str = console.input("  Enter task ID to delete: ").strip()
                else:
                    task_id_str = args.strip()

                try:
                    task_id = int(task_id_str)
                    if task_manager.delete_task(task_id):
                        console.print(f"[bold green]Task {task_id} deleted.[/bold green]")
                    else:
                        console.print(f"[bold red]Error: Task with ID {task_id} not found.[/bold red]")
                except ValueError:
                    console.print("[bold red]Invalid ID: Please enter a number.[/bold red]")
            else:
                console.print(f"[bold red]Error: Unknown command '{command}'.[/bold red] Type 'help' for commands.")
        except EOFError:
            console.print("\n[bold blue]Exiting Todo App. Goodbye![/bold blue]")
            break
        except Exception as e:
            console.print(f"[bold red]An unexpected error occurred: {e}[/bold red]")

if __name__ == "__main__":
    app()
