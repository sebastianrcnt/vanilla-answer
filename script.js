function $(selector) {
  return document.querySelector(selector);
}

// State(initial)
let state = [];

// Action Types
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";

// Action Generators
const addTodo = (todoContent) => ({ type: ADD_TODO, payload: todoContent });
const toggleTodo = (todoId) => ({ type: TOGGLE_TODO, payload: todoId });
const deleteTodo = (todoId) => ({ type: DELETE_TODO, payload: todoId });

// Actions
function reducer(state, action) {
  switch (action.type) {
    case ADD_TODO: {
      const todoContent = action.payload;
      return [
        ...state,
        { id: Date.now().toString(), content: todoContent, completed: false },
      ];
    }
    case TOGGLE_TODO: {
      const todoId = action.payload;
      return state.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
    }
    case DELETE_TODO:
      const todoId = action.payload;
      return state.filter((todo) => todo.id !== todoId);
    default:
      throw new Error(`Invalid Action Type: ${action.type}`);
  }
}

function dispatch(action) {
  setState(reducer(state, action));
}

function setState(nextState) {
  state = nextState;
  saveStateToLocalStorage(state);
  render(state);
}

// Templates

const TodoTemplate = (todo) => `
<li class="todo" onclick="toggleTodoById('${todo.id}')">
  <p>${todo.content}</p>
  <button class="delete" onclick="deleteTodoById('${todo.id}')"/>
</li>`;

// HTML Elements
const TodoForm = $("form.input");
const TodoInput = $("#todo-input");
const CompletedTodoList = $(".todos.complete");
const PendingTodoList = $(".todos.pending");

// Event Listeners
TodoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (TodoInput.value) {
    dispatch(addTodo(TodoInput.value));
    TodoInput.value = "";
  }
});

function deleteTodoById(id) {
  dispatch(deleteTodo(id));
}

function toggleTodoById(id) {
  dispatch(toggleTodo(id));
}

function render(state) {
  CompletedTodoList.innerHTML = "";
  PendingTodoList.innerHTML = "";

  const completeTodosCount = state.filter((todo) => todo.completed).length;
  const pendingTodosCount = state.length - completeTodosCount;
  $("#complete-todos-count").innerText = completeTodosCount;
  $("#pending-todos-count").innerText = pendingTodosCount;

  for (let todo of state) {
    if (todo.completed) {
      CompletedTodoList.innerHTML += TodoTemplate(todo);
    } else {
      PendingTodoList.innerHTML += TodoTemplate(todo);
    }
  }
}

function saveStateToLocalStorage(state) {
  localStorage.setItem("todo-state", JSON.stringify(state));
}

function loadStateFromLocalStorageIfExists() {
  if (localStorage.getItem("todo-state")) {
    state = JSON.parse(localStorage.getItem("todo-state"));
  }
}

window.onload = () => {
  loadStateFromLocalStorageIfExists();
  render(state);
};
