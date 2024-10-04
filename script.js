document.addEventListener('DOMContentLoaded', () => {
    const steps = [
        "Appointment Readiness",
        "Introduction",
        "Walkthrough/Design",
        "Close",
        "Review"
    ];

    const behaviors = [
        "Review customer info", "Discover interests", "Preempt potential issues", 
        "Win a friend", "Establish customer baseline", "Outline appointment",
        "Preempt objections", "Customize/Build value", "Verify understanding",
        "Solution/Cost review", "Overcome objections", "Start transaction",
        "Set work expectations", "Outline benefits", "Review completed work",
        "Educate customer", "Benefits followup"
    ];

    const transitions = [
        "Engage with customer", "Resolve service issues/Transition to design tool", 
        "Transition to sit down", "Turn the wrench"
    ];

    let originalPositions = {};

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Populate the columns
    function populateColumns() {
        const stepsColumn = document.getElementById('steps-column');
        shuffle(steps);
        steps.forEach(step => {
            const element = createDraggableElement(step, 'step');
            stepsColumn.appendChild(element);
            originalPositions[step] = stepsColumn;
        });

        shuffle(behaviors);
        const behaviorColumns = [
            document.getElementById('behavior-column-1'),
            document.getElementById('behavior-column-2'),
            document.getElementById('behavior-column-3')
        ];
        let columnIndex = 0;
        behaviors.forEach(behavior => {
            const element = createDraggableElement(behavior, 'behavior');
            behaviorColumns[columnIndex].appendChild(element);
            originalPositions[behavior] = behaviorColumns[columnIndex];
            columnIndex = (columnIndex + 1) % 3;
        });

        shuffle(transitions);
        const transitionsColumn = document.getElementById('transitions-column');
        transitions.forEach(transition => {
            const element = createDraggableElement(transition, 'transition');
            transitionsColumn.appendChild(element);
            originalPositions[transition] = transitionsColumn;
        });
    }

    // Function to create draggable elements
    function createDraggableElement(text, type) {
        const element = document.createElement('div');
        element.classList.add('draggable', type);
        element.textContent = text;
        element.dataset.type = type;

        // Store the original position
        element.addEventListener('click', () => {
            if (element.parentElement.classList.contains('dropzone')) {
                originalPositions[text].appendChild(element);
            }
        });
        
        return element;
    }

    // Enable drag and drop using interact.js
    function enableInteractJS() {
        interact('.draggable').draggable({
            inertia: true,
            autoScroll: true,
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    // Translate the element
                    target.style.transform = `translate(${x}px, ${y}px)`;

                    // Update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    // Reset the position if not dropped in a valid dropzone
                    const target = event.target;
                    target.style.transform = 'translate(0px, 0px)';
                    target.removeAttribute('data-x');
                    target.removeAttribute('data-y');
                }
            }
        });

        interact('.dropzone').dropzone({
            accept: '.draggable',
            overlap: 0.75,
            ondrop(event) {
                const draggableElement = event.relatedTarget;
                const dropzoneElement = event.target;
                const draggableType = draggableElement.dataset.type;
                const dropzoneType = dropzoneElement.classList.contains('step-title') ? 'step' :
                                     dropzoneElement.classList.contains('behavior') ? 'behavior' :
                                     dropzoneElement.classList.contains('transition') ? 'transition' : '';

                if (draggableType === dropzoneType && !dropzoneElement.querySelector('.draggable')) {
                    dropzoneElement.appendChild(draggableElement);
                    draggableElement.style.transform = 'translate(0px, 0px)';
                    draggableElement.removeAttribute('data-x');
                    draggableElement.removeAttribute('data-y');
                } else {
                    // Reset the position if not valid
                    draggableElement.style.transform = 'translate(0px, 0px)';
                    draggableElement.removeAttribute('data-x');
                    draggableElement.removeAttribute('data-y');
                }
            }
        });
    }

    // Check answers
    const checkButton = document.getElementById('check-answers');
    const resetButton = document.getElementById('reset');
    const feedback = document.getElementById('feedback');

    checkButton.addEventListener('click', () => {
        let correctCount = 0;
        let allPlaced = true;
        const dropzones = document.querySelectorAll('.dropzone');

        dropzones.forEach(dropzone => {
            const droppedElement = dropzone.querySelector('.draggable');

            if (!droppedElement) {
                allPlaced = false;
                return;
            }

            if (droppedElement.textContent.trim() === dropzone.dataset.correct) {
                dropzone.classList.add('correct');
                dropzone.classList.remove('incorrect');
                correctCount++;
            } else {
                dropzone.classList.add('incorrect');
                dropzone.classList.remove('correct');
            }
        });

        if (!allPlaced) {
            feedback.textContent = 'Please place all elements before checking answers.';
        } else {
            feedback.textContent = `Score: ${correctCount} / ${dropzones.length}`;
        }
    });

    // Reset the game
    resetButton.addEventListener('click', () => {
        document.querySelectorAll('.dropzone').forEach(dropzone => {
            dropzone.classList.remove('correct', 'incorrect');
            dropzone.innerHTML = '';
        });

        document.querySelectorAll('.draggable-column').forEach(column => {
            column.innerHTML = '';
        });

        populateColumns();
        enableInteractJS();

        feedback.textContent = '';
    });

    // Initial setup
    populateColumns();
    enableInteractJS();
});