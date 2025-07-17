document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Emergency type buttons
    const emergencyTypeBtns = document.querySelectorAll('.emergency-type-btn');
    const emergencyForm = document.getElementById('emergency-form');
    const cancelEmergencyBtn = document.getElementById('cancel-emergency');
    
    emergencyTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const emergencyType = this.getAttribute('data-type');
            emergencyForm.classList.remove('hidden');
            // Scroll to form
            emergencyForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    
    cancelEmergencyBtn.addEventListener('click', function() {
        emergencyForm.classList.add('hidden');
    });
    
    // Get location button
    const getLocationBtn = document.getElementById('get-location-btn');
    const emergencyLocation = document.getElementById('emergency-location');
    
    getLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Getting location...';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    emergencyLocation.value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
                    getLocationBtn.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Location acquired';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        getLocationBtn.innerHTML = '<i class="fas fa-location-arrow mr-1"></i> Use Current Location';
                    }, 3000);
                },
                function(error) {
                    console.error('Error getting location:', error);
                    emergencyLocation.value = 'Unable to get location';
                    getLocationBtn.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i> Error getting location';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        getLocationBtn.innerHTML = '<i class="fas fa-location-arrow mr-1"></i> Use Current Location';
                    }, 3000);
                }
            );
        } else {
            emergencyLocation.value = 'Geolocation not supported by this browser';
        }
    });
    
    // Submit emergency form
    const submitEmergencyBtn = document.getElementById('submit-emergency');
    
    submitEmergencyBtn.addEventListener('click', function() {
        const emergencyDetails = document.querySelector('#emergency-form textarea').value;
        const location = emergencyLocation.value;
        
        if (!emergencyDetails || !location) {
            alert('Please provide emergency details and location');
            return;
        }
        
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
        
        // Simulate sending data to server
        setTimeout(() => {
            alert('Emergency alert has been sent! Help is on the way.');
            this.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Send Alert';
            emergencyForm.classList.add('hidden');
            document.querySelector('#emergency-form textarea').value = '';
            emergencyLocation.value = '';
        }, 2000);
    });
    
    // Quiz functionality
    const quizQuestions = [
        {
            question: "What should you do when approaching a yellow traffic light?",
            options: [
                "Speed up to beat the red light",
                "Stop if it's safe to do so",
                "Honk your horn and proceed",
                "Slow down but keep going"
            ],
            answer: 1
        },
        {
            question: "What is the recommended following distance in good weather conditions?",
            options: [
                "1 second",
                "2 seconds",
                "3 seconds",
                "4 seconds"
            ],
            answer: 2
        },
        {
            question: "When should you use your hazard lights?",
            options: [
                "When driving in heavy rain",
                "When parked illegally",
                "When your vehicle is stopped and creating a hazard",
                "When you're driving slowly"
            ],
            answer: 2
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextQuestionBtn = document.getElementById('next-question');
    
    function loadQuestion() {
        const question = quizQuestions[currentQuestion];
        quizQuestion.innerHTML = `<p class="font-medium">${question.question}</p>`;
        
        quizOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option bg-white p-3 rounded-lg shadow-sm hover:bg-blue-100 transition text-left';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(index));
            quizOptions.appendChild(button);
        });
        
        quizFeedback.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');
    }
    
    function checkAnswer(selectedIndex) {
        const question = quizQuestions[currentQuestion];
        const options = quizOptions.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.disabled = true;
            if (index === question.answer) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.answer) {
                option.classList.add('incorrect');
            }
        });
        
        if (selectedIndex === question.answer) {
            quizFeedback.textContent = 'Correct! Well done.';
            quizFeedback.className = 'p-3 rounded-lg mb-4 bg-green-100 text-green-800';
            score++;
        } else {
            quizFeedback.textContent = `Incorrect. The correct answer is: ${question.options[question.answer]}`;
            quizFeedback.className = 'p-3 rounded-lg mb-4 bg-red-100 text-red-800';
        }
        
        quizFeedback.classList.remove('hidden');
        nextQuestionBtn.classList.remove('hidden');
    }
    
    nextQuestionBtn.addEventListener('click', function() {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            loadQuestion();
        } else {
            showQuizResults();
        }
    });
    
    function showQuizResults() {
        quizQuestion.innerHTML = `<p class="font-medium">Quiz Complete!</p>`;
        quizOptions.innerHTML = '';
        quizFeedback.textContent = `You scored ${score} out of ${quizQuestions.length}!`;
        quizFeedback.className = 'p-3 rounded-lg mb-4 bg-blue-100 text-blue-800';
        quizFeedback.classList.remove('hidden');
        nextQuestionBtn.classList.add('hidden');
        
        // Add retry button
        const retryBtn = document.createElement('button');
        retryBtn.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition';
        retryBtn.textContent = 'Try Again';
        retryBtn.addEventListener('click', resetQuiz);
        quizOptions.appendChild(retryBtn);
    }
    
    function resetQuiz() {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
    }
    
    // Load first question
    loadQuestion();
    
    // Emergency floating button and modal
    const emergencyFloatBtn = document.getElementById('emergency-float-btn');
    const emergencyModal = document.getElementById('emergency-modal');
    const closeEmergencyModal = document.getElementById('close-emergency-modal');
    const emergencyModalBtns = document.querySelectorAll('.emergency-modal-btn');
    
    emergencyFloatBtn.addEventListener('click', function() {
        emergencyModal.classList.remove('hidden');
    });
    
    closeEmergencyModal.addEventListener('click', function() {
        emergencyModal.classList.add('hidden');
    });
    
    emergencyModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const emergencyType = this.getAttribute('data-type');
            emergencyModal.classList.add('hidden');
            
            // Scroll to emergency section and open form
            document.getElementById('emergency').scrollIntoView({ behavior: 'smooth' });
            
            // Simulate click on the corresponding emergency type button
            setTimeout(() => {
                document.querySelector(`.emergency-type-btn[data-type="${emergencyType}"]`).click();
            }, 800);
        });
    });
    
    // Close modal when clicking outside
    emergencyModal.addEventListener('click', function(e) {
        if (e.target === emergencyModal) {
            emergencyModal.classList.add('hidden');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
});