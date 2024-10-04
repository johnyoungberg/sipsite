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
        element.draggable = true;
        element.textContent = text;
        element.dataset.type = type;
        element.addEventListener('dragstart', () => {
            element.classList.add('dragging');
        });
        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
        });
        element.addEventListener('click', () => {
            if (element.parentElement.classList.contains('dropzone')) {
                originalPositions[text].appendChild(element);
            }
        });
        return element;
    }

    // Enable drop zones
    function enableDropZones() {
        const dropzones = document.querySelectorAll('.dropzone');
        dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                const draggableType = draggable.dataset.type;
                const dropzoneType = dropzone.classList.contains('step-title') ? 'step' :
                                     dropzone.classList.contains('behavior') ? 'behavior' :
                                     dropzone.classList.contains('transition') ? 'transition' : '';

                if (draggableType === dropzoneType && !dropzone.querySelector('.draggable')) {
                    dropzone.classList.add('valid-drop');
                } else {
                    dropzone.classList.remove('valid-drop');
                }
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('valid-drop');
            });

            dropzone.addEventListener('drop', () => {
                const draggable = document.querySelector('.dragging');
                const draggableType = draggable.dataset.type;
                const dropzoneType = dropzone.classList.contains('step-title') ? 'step' :
                                     dropzone.classList.contains('behavior') ? 'behavior' :
                                     dropzone.classList.contains('transition') ? 'transition' : '';

                if (draggableType === dropzoneType && !dropzone.querySelector('.draggable')) {
                    dropzone.appendChild(draggable);
                    dropzone.classList.remove('valid-drop');
                }
            });
        });
    }

    // Confetti effect function
    function startConfettiEffect() {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti bursts from the left and right
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
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

            // Trigger confetti if all answers are correct
            if (correctCount === dropzones.length) {
                startConfettiEffect();
            }

            document.querySelectorAll('.draggable').forEach(draggable => {
                draggable.setAttribute('draggable', 'false');
            });
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
        enableDropZones();

        feedback.textContent = '';
    });

    // Initial setup
    populateColumns();
    enableDropZones();
});