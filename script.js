let startTime, endTime, timerInterval;

const behaviors = [
    "Review customer info", "Discover interests", "Preempt potential issues",
    "Win a friend", "Establish customer baseline", "Outline appointment",
    "Preempt objections", "Customize/Build value", "Verify understanding",
    "Solution/Cost review", "Overcome objections", "Start transaction",
    "Set work expectations", "Outline benefits",
    "Review completed work", "Educate customer", "Benefits followup"
].sort();

const transitions = [
    "Engage with customer", "Resolve service issues/Transition to design tool",
    "Transition to sit down", "Turn the wrench"
].sort();

const stepNames = [
    "Appointment Readiness", "Introduction", "Walkthrough/Design", "Close", "Review"
].sort();

const correctAnswers = [
    "Appointment Readiness", "Review customer info", "Discover interests", "Preempt potential issues", "Engage with customer",
    "Introduction", "Win a friend", "Establish customer baseline", "Outline appointment", "Resolve service issues/Transition to design tool",
    "Walkthrough/Design", "Preempt objections", "Customize/Build value", "Verify understanding", "Transition to sit down",
    "Close", "Solution/Cost review", "Overcome objections", "Start transaction", "Set work expectations", "Outline benefits", "Turn the wrench",
    "Review", "Review completed work", "Educate customer", "Benefits followup"
];

// Confetti effect function
function startConfettiEffect() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (min - max) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

// Start button logic
document.getElementById('start-button').addEventListener('click', () => {
    document.querySelectorAll('select').forEach(select => {
        select.disabled = false; // Unlock all dropdowns
    });
    document.getElementById('check-answers').disabled = false; // Enable the Check Answers button
    document.getElementById('start-button').disabled = true; // Disable the Start button
    startTime = new Date(); // Start the timer

    // Display the timer and start updating it
    const timerElement = document.getElementById('timer');
    timerElement.style.display = 'block';
    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = ((currentTime - startTime) / 1000).toFixed(2);
        timerElement.textContent = `Time: ${elapsedTime}s`;
    }, 100);
});

// Populate dropdowns
document.querySelectorAll('.step-name-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '<option value="">Select Step Name</option>';
    stepNames.forEach(stepName => {
        let option = document.createElement('option');
        option.value = stepName;
        option.textContent = stepName;
        dropdown.appendChild(option);
    });
});

document.querySelectorAll('.behavior-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '<option value="">Select Behavior</option>';
    behaviors.forEach(behavior => {
        let option = document.createElement('option');
        option.value = behavior;
        option.textContent = behavior;
        dropdown.appendChild(option);
    });
});

document.querySelectorAll('.transition-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '<option value="">Select Transition</option>';
    transitions.forEach(transition => {
        let option = document.createElement('option');
        option.value = transition;
        option.textContent = transition;
        dropdown.appendChild(option);
    });
});

// Check duplicates and highlight them
function checkDuplicates() {
    let hasDuplicates = false;
    document.querySelectorAll('select').forEach(select => {
        select.classList.remove('highlight');
    });

    let selectedValues = [];
    document.querySelectorAll('select').forEach(select => {
        selectedValues.push(select.value);
    });

    let duplicates = selectedValues.filter((item, index) => item && selectedValues.indexOf(item) !== index);
    document.querySelectorAll('select').forEach(select => {
        if (duplicates.includes(select.value)) {
            select.classList.add('highlight');
            hasDuplicates = true;
        }
    });

    return hasDuplicates;
}

// Add event listeners to check for duplicates whenever a dropdown changes
document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', checkDuplicates);
});

// Check if all dropdowns are filled
function areAllDropdownsFilled() {
    let allFilled = true;
    document.querySelectorAll('select').forEach(select => {
        if (select.value === "") {
            allFilled = false;
        }
    });
    return allFilled;
}

// Check answers logic
document.getElementById('check-answers').addEventListener('click', () => {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = ""; // Clear previous messages

    // Check if all dropdowns are filled


    if (!areAllDropdownsFilled()) {
        scoreElement.textContent = 'Error: Please fill in every box before checking.';
        return;
    }

    // Check for duplicates
    if (checkDuplicates()) {
        scoreElement.textContent = 'Error: There are duplicate answers. Please resolve them before checking.';
        return;
    }

    // Clear previous highlights
    document.querySelectorAll('select').forEach(select => {
        select.classList.remove('highlight', 'correct', 'incorrect');
    });

    let correctCount = 0;

    // Validate each dropdown against the correct answers
    document.querySelectorAll('select').forEach((select, index) => {
        let value = select.value;

        // Check if the selection is correct
        if (value === correctAnswers[index]) {
            select.classList.add('correct'); // Highlight correct answers
            correctCount++;
        } else {
            select.classList.add('incorrect'); // Highlight incorrect answers
        }
    });

    // Calculate the time taken
    endTime = new Date();
    let timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    // Display the score and time
    scoreElement.textContent = `You got ${correctCount} / ${correctAnswers.length} correct in ${timeTaken} seconds.`;

    // If all answers are correct, start the confetti effect
    if (correctCount === correctAnswers.length) {
        startConfettiEffect();
    }

    // Lock all dropdowns
    document.querySelectorAll('select').forEach(select => {
        select.disabled = true;
    });

    // Stop the live timer
    clearInterval(timerInterval);
});

// Reset logic
document.getElementById('reset').addEventListener('click', () => {
    document.querySelectorAll('select').forEach(select => {
        select.value = "";
        select.classList.remove('highlight', 'correct', 'incorrect');
        select.disabled = true; // Lock the dropdowns
    });

    document.getElementById('check-answers').disabled = true; // Disable the Check Answers button
    document.getElementById('score').textContent = ""; // Clear the score/error display

    // Reset the timer
    clearInterval(timerInterval);
    const timerElement = document.getElementById('timer');
    timerElement.style.display = 'none'; // Hide the timer
    timerElement.textContent = "Time: 0.00s";

    // Enable the Start button
    document.getElementById('start-button').disabled = false;
});