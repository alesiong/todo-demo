class Todo {
    id: number;
    name: string;
    description: string;
    dueDate: Date;

    constructor(id: number, name: string, dueDate: Date, description = '') {
        this.id = id;
        this.name = name;
        this.dueDate = dueDate;
        this.description = description;
    }
}


const todoList: Map<number, Todo> = new Map();
let maxId: number = 0;

///////////////////////////////////////////////////////////////////////////////

interface Dom {
    name: HTMLInputElement;
    desc: HTMLInputElement;
    due: HTMLInputElement;
    addButton: HTMLButtonElement;
    todoTable: HTMLTableElement;
    todoTemplate: HTMLTableRowElement;
}

let domTree: Dom;

function update() {
    const { name, desc, due } = domTree;
    name.value = '';
    desc.value = '';
    due.value = '';

    clearTodoList();
    buildTodoList();
}
function clearTodoList() {
    const toRemove: ChildNode[] = [];
    domTree.todoTable.firstElementChild!.childNodes.forEach((node) => {
        if ((node as HTMLTableRowElement).id=== '') {
            toRemove.push(node);
        }
    });

    for (const node of toRemove) {
        node.remove();
    }
}

function buildTodoList() {
    todoList.forEach((todo, id) => {
        const todoRow = domTree.todoTemplate.cloneNode(true) as HTMLTableRowElement;
        let name: HTMLTableDataCellElement | null = null;
        let desc: HTMLTableDataCellElement | null = null;
        let due: HTMLTableDataCellElement | null = null;
        let finish: HTMLTableDataCellElement | null = null;
        todoRow.childNodes.forEach((node) => {
            const n = node as HTMLTableDataCellElement;
            switch (n.className) {
                case 'name':
                    name = n;
                    break;
                case 'desc':
                    desc = n;
                    break;
                case 'due':
                    due = n;
                    break;
                case 'finish':
                    finish = n;
                    break;
            }
        });
        name!.textContent = todo.name;
        desc!.textContent = todo.description;
        due!.textContent = todo.dueDate.toDateString();
        const finishButton = finish!.childNodes[0] as HTMLButtonElement;
        finishButton.onclick = ((id) => {
            return () => {
                todoList.delete(id);
                update();
            };
        })(id);
        todoRow.style.display = 'table-row';
        todoRow.id = '';
        domTree.todoTable.firstElementChild!.appendChild(todoRow);
    });
}

///////////////////////////////////////////////////////////////////////////////

function main() {
    domTree = {
        name: document.getElementById('new_name') as HTMLInputElement,
        desc: document.getElementById('new_desc') as HTMLInputElement,
        due: document.getElementById('new_due') as HTMLInputElement,
        addButton: document.getElementById('add') as HTMLButtonElement,
        todoTable: document.getElementById('todo_table') as HTMLTableElement,
        todoTemplate: document.getElementById('todo_temp') as HTMLTableRowElement,
    };
    registerListener();
}

function registerListener() {
    domTree.addButton.onclick = onAdd;
}

function onAdd() {
    const todo = validateForm();
    if (todo === null) {
        alert('Please fill the name and due date');
        return;
    }
    todoList.set(todo.id, todo);
    update();
}

function validateForm(): Todo | null {
    const { name, desc, due } = domTree;
    if (name.checkValidity() && desc.checkValidity() && due.checkValidity()) {
        return new Todo(maxId++, name.value, new Date(due.value), desc.value);
    }
    return null;
}

window.onload = main;