// main.js
let sidebarList = document.createElement('ul');;

const themeToggleButton = document.getElementById('toggle-theme');
const bodyElement = document.body;
const sidebarElement = document.querySelector('.sidebar');
const mainContentElement = document.querySelector('.main-content');

themeToggleButton.addEventListener('click', function () {
    if (bodyElement.classList.contains('dark-theme')) {
        bodyElement.classList.remove('dark-theme');
        sidebarElement.classList.remove('dark-theme');
        mainContentElement.classList.remove('dark-theme');
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        bodyElement.classList.add('dark-theme');
        sidebarElement.classList.add('dark-theme');
        mainContentElement.classList.add('dark-theme');
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

let deletedSectionsCounter = 0;
let sections = {
    "Section 1": "Details for Section 1",
    "Section 2": "Details for Section 2",
    "Section 3": "Details for Section 3",
};
const populateSidebar = () => {
    sidebarList.innerHTML = '';
    Object.keys(sections).forEach(section => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<i class="fas fa-angle-right"></i> ${section}`;
        listItem.setAttribute('data-section-name', section);
        listItem.setAttribute('draggable', 'true');

        listItem.addEventListener('click', function () {
            const currentSectionName = listItem.getAttribute('data-section-name');
            const detailsContainer = document.createElement('div');
            const toggleButton = document.createElement('button');
            toggleButton.innerHTML = '<i class="fas fa-eye"></i> Toggle Details';
            toggleButton.addEventListener('click', function () {
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            });
            detailsContainer.innerHTML = sections[currentSectionName];
            detailsContainer.style.display = 'none';
            const detailsArea = document.querySelector('.details-area');
            detailsArea.innerHTML = '';
            detailsArea.appendChild(toggleButton);
            detailsArea.appendChild(detailsContainer);
        });

        listItem.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', listItem.getAttribute('data-section-name'));
        });

        const editBtn = document.createElement('span');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const currentSectionName = listItem.getAttribute('data-section-name');
            const newName = prompt('Enter new name:', currentSectionName);
            if (newName && newName !== currentSectionName) { // Check if the name actually changed
                sections[newName] = sections[currentSectionName];
                delete sections[currentSectionName];
                populateSidebar(); // Repopulate sidebar to reflect changes
            }
        });

        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const currentSectionName = listItem.getAttribute('data-section-name');
            const confirmDelete = window.confirm(`Are you sure you want to delete ${currentSectionName}?`);
            if (confirmDelete) {
                listItem.remove();
                delete sections[currentSectionName];
                deletedSectionsCounter++;
            }
        });

        listItem.appendChild(editBtn);
        listItem.appendChild(deleteBtn);
        sidebarList.appendChild(listItem);
    });
};
document.addEventListener("DOMContentLoaded", function () {



    sidebarList.className = 'sidebar-list';



    populateSidebar();

    document.querySelector('.sidebar').appendChild(sidebarList);

    const fab = document.querySelector('.fab');
    let sectionCounter = 4;

    fab.addEventListener('click', function () {
        let newSection;
        if (deletedSectionsCounter > 0) {
            // Use the counter value before decrementing
            newSection = `Section ${sectionCounter - deletedSectionsCounter}`;
            deletedSectionsCounter--;
        } else {
            newSection = `Section ${sectionCounter}`;
            sectionCounter++;
        }
        sections[newSection] = `Details for ${newSection}`;
        populateSidebar();  // Repopulate to include new section
    });

    document.getElementById('search-bar').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const listItems = document.querySelectorAll('.sidebar-list li');
        listItems.forEach(item => {
            const sectionName = item.getAttribute('data-section-name').toLowerCase();
            item.style.display = sectionName.includes(query) ? 'block' : 'none';
        });
    });

    document.getElementById('toggle-sidebar').addEventListener('click', function () {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });
});


// main.js

// ... Existing JavaScript code ...

// Function to save sidebar state
const saveSidebarState = (isCollapsed) => {
    localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
};

// Function to load sidebar state
const loadSidebarState = () => {
    return localStorage.getItem('sidebarState');
};

// Function to handle sidebar state
const handleSidebarState = (isCollapsed) => {
    if (isCollapsed) {
        sidebarElement.classList.add('collapsed');
        expandButton.style.display = 'block'; // Show the expand button
    } else {
        sidebarElement.classList.remove('collapsed');
        expandButton.style.display = 'none'; // Hide the expand button
    }
};

// const sidebarElement = document.querySelector('.sidebar');
const collapseButton = document.getElementById('collapse-sidebar');
const expandButton = document.getElementById('expand-sidebar');

// Load saved state from local storage
const savedState = loadSidebarState();
handleSidebarState(savedState === 'collapsed');

// Update the collapse button click event
collapseButton.addEventListener('click', function () {
    const isCollapsed = sidebarElement.classList.contains('collapsed');
    saveSidebarState(!isCollapsed);
    handleSidebarState(!isCollapsed);
});

// Add click event for the expand button
expandButton.addEventListener('click', function () {
    saveSidebarState(false);
    handleSidebarState(false);
});

// ... Rest of the JavaScript code ...



// ... Existing JavaScript code ...

// Function to rearrange the sections
const rearrangeSections = (draggedSectionName, targetSectionName) => {
    const temp = sections[draggedSectionName];
    delete sections[draggedSectionName];

    const reorderedSections = {};
    Object.keys(sections).forEach((section) => {
        if (section === targetSectionName) {
            reorderedSections[draggedSectionName] = temp;
        }
        reorderedSections[section] = sections[section];
    });

    sections = { ...reorderedSections };
    populateSidebar();
};

// Add dragover event
sidebarList.addEventListener('dragover', function (e) {
    e.preventDefault();
});

// Add drop event
sidebarList.addEventListener('drop', function (e) {
    e.preventDefault();

    const draggedSectionName = e.dataTransfer.getData('text/plain');
    const target = e.target.closest('li');

    if (target && target.getAttribute('data-section-name') !== draggedSectionName) {
        rearrangeSections(draggedSectionName, target.getAttribute('data-section-name'));
    }
});

// ... Rest of the JavaScript code ...
