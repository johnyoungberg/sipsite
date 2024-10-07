const behaviors = [
    "Review customer info", "Discover interests", "Preempt potential issues",
    "Win a friend", "Establish customer baseline", "Outline appointment",
    "Preempt objections", "Customize/Build value", "Verify understanding",
    "Solution/Cost review", "Overcome objections", "Start transaction",
    "Set work expectations", "Outline benefits",
    "Review completed work", "Educate customer", "Benefits followup"
].sort(); // Sort the behaviors alphabetically

const transitions = [
    "Engage with customer", "Resolve service issues/Transition to design tool",
    "Transition to sit down", "Turn the wrench"
].sort(); // Sort the transitions alphabetically

const stepNames = [
    "Appointment Readiness", "Introduction", "Walkthrough/Design", "Close", "Review"
].sort(); // Sort the step names alphabetically

const correctAnswers = [
    "Appointment Readiness", "Review customer info", "Discover interests", "Preempt potential issues", "Engage with customer",
    "Introduction", "Win a friend", "Establish customer baseline", "Outline appointment", "Resolve service issues/Transition to design tool",
    "Walkthrough/Design", "Preempt objections", "Customize/Build value", "Verify understanding", "Transition to sit down",
    "Close", "Solution/Cost review", "Overcome objections", "Start transaction", "Set work expectations", "Outline benefits", "Turn the wrench",
    "Review", "Review completed work", "Educate customer", "Benefits followup"
];

// Populate step name dropdowns
document.querySelectorAll('.step-name-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '<option value="">Select Step Name</option>'; // Clear existing options
    stepNames.forEach(stepName => {
        let option = document.createElement('option');
        option.value = stepName;
        option.textContent = stepName;
        dropdown.appendChild(option);
    });
});

// Populate behavior dropdowns
document.querySelectorAll('.behavior-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '<option value="">Select Behavior</option>'; // Clear existing options
    behaviors.forEach(behavior => {
        let option = document.createElement('option');
        option.value = behavior;
        option.textContent = behavior;
        dropdown.appendChild(option);
    });
});

// Populate transition dropdowns
document.querySelectorAll('.transition-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '<option value="">Select Transition</option>'; // Clear existing options
    transitions.forEach(transition => {
        let option = document.createElement('option');
        option.value = transition;
        option.textContent = transition;
        dropdown.appendChild(option);
    });
});

// Function to check for duplicates and highlight them
function checkDuplicates() {
    let hasDuplicates = false;
    // Clear previous highlights
    document.querySelectorAll('select').forEach(select => {
        select.classList.remove('highlight');
    });

    let selectedValues = [];
    document.querySelectorAll('select').forEach(select => {
        selectedValues.push(select.value);
    });

    // Find and highlight duplicates
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

// Check for duplicates, validate answers, and lock dropdowns
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
        select.classList.remove('highlight', 'correct');
    });

    let correctCount = 0;

    document.querySelectorAll('select').forEach((select, index) => {
        let value = select.value;

        // Check if the selection is correct
        if (value === correctAnswers[index]) {
            select.classList.add('correct');
            correctCount++;
        }
    });

    // Display the score
    scoreElement.textContent = `You got ${correctCount} / ${correctAnswers.length} correct.`;

    // Lock all dropdowns
    document.querySelectorAll('select').forEach(select => {
        select.disabled = true;
    });
});

// Reset the selections
document.getElementById('reset').addEventListener('click', () => {
    document.querySelectorAll('select').forEach(select => {
        select.value = "";
        select.classList.remove('highlight', 'correct');
        select.disabled = false; // Unlock the dropdowns
    });

    // Clear the score or error display
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = "";
});