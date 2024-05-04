document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the class "nav"
    let navItems = document.querySelectorAll(".nav");

    // Get all elements with the class "container"
    let containers = document.querySelectorAll(".container");

    // Loop through each navbar item
    navItems.forEach(function(navItem) {
        // Add click event listener to each navbar item
        navItem.addEventListener('click', function() {
            let targetId = this.getAttribute("data-target");
            
            // Hide all containers
            containers.forEach(function(container) {
                container.classList.add("hide");
            });
            
            // Show the selected container
            document.getElementById(targetId).classList.remove("hide");
        });
    });

    // Loop through each container
    containers.forEach(function(container) {
        // Load content from local storage for each container
        let containerId = container.id;
        let savedContent = localStorage.getItem(containerId + "_content");
        if (savedContent) {
            let taskInput = container.querySelector('.taskInput');
            taskInput.value = savedContent;
        }

        // Add event listener to save content to local storage when input changes
        let taskInput = container.querySelector('.taskInput');
        taskInput.addEventListener('input', function() {
            localStorage.setItem(containerId + "_content", this.value);
        });

        // Load tasks from local storage
        let savedTasks = localStorage.getItem(containerId + "_tasks");
        let tasks = savedTasks ? JSON.parse(savedTasks) : [];

        // Display tasks
        function displayTasks() {
            let taskList = container.querySelector('.taskList');
            taskList.innerHTML = '';
            tasks.forEach(function(task, index) {
                let li = document.createElement('li');
                li.textContent = task;

                // Add event listener to toggle task completion
                li.addEventListener('click', function() {
                    toggleTaskCompletion(index);
                });

                // Add line-through style for completed tasks
                if (task.startsWith('✔')) {
                    li.style.textDecoration = 'line-through';
                }

                // Create delete button
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = '❌';
                deleteBtn.classList.add('delete-btn'); // Add a class for styling
                deleteBtn.addEventListener('click', function(event) {
                    event.stopPropagation(); // Prevent task toggle when clicking delete button
                    deleteTask(index);
                });
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            });
        }

        // Function to toggle task completion
        function toggleTaskCompletion(index) {
            tasks[index] = tasks[index].startsWith('✔') ? tasks[index].substring(2) : '✔ ' + tasks[index];
            localStorage.setItem(containerId + "_tasks", JSON.stringify(tasks));
            displayTasks();
        }

        // Function to delete task
        function deleteTask(index) {
            tasks.splice(index, 1);
            localStorage.setItem(containerId + "_tasks", JSON.stringify(tasks));
            displayTasks();
        }

        displayTasks();

        // Add new task
        let addTaskBtn = container.querySelector('.addTaskBtn');
        addTaskBtn.addEventListener('click', function() {
            let taskInput = container.querySelector('.taskInput');
            let task = taskInput.value.trim();
            if (task !== '') {
                tasks.push(task);
                localStorage.setItem(containerId + "_tasks", JSON.stringify(tasks));
                displayTasks();
                taskInput.value = '';
            }
        });
    });
});
