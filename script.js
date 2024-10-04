// Behavior data
const behaviorsData = [
    "Review customer info",
    "Discover interests",
    "Preempt potential issues",
    "Win a friend",
    "Establish customer baseline",
    "Outline appointment",
    "Preempt objections",
    "Customize/Build Value",
    "Verify understanding",
    "Solution/Cost review",
    "Overcome objections",
    "Start transaction",
    "Set work expectations",
    "Outline benefits",
    "Review completed work",
    "Educate customer",
    "Benefits followup"
];

let placedBehaviors = 0; // Track the number of placed behaviors

// Randomly distribute behaviors into 5 columns with a max of 4 items each
function distributeBehaviors() {
    const behaviorsContainer = document.getElementById('behaviors-container');
    const columns = [[], [], [], [], []]; // Initialize 5 empty columns
    let remainingBehaviors = [...behaviorsData]; // Clone the behavior data for manipulation

    // Randomly assign behaviors to columns
    while (remainingBehaviors.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingBehaviors.length);
        const behavior = remainingBehaviors.splice(randomIndex, 1)[0];

        // Find a column with fewer than 4 items
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].length < 4) {
                columns[i].push({ text: behavior, columnIndex: i }); // Store column index
                break;
            }
        }
    }

    // Create the grid columns in the container
    behaviorsContainer.innerHTML = ''; // Clear existing content
    columns.forEach((column, index) => {
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('column');
        column.forEach(behavior => {
            const behaviorElement = document.createElement('div');
            behaviorElement.classList.add('behavior');
            behaviorElement.setAttribute('draggable', 'true');
            behaviorElement.setAttribute('data-order', behaviorsData.indexOf(behavior.text) + 1);
            behaviorElement.setAttribute('data-column', behavior.columnIndex); // Store original column index
            behaviorElement.textContent = behavior.text;
            columnDiv.appendChild(behaviorElement);
        });
        behaviorsContainer.appendChild(columnDiv);
    });

    // Re-initialize drag-and-drop functionality
    initializeDragAndDrop();
}

// Initialize drag-and-drop functionality
function initializeDragAndDrop() {
    const behaviors = document.querySelectorAll('.behavior');
    const dropZones = document.querySelectorAll('.drop-zone');

    behaviors.forEach(behavior => {
        behavior.addEventListener('dragstart', dragStart);
        behavior.addEventListener('click', returnToBehaviorList);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
        zone.addEventListener('dragenter', () => zone.classList.add('highlight'));
        zone.addEventListener('dragleave', () => zone.classList.remove('highlight'));
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.order);
    const parentZone = event.target.parentElement;

    // If the parent is a drop zone, clear its data and decrement placedBehaviors
    if (parentZone.classList.contains('drop-zone')) {
        parentZone.classList.remove('filled');
        parentZone.dataset.selectedOrder = ''; // Clear the selected order
        placedBehaviors -= 1; // Decrement the count
    }
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const behaviorOrder = event.dataTransfer.getData('text/plain');
    const behaviorElement = document.querySelector(`.behavior[data-order='${behaviorOrder}']`);

    if (!event.target.classList.contains('filled')) {
        // Append the behavior element into the drop zone
        event.target.textContent = '';
        event.target.appendChild(behaviorElement);
        event.target.classList.add('filled');
        event.target.classList.remove('highlight');
        event.target.dataset.selectedOrder = behaviorOrder;

        // Increment the count only if this drop zone was previously empty
        placedBehaviors += 1;

        // Check if all drop zones are filled to enable the button
        updateCheckButtonStatus();
    }
}

function returnToBehaviorList(event) {
    const behaviorElement = event.target;
    const parentZone = behaviorElement.parentElement;

    if (parentZone.classList.contains('drop-zone')) {
        parentZone.classList.remove('filled');
        parentZone.textContent = ''; // Clear the drop zone text
        parentZone.dataset.selectedOrder = ''; // Clear the selected order

        // Append the behavior back to its original column
        const originalColumnIndex = behaviorElement.getAttribute('data-column');
        const originalColumn = document.querySelectorAll('.column')[originalColumnIndex];
        originalColumn.appendChild(behaviorElement);

        placedBehaviors -= 1; // Decrement the count

        // Disable check button until all behaviors are placed
        updateCheckButtonStatus();
    }
}

// Update the status of the "Check Answers" button
function updateCheckButtonStatus() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const unfilledCount = Array.from(dropZones).filter(zone => !zone.classList.contains('filled')).length;

    const checkButton = document.getElementById('checkButton');
    const message = document.getElementById('warning-message');

    if (unfilledCount === 0) {
        checkButton.disabled = false;
        message.textContent = ''; // Clear warning message
    } else {
        checkButton.disabled = true;
    }
}

// Check answers
document.getElementById('checkButton').addEventListener('click', () => {
    const dropZones = document.querySelectorAll('.drop-zone');
    const unfilledCount = Array.from(dropZones).filter(zone => !zone.classList.contains('filled')).length;

    if (unfilledCount > 0) {
        // Display warning message if not all behaviors are placed
        const message = document.getElementById('warning-message');
        message.textContent = `You have ${unfilledCount} behaviors left to place before scoring.`;
        return;
    }

    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const behaviorElement = zone.querySelector('.behavior');
        if (behaviorElement) {
            const selectedOrder = behaviorElement.dataset.order;
            if (zone.dataset.correctOrder === selectedOrder) {
                behaviorElement.classList.add('correct');
                behaviorElement.classList.remove('incorrect');
                correctCount++;
            } else {
                behaviorElement.classList.add('incorrect');
                behaviorElement.classList.remove('correct');
            }
        }
    });

    document.getElementById('result').textContent = `Score: ${correctCount} out of 17`;
});

// Reset all behaviors
document.getElementById('resetButton').addEventListener('click', () => {
    resetBehaviors();
    distributeBehaviors(); // Re-distribute behaviors when resetting
});

function resetBehaviors() {
    // Remove all behaviors from drop zones and reset their classes
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dropZones.forEach(zone => {
        const behaviorElement = zone.querySelector('.behavior');
        if (behaviorElement) {
            zone.classList.remove('filled');
            zone.textContent = ''; // Clear the drop zone text

            // Append the behavior back to its original column
            const originalColumnIndex = behaviorElement.getAttribute('data-column');
            const originalColumn = document.querySelectorAll('.column')[originalColumnIndex];
            originalColumn.appendChild(behaviorElement);

            behaviorElement.classList.remove('correct', 'incorrect');
        }
        zone.dataset.selectedOrder = ''; // Clear selected orders
    });

    // Reset placed behaviors count and disable check button
    placedBehaviors = 0;
    updateCheckButtonStatus(); // Ensure the button is correctly disabled
    document.getElementById('result').textContent = ''; // Clear the result text
}

// Call the function to distribute behaviors on page load
window.onload = () => {
    distributeBehaviors();
};

// Create the warning message element
const warningMessage = document.createElement('div');
warningMessage.id = 'warning-message';
warningMessage.style.color = 'red';
warningMessage.style.fontSize = 'small';
document.getElementById('checkButton').insertAdjacentElement('afterend', warningMessage);