// Interview Interface Logic
class InterviewManager {
    constructor() {
        this.currentInterview = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    async startInterview(role = 'software-engineer') {
        try {
            // Get interview questions
            const response = await API.getInterviewQuestions(role, 5);
            if (response.success) {
                this.questions = response.data;
                
                // Create interview record
                const interviewResponse = await API.createInterview({
                    role: role,
                    questions: this.questions,
                    status: 'in-progress'
                });
                
                if (interviewResponse.success) {
                    this.currentInterview = interviewResponse.data;
                    this.showInterviewModal();
                    this.initializeCamera();
                    this.askNextQuestion();
                }
            }
        } catch (error) {
            console.error('Error starting interview:', error);
            showNotification('Error starting interview', 'error');
        }
    }

    showInterviewModal() {
        const modal = document.createElement('div');
        modal.id = 'interview-modal';
        modal.className = 'modal-backdrop';
        
        modal.innerHTML = `
            <div class="modal max-w-6xl p-0">
                <div class="modal-header">
                    <h2 class="text-2xl font-bold">Mock Interview</h2>
                    <div class="flex items-center gap-4">
                        <span id="interview-timer" class="text-accent-cyan font-bold">00:00</span>
                        <button class="close-modal" onclick="InterviewManager.instance.endInterview()">×</button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="interview-container">
                        <!-- AI Avatar Section -->
                        <div class="ai-avatar-section">
                            <div class="ai-avatar bg-accent-cyan/20 flex items-center justify-center">
                                <img src="assets/images/ai-avatar.png" alt="AI Interviewer" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                                <div class="hidden flex-col items-center justify-center">
                                    <div class="text-6xl mb-4">🤖</div>
                                    <p class="text-xl font-semibold">AI Interviewer</p>
                                </div>
                            </div>
                            <h3 class="text-xl font-bold mt-4">Sarah AI</h3>
                            <p class="text-gray-400">Senior Technical Recruiter</p>
                            <div class="mt-6 p-4 bg-primary-dark-secondary rounded-lg">
                                <p class="text-sm text-gray-300" id="ai-status">Ready to begin...</p>
                            </div>
                        </div>
                        
                        <!-- Video & Chat Section -->
                        <div class="video-chat-section">
                            <div class="video-preview" id="video-preview">
                                <video id="user-video" autoplay muted class="w-full h-full object-cover rounded-lg"></video>
                            </div>
                            
                            <div class="chat-messages" id="chat-messages">
                                <!-- Messages will be added here -->
                            </div>
                            
                            <div class="flex items-center gap-4">
                                <button id="record-btn" 
                                        class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                                    🎤 Start Recording
                                </button>
                                <button id="skip-btn" 
                                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                    Skip
                                </button>
                            </div>
                            
                            <div id="recording-status" class="hidden mt-4 text-center">
                                <div class="recording-indicator inline-flex">
                                    <div class="recording-dot"></div>
                                    <span>Recording...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="InterviewManager.instance.submitInterview()" 
                            class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        Submit Interview
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup event listeners
        this.setupEventListeners();
        this.startTimer();
    }

    async initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            const videoElement = document.getElementById('user-video');
            if (videoElement) {
                videoElement.srcObject = stream;
            }
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.setupMediaRecorder();
        } catch (error) {
            console.error('Error accessing camera:', error);
            showNotification('Camera access denied. Interview will continue without video.', 'warning');
        }
    }

    setupMediaRecorder() {
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };
    }

    setupEventListeners() {
        const recordBtn = document.getElementById('record-btn');
        const skipBtn = document.getElementById('skip-btn');
        
        recordBtn?.addEventListener('click', () => this.toggleRecording());
        skipBtn?.addEventListener('click', () => this.skipQuestion());
    }

    askNextQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.submitInterview();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        this.addMessage(question.question, 'ai');
        
        const aiStatus = document.getElementById('ai-status');
        if (aiStatus) {
            aiStatus.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        }
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        message.innerHTML = `
            <p class="text-sm text-gray-400 mb-1">${sender === 'ai' ? 'AI Interviewer' : 'You'}</p>
            <p>${text}</p>
        `;
        
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    toggleRecording() {
        const recordBtn = document.getElementById('record-btn');
        const recordingStatus = document.getElementById('recording-status');
        
        if (!this.isRecording) {
            // Start recording
            if (this.mediaRecorder && this.mediaRecorder.state !== 'recording') {
                this.mediaRecorder.start();
            }
            this.isRecording = true;
            recordBtn.textContent = '⏹️ Stop Recording';
            recordBtn.classList.add('bg-red-500');
            recordingStatus?.classList.remove('hidden');
        } else {
            // Stop recording
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
            this.isRecording = false;
            recordBtn.textContent = '🎤 Start Recording';
            recordBtn.classList.remove('bg-red-500');
            recordingStatus?.classList.add('hidden');
            
            // Save answer and move to next question
            this.saveAnswer();
            this.currentQuestionIndex++;
            setTimeout(() => this.askNextQuestion(), 1000);
        }
    }

    skipQuestion() {
        this.saveAnswer('Skipped');
        this.currentQuestionIndex++;
        this.askNextQuestion();
    }

    saveAnswer(answerText = 'Recorded answer') {
        const question = this.questions[this.currentQuestionIndex];
        
        this.answers.push({
            questionId: question.id,
            question: question.question,
            answer: answerText,
            timestamp: new Date().toISOString(),
            recording: this.recordedChunks.length > 0 ? 'blob' : null
        });
        
        this.addMessage(answerText, 'user');
        this.recordedChunks = [];
    }

    async submitInterview() {
        if (!confirm('Are you sure you want to submit this interview?')) {
            return;
        }
        
        try {
            const response = await API.submitInterview(
                this.currentInterview.interviewId,
                this.answers
            );
            
            if (response.success) {
                this.showResults(response.data);
            }
        } catch (error) {
            console.error('Error submitting interview:', error);
            showNotification('Error submitting interview', 'error');
        }
    }

    showResults(data) {
        const modal = document.getElementById('interview-modal');
        if (modal) modal.remove();
        
        const resultsModal = document.createElement('div');
        resultsModal.className = 'modal-backdrop';
        
        resultsModal.innerHTML = `
            <div class="modal max-w-3xl p-0">
                <div class="modal-header">
                    <h2 class="text-2xl font-bold">Interview Results</h2>
                    <button class="close-modal" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-8">
                        <div class="score-circle mx-auto">
                            <span>${data.score}</span>
                        </div>
                        <p class="text-2xl font-bold mt-4">Great Job!</p>
                        <p class="text-gray-400">You've earned ${data.score} points</p>
                    </div>
                    
                    <div class="space-y-6 mb-8">
                        <div>
                            <h3 class="text-xl font-bold mb-3 text-accent-cyan">Strengths</h3>
                            <ul class="list-disc list-inside space-y-2 text-gray-300">
                                ${data.feedback.strengths.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-bold mb-3 text-accent-cyan">Areas for Improvement</h3>
                            <ul class="list-disc list-inside space-y-2 text-gray-300">
                                ${data.feedback.improvements.map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- Feedback Form -->
                    <div class="bg-primary-dark-secondary/40 backdrop-blur-md border border-accent-cyan/20 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-4 text-accent-cyan">Share Your Experience</h3>
                        <p class="text-gray-400 text-sm mb-4">Help others by sharing your interview experience!</p>
                        <form id="feedback-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Your Name</label>
                                <input type="text" id="feedback-name" required
                                       class="w-full px-4 py-2 bg-primary-dark border border-accent-cyan/20 rounded-lg focus:border-accent-cyan focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Job Title/Company (Optional)</label>
                                <input type="text" id="feedback-title" placeholder="e.g., Software Engineer at Google"
                                       class="w-full px-4 py-2 bg-primary-dark border border-accent-cyan/20 rounded-lg focus:border-accent-cyan focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Your Experience (Max 200 characters)</label>
                                <textarea id="feedback-text" required maxlength="200" rows="3"
                                          class="w-full px-4 py-2 bg-primary-dark border border-accent-cyan/20 rounded-lg focus:border-accent-cyan focus:outline-none"
                                          placeholder="Share how HireWise helped you..."></textarea>
                                <p class="text-xs text-gray-500 mt-1"><span id="char-count">0</span>/200 characters</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Rating</label>
                                <div class="flex gap-2" id="rating-stars">
                                    ${[1,2,3,4,5].map(i => `<button type="button" data-rating="${i}" class="text-3xl text-gray-500 hover:text-accent-cyan transition">⭐</button>`).join('')}
                                </div>
                                <input type="hidden" id="feedback-rating" value="5" required>
                            </div>
                            <button type="submit" class="w-full px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="InterviewManager.instance.skipFeedback()" 
                            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                        Skip & Back to Dashboard
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(resultsModal);
        
        // Setup feedback form
        this.setupFeedbackForm();
        
        // Stop camera
        this.stopCamera();
    }

    setupFeedbackForm() {
        const form = document.getElementById('feedback-form');
        const textarea = document.getElementById('feedback-text');
        const charCount = document.getElementById('char-count');
        const ratingStars = document.querySelectorAll('#rating-stars button');
        const ratingInput = document.getElementById('feedback-rating');
        
        // Character counter
        textarea?.addEventListener('input', () => {
            if (charCount) charCount.textContent = textarea.value.length;
        });
        
        // Rating stars
        ratingStars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = e.target.dataset.rating;
                ratingInput.value = rating;
                
                ratingStars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('text-gray-500');
                        s.classList.add('text-accent-cyan');
                    } else {
                        s.classList.add('text-gray-500');
                        s.classList.remove('text-accent-cyan');
                    }
                });
            });
        });
        
        // Set all stars to selected by default
        ratingStars.forEach(s => {
            s.classList.remove('text-gray-500');
            s.classList.add('text-accent-cyan');
        });
        
        // Form submission
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const feedback = {
                name: document.getElementById('feedback-name').value,
                title: document.getElementById('feedback-title').value || 'HireWise User',
                text: document.getElementById('feedback-text').value,
                rating: parseInt(ratingInput.value),
                date: new Date().toISOString(),
                interviewId: this.currentInterview?.interviewId
            };
            
            // Save feedback to localStorage
            const feedbacks = JSON.parse(localStorage.getItem('hirewise_feedbacks') || '[]');
            feedbacks.unshift(feedback); // Add to beginning
            localStorage.setItem('hirewise_feedbacks', JSON.stringify(feedbacks));
            
            showNotification('Thank you for your feedback!', 'success');
            
            setTimeout(() => {
                document.querySelector('.modal-backdrop')?.remove();
                window.location.reload();
            }, 1500);
        });
    }

    skipFeedback() {
        document.querySelector('.modal-backdrop')?.remove();
        window.location.reload();
    }

    startTimer() {
        let seconds = 0;
        const timerElement = document.getElementById('interview-timer');
        
        this.timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (timerElement) {
                timerElement.textContent = 
                    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    endInterview() {
        if (confirm('Are you sure you want to end this interview?')) {
            this.stopCamera();
            clearInterval(this.timerInterval);
            const modal = document.getElementById('interview-modal');
            if (modal) modal.remove();
        }
    }

    stopCamera() {
        const videoElement = document.getElementById('user-video');
        if (videoElement && videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}

// Create singleton instance
InterviewManager.instance = new InterviewManager();

// Export for use in dashboard
if (typeof window !== 'undefined') {
    window.InterviewManager = InterviewManager;
}
