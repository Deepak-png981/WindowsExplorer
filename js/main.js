// main.js

// Updated hierarchical data structure
let sections = [
    {
        name: "Section 1",
        details: "Details for Section 1",
        children: [
            {
                name: "Subsection 1.1",
                details: "Details for Subsection 1.1",
                children: []
            },
            {
                name: "Subsection 1.2",
                details: "Details for Subsection 1.2",
                children: []
            }
        ]
    },
    {
        name: "Section 2",
        details: "Details for Section 2",
        children: [
            {
                name: "Subsection 2.1",
                details: "Details for Subsection 2.1",
                children: []
            },
            {
                name: "Subsection 2.2",
                details: "Details for Subsection 2.2",
                children: []
            }
        ]
    },
    {
        name: "Section 3",
        details: "Details for Section 3",
        children: []
    }
];

const themeToggleButton = document.getElementById('toggle-theme');
const bodyElement = document.body;
const sidebarElement = document.querySelector('.sidebar');
const mainContentElement = document.querySelector('.main-content');
let sidebarList = document.createElement('ul');;

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
const findSectionByName = (name, sections) => {
    for (let section of sections) {
        if (section.name === name) return section;
        if (section.children.length) {
            const found = findSectionByName(name, section.children);
            if (found) return found;
        }
    }
    return null;
};
const updateSectionName = (oldName, newName, sections) => {
    for (let section of sections) {
        if (section.name === oldName) {
            section.name = newName;
            return true;
        }
        if (section.children.length) {
            if (updateSectionName(oldName, newName, section.children)) return true;
        }
    }
    return false;
};
const deleteSectionByName = (name, sections) => {
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].name === name) {
            sections.splice(i, 1);
            return true;
        }
        if (sections[i].children.length) {
            if (deleteSectionByName(name, sections[i].children)) return true;
        }
    }
    return false;
};
const createTreeItem = (section, parentList) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<i class="fas fa-angle-right"></i> ${section.name}`;
    listItem.setAttribute('data-section-name', section.name);
    listItem.setAttribute('draggable', 'true');

    // List item click event
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

    // Drag event
    listItem.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', listItem.getAttribute('data-section-name'));
        console.log('Dragging:', listItem.getAttribute('data-section-name')); // Add this line
    });
    listItem.querySelector('.fas.fa-angle-right').addEventListener('click', function () {
        const childList = listItem.querySelector('.child-list');
        if (childList) {
            if (childList.style.display === 'none' || !childList.style.display) {
                childList.style.display = 'block';
                this.classList.add('fa-angle-down');
                this.classList.remove('fa-angle-right');
            } else {
                childList.style.display = 'none';
                this.classList.add('fa-angle-right');
                this.classList.remove('fa-angle-down');
            }
        }
    });

    // Edit button
    const editBtn = document.createElement('span');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const currentSectionName = listItem.getAttribute('data-section-name');
        const newName = prompt('Enter new name:', currentSectionName);
        if (newName && newName !== currentSectionName) {
            updateSectionName(currentSectionName, newName, sections);
            populateSidebar(); // Repopulate sidebar to reflect changes
        }
    });

    // Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const currentSectionName = listItem.getAttribute('data-section-name');
        const confirmDelete = window.confirm(`Are you sure you want to delete ${currentSectionName}?`);
        if (confirmDelete) {
            deleteSectionByName(currentSectionName, sections);
            populateSidebar();
        }
    });
    // add child button
    const addChildBtn = document.createElement('span');
    addChildBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addChildBtn.className = 'add-child-btn';
    addChildBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const currentSectionName = listItem.getAttribute('data-section-name');
        const section = findSectionByName(currentSectionName, sections);
        if (section) {
            const newChildName = prompt('Enter name for the new child section:');
            if (newChildName) {
                section.children.push({
                    name: newChildName,
                    details: `Details for ${newChildName}`,
                    children: []
                });
                populateSidebar();  // Repopulate sidebar to reflect changes
            }
        }
    });
    listItem.appendChild(addChildBtn);



    listItem.appendChild(editBtn);
    listItem.appendChild(deleteBtn);
    parentList.appendChild(listItem);

    // Recursive creation of child nodes
    if (section.children && section.children.length) {
        const childList = document.createElement('ul');
        childList.className = 'child-list';
        listItem.appendChild(childList);
        section.children.forEach(childSection => createTreeItem(childSection, childList));
    }
}

const populateSidebar = () => {
    sidebarList.innerHTML = '';
    sections.forEach(section => createTreeItem(section, sidebarList));
};

document.addEventListener("DOMContentLoaded", function () {

    sidebarList.className = 'sidebar-list';
    populateSidebar();

    document.querySelector('.sidebar').appendChild(sidebarList);

    // FAB click event
    const fab = document.querySelector('.fab');
    let sectionCounter = 4;

    fab.addEventListener('click', function () {
        let newSectionName;
        if (deletedSectionsCounter > 0) {
            // Use the counter value before decrementing
            newSectionName = `Section ${sectionCounter - deletedSectionsCounter}`;
            deletedSectionsCounter--;
        } else {
            newSectionName = `Section ${sectionCounter}`;
            sectionCounter++;
        }

        const newSection = {
            name: newSectionName,
            details: `Details for ${newSectionName}`,
            children: []
        };

        sections.push(newSection); // Add the new section to the sections array

        populateSidebar();  // Repopulate to include new section
    });

    // Search bar functionality
    document.getElementById('search-bar').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const listItems = document.querySelectorAll('.sidebar-list li');
        listItems.forEach(item => {
            const sectionName = item.getAttribute('data-section-name').toLowerCase();
            item.style.display = sectionName.includes(query) ? 'block' : 'none';
        });
    });

    // Sidebar toggle
    document.getElementById('toggle-sidebar').addEventListener('click', function () {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });
});

// ... Rest of your JavaScript code ...



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

// Helper function to find the parent of a section
const findParentOfSection = (name, sections, parent = null) => {
    for (let section of sections) {
        if (section.name === name) return parent;
        if (section.children.length) {
            const foundParent = findParentOfSection(name, section.children, section);
            if (foundParent) return foundParent;
        }
    }
    return null;
};

const rearrangeSections = (draggedSectionName, targetSectionName) => {
    const draggedSection = findSectionByName(draggedSectionName, sections);
    const draggedSectionParent = findParentOfSection(draggedSectionName, sections);
    const targetSectionParent = findParentOfSection(targetSectionName, sections);

    const parentArray = draggedSectionParent ? draggedSectionParent.children : sections;
    const targetArray = targetSectionParent ? targetSectionParent.children : sections;

    // Remove the dragged section from its original location
    parentArray.splice(parentArray.indexOf(draggedSection), 1);

    // Insert it before the target section
    targetArray.splice(targetArray.indexOf(findSectionByName(targetSectionName, sections)), 0, draggedSection);

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

    console.log('Dropped on:', target.getAttribute('data-section-name')); // Add this line

    if (target && target.getAttribute('data-section-name') !== draggedSectionName) {
        rearrangeSections(draggedSectionName, target.getAttribute('data-section-name'));
    }
});

// ... Rest of the JavaScript code ...
