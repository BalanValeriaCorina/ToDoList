const tasksContainer = document.getElementById('tasks-container');
const zenModal = document.getElementById('zen-modal');
const zenModalOpener = document.getElementById('zen-modal-opener');
const zenModalCloser = zenModal.children[0].children[0];

const zenAudio = document.getElementById('zen-audio');
const zenPlayButton = document.getElementById('zen-play-button');


var dragTask;
var draggedOverTask;

function registerTask(taskName) {
    let tasks = localStorage.getItem('tasks');
    if (!tasks) {
        localStorage.setItem('tasks', JSON.stringify([taskName]));
    }
    else {
        let tasksArray = JSON.parse(tasks);
        tasksArray.push(taskName)
        localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }
}

/**
 * Creates a new task element, adds it to the DOM.
 * @param {string} taskName The name of the new task
 * @param {boolean} newTask It's a flag that lets the function manage the creation of both new task elements as well
 * as recreating new tasks when the page refreshes.
 */
function addTask(taskName, newTask=false) {
    console.log("Added task: " + taskName)

    if (newTask) {
        registerTask(taskName);
    }

    // Create a new task container
    let newTaskWrapper = document.createElement("div");
    newTaskWrapper.classList.add("flex", "p-2", "task-wrapper", "justify-between");
    newTaskWrapper.draggable = true;

    newTaskWrapper.addEventListener("dragstart", event => startedTaskDragging(event));
    newTaskWrapper.addEventListener("dragover", event => taskWasDraggedOver(event));
    document.addEventListener("drop", event => taskDrop(event));

    // Create the element that displays the task name
    let taskHeader = document.createElement("h2");
    taskHeader.classList.add("text-xl", "text-white");
    taskHeader.textContent = taskName;

    // Create controls div
    let controlsContainer = document.createElement("div");
    controlsContainer.classList.add("flex", "justify-center")

    // Create datetime picker
    let datePicker = document.createElement("input");
    datePicker.style.backgroundColor = "white";
    datePicker.style.borderWidth = "0";
    datePicker.style.borderRadius = ".25rem";
    datePicker.style.marginRight = ".5rem";
    datePicker.type = "datetime-local";

    // Create DONE button
    let doneButton = document.createElement("button");
    doneButton.classList.add("bg-transparent");
    doneButton.textContent = "Done";
    doneButton.addEventListener("click", () => completeTask(newTaskWrapper));

    // Add elements to DOM in the tasks container
    newTaskWrapper.appendChild(taskHeader);
    newTaskWrapper.appendChild(controlsContainer);
    controlsContainer.appendChild(datePicker);
    controlsContainer.appendChild(doneButton);
    tasksContainer.appendChild(newTaskWrapper);
}

function addTaskOnEnter() {
    let newTaskInput = document.getElementById('new-task-input');
    document.addEventListener('keypress', e => {
        // If the input is focused and you press eneter, I add a new task to your list
        if (e.code === "Enter" && newTaskInput === document.activeElement && newTaskInput.value.trim() != "") {
            addTask(newTaskInput.value, true);
            newTaskInput.value = "";
        }
    });
}

function addTaskOnButtonPress() {
    let newTaskInput = document.getElementById('new-task-input');
    let newTaskButton = document.getElementById('new-task-button');

    newTaskButton.addEventListener('click', () => {
        if (newTaskInput.value.trim() != "") {
            addTask(newTaskInput.value, true);
            newTaskInput.value = "";
        }
    });
}

/**
 * Handles the drag start event.
 * @param {Event} event The start drag event
 */
function startedTaskDragging(event) {
    dragTask = event.target;
}

function taskWasDraggedOver(event) {
    event.preventDefault();
    draggedOverTask = event.target;
}

function taskDrop(event) {
    event.preventDefault();

    if(dragTask && draggedOverTask) {

        console.log(dragTask.children[0].textContent);
        console.log(draggedOverTask.children[0].textContent);

        let dragTaskName = dragTask.children[0].textContent;
        dragTask.children[0].textContent = draggedOverTask.children[0].textContent;
        draggedOverTask.children[0].textContent = dragTaskName;

        console.log(dragTask.children[0].textContent);
        console.log(draggedOverTask.children[0].textContent);

        dragTask = undefined;
        draggedOverTask = undefined;

        // Save the new order of the tasks
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = [];

        Array.from(tasksContainer.children).forEach(child => {
            tasks.push(child.children[0].textContent);
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function completeTask(wrapper) {
    // Find the index of this task
    var taskIndex;

    Array.from(tasksContainer.children).forEach((child, index) => {
        if (wrapper === child) {
            taskIndex = index;
        }
    });

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(taskIndex, 1);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    tasksContainer.removeChild(wrapper);
}

window.onload = function() {
    /** Register events */
    addTaskOnEnter();
    addTaskOnButtonPress()

    zenModalOpener.onclick = () => {
        zenModal.style.display = "block";
    }

    zenModalCloser.onclick = () => {
        zenModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === zenModal) {
            zenModal.style.display = "none";
        }
    }

    zenPlayButton.onclick = () => {
        if (zenAudio.paused) {
            zenPlayButton.src = "../assets/icons/pause.svg";
            zenAudio.play();
        }
        else {
            zenPlayButton.src = "../assets/icons/play.svg";
            zenAudio.pause();
        }
    }

    /** Reload the tasks from previous sessions */
    let tasks = localStorage.getItem('tasks');
    console.log(tasks)
    if (tasks) {
        let tasksArray = JSON.parse(tasks);
        tasksArray.forEach(task => {
            addTask(task); 
        });
    }
}
