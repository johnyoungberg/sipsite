document.addEventListener('DOMContentLoaded', () => {
    // Role-Play Simulation
    const roleplayButton = document.getElementById('start-roleplay');
    const scenarioDiv = document.getElementById('scenario');

    roleplayButton.addEventListener('click', () => {
        scenarioDiv.innerHTML = `
            <p>Scenario: The customer is concerned about the cost. How do you handle this objection?</p>
            <button onclick="handleResponse('correct')">Explain the long-term savings and value</button>
            <button onclick="handleResponse('incorrect')">Offer a discount immediately</button>
        `;
    });

    window.handleResponse = (response) => {
        if (response === 'correct') {
            alert('Correct! Always focus on value and long-term benefits.');
        } else {
            alert('Incorrect. Avoid offering discounts immediately. Focus on value.');
        }
    };

    // Quiz Form Handling
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let score = 0;
        const formData = new FormData(quizForm);
        formData.forEach((value, key) => {
            if ((key === 'q1' && value === 'Appointment Readiness') || 
                (key === 'q2' && value === 'Both')) {
                score++;
            }
        });
        quizResults.innerHTML = `Your score: ${score} out of 2`;
    });
});
