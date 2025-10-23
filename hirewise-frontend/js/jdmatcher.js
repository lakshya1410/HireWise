// JD Matcher Logic
class JDMatcher {
    constructor() {
        this.currentMatch = null;
    }

    openModal() {
        const modal = document.createElement('div');
        modal.id = 'jd-matcher-modal';
        modal.className = 'modal-backdrop';
        
        modal.innerHTML = `
            <div class="modal max-w-6xl p-0">
                <div class="modal-header">
                    <h2 class="text-2xl font-bold">Job Description Matcher</h2>
                    <button class="close-modal" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div id="jd-input-section">
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium mb-2">Upload Your Resume</label>
                                <input type="file" 
                                       id="resume-upload-jd"
                                       accept=".pdf,.doc,.docx"
                                       class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-cyan/20 file:text-accent-cyan hover:file:bg-accent-cyan/30">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Job Description</label>
                                <textarea id="jd-text" 
                                          rows="8"
                                          class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white"
                                          placeholder="Paste the job description here..."></textarea>
                            </div>
                            
                            <div class="flex gap-4">
                                <button onclick="JDMatcher.instance.analyzeMatch()" 
                                        class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                                    Analyze Match
                                </button>
                                <button onclick="this.closest('.modal-backdrop').remove()" 
                                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="jd-results-section" class="hidden">
                        <div id="jd-results-content"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async analyzeMatch() {
        const jdText = document.getElementById('jd-text').value;
        const resumeFile = document.getElementById('resume-upload-jd')?.files[0];
        
        if (!jdText) {
            showNotification('Please provide a job description', 'warning');
            return;
        }
        
        if (!resumeFile) {
            showNotification('Please upload your resume', 'warning');
            return;
        }
        
        // Show loading
        const inputSection = document.getElementById('jd-input-section');
        inputSection.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto"></div><p class="mt-4 text-gray-400">Analyzing match...</p></div>';
        
        try {
            // Pass the actual File object to the API
            const response = await API.analyzeJDMatch(resumeFile, jdText);
            
            if (response.success) {
                this.currentMatch = response.data;
                this.showResults();
            } else {
                inputSection.innerHTML = `
                    <div class="text-center py-12">
                        <p class="text-red-500 mb-4">❌ ${response.message}</p>
                        <button onclick="JDMatcher.instance.reset()" 
                                class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                            Try Again
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error analyzing match:', error);
            showNotification('Error analyzing job match', 'error');
            inputSection.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-500 mb-4">❌ Failed to analyze match. Please check your internet connection and backend server.</p>
                    <button onclick="JDMatcher.instance.reset()" 
                            class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    showResults() {
        const inputSection = document.getElementById('jd-input-section');
        const resultsSection = document.getElementById('jd-results-section');
        const resultsContent = document.getElementById('jd-results-content');
        
        inputSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        const match = this.currentMatch;
        
        resultsContent.innerHTML = `
            <!-- Overall Match Score -->
            <div class="match-score">
                <div class="score-circle mx-auto">
                    <span>${match.matchScore}%</span>
                </div>
                <h3 class="text-2xl font-bold mt-4">Match Score</h3>
                <p class="text-gray-400">Your profile matches this job description</p>
            </div>
            
            <!-- Detailed Analysis -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="comparison-section">
                    <h3 class="text-xl font-bold mb-4 text-accent-cyan">Technical Skills</h3>
                    <div class="ats-metric">
                        <div>
                            <p class="font-semibold">Match Level</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${match.analysis.technicalSkills}%"></div>
                            </div>
                        </div>
                        <span class="text-accent-cyan font-bold">${match.analysis.technicalSkills}%</span>
                    </div>
                </div>
                
                <div class="comparison-section">
                    <h3 class="text-xl font-bold mb-4 text-accent-cyan">Experience</h3>
                    <div class="ats-metric">
                        <div>
                            <p class="font-semibold">Match Level</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${match.analysis.experience}%"></div>
                            </div>
                        </div>
                        <span class="text-accent-cyan font-bold">${match.analysis.experience}%</span>
                    </div>
                </div>
                
                <div class="comparison-section">
                    <h3 class="text-xl font-bold mb-4 text-accent-cyan">Education</h3>
                    <div class="ats-metric">
                        <div>
                            <p class="font-semibold">Match Level</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${match.analysis.education}%"></div>
                            </div>
                        </div>
                        <span class="text-accent-cyan font-bold">${match.analysis.education}%</span>
                    </div>
                </div>
                
                <div class="comparison-section">
                    <h3 class="text-xl font-bold mb-4 text-accent-cyan">Keywords</h3>
                    <div class="ats-metric">
                        <div>
                            <p class="font-semibold">Match Level</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${match.analysis.keywords}%"></div>
                            </div>
                        </div>
                        <span class="text-accent-cyan font-bold">${match.analysis.keywords}%</span>
                    </div>
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="comparison-section">
                <h3 class="text-xl font-bold mb-4 text-accent-cyan">Recommendations</h3>
                <ul class="space-y-3">
                    ${match.recommendations.map(rec => `
                        <li class="flex items-start gap-3 p-3 bg-primary-dark rounded-lg">
                            <span class="text-accent-cyan text-xl">💡</span>
                            <span class="text-gray-300">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-4 mt-6">
                <button onclick="JDMatcher.instance.downloadReport()" 
                        class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                    Download Report
                </button>
                <button onclick="JDMatcher.instance.reset()" 
                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    New Analysis
                </button>
                <button onclick="this.closest('.modal-backdrop').remove()" 
                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    Close
                </button>
            </div>
        `;
        
        showNotification('Analysis complete!', 'success');
    }

    reset() {
        const inputSection = document.getElementById('jd-input-section');
        const resultsSection = document.getElementById('jd-results-section');
        
        resultsSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        
        // Recreate input section with resume upload
        inputSection.innerHTML = `
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium mb-2">Upload Your Resume</label>
                    <input type="file" 
                           id="resume-upload-jd"
                           accept=".pdf,.doc,.docx"
                           class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-cyan/20 file:text-accent-cyan hover:file:bg-accent-cyan/30">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Job Description</label>
                    <textarea id="jd-text" 
                              rows="8"
                              class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white"
                              placeholder="Paste the job description here..."></textarea>
                </div>
                
                <div class="flex gap-4">
                    <button onclick="JDMatcher.instance.analyzeMatch()" 
                            class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        Analyze Match
                    </button>
                    <button onclick="this.closest('.modal-backdrop').remove()" 
                            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        this.currentMatch = null;
    }

    downloadReport() {
        if (!this.currentMatch) return;
        
        const report = `
JOB DESCRIPTION MATCH REPORT
Generated: ${new Date().toLocaleString()}
=====================================

OVERALL MATCH SCORE: ${this.currentMatch.matchScore}%

DETAILED ANALYSIS:
- Technical Skills: ${this.currentMatch.analysis.technicalSkills}%
- Experience: ${this.currentMatch.analysis.experience}%
- Education: ${this.currentMatch.analysis.education}%
- Keywords: ${this.currentMatch.analysis.keywords}%

RECOMMENDATIONS:
${this.currentMatch.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

=====================================
Generated by HireWise - AI-Powered Interview Platform
        `;
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jd-match-report-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Report downloaded!', 'success');
    }
}

// Create singleton instance
JDMatcher.instance = new JDMatcher();

// Export for use in dashboard
if (typeof window !== 'undefined') {
    window.JDMatcher = JDMatcher;
}
