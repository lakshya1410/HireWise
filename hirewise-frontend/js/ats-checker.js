// ATS Compatibility Checker Logic
class ATSChecker {
    constructor() {
        this.currentResult = null;
    }

    openModal() {
        const modal = document.createElement('div');
        modal.id = 'ats-checker-modal';
        modal.className = 'modal-backdrop';
        
        modal.innerHTML = `
            <div class="modal max-w-4xl p-0">
                <div class="modal-header">
                    <h2 class="text-2xl font-bold">ATS Compatibility Checker</h2>
                    <button class="close-modal" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div id="ats-input-section">
                        <div class="text-center mb-6">
                            <div class="text-6xl mb-4">📄</div>
                            <h3 class="text-xl font-bold mb-2">Check Your Resume's ATS Score</h3>
                            <p class="text-gray-400">Upload your resume to see how well it passes Applicant Tracking Systems</p>
                        </div>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium mb-2">Upload Resume</label>
                                <input type="file" 
                                       id="ats-resume-file"
                                       accept=".pdf,.doc,.docx"
                                       class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-cyan/20 file:text-accent-cyan hover:file:bg-accent-cyan/30">
                            </div>
                            
                            <div class="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4">
                                <p class="text-sm text-gray-300">
                                    💡 <strong>Tip:</strong> ATS systems scan for specific keywords, formatting, and structure. 
                                    Our checker will analyze your resume and provide actionable suggestions to improve visibility.
                                </p>
                            </div>
                            
                            <div class="flex gap-4">
                                <button onclick="ATSChecker.instance.useStoredResume()" 
                                        class="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                    Use Stored Resume
                                </button>
                                <button onclick="ATSChecker.instance.checkATS()" 
                                        class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                                    Check ATS Score
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="ats-results-section" class="hidden">
                        <div id="ats-results-content"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async checkATS() {
        const fileInput = document.getElementById('ats-resume-file');
        const file = fileInput?.files[0];
        
        if (!file) {
            showNotification('Please upload a resume file', 'warning');
            return;
        }
        
        // Show loading
        const inputSection = document.getElementById('ats-input-section');
        inputSection.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto"></div><p class="mt-4 text-gray-400">Analyzing resume...</p></div>';
        
        try {
            // Pass the actual File object to the API
            const response = await API.checkATS(file);
            
            if (response.success) {
                this.currentResult = response.data;
                this.showResults();
            } else {
                inputSection.innerHTML = `
                    <div class="text-center py-12">
                        <p class="text-red-500 mb-4">❌ ${response.message}</p>
                        <button onclick="ATSChecker.instance.reset()" 
                                class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                            Try Again
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error checking ATS:', error);
            showNotification('Error analyzing resume', 'error');
            inputSection.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-500 mb-4">❌ Failed to analyze resume. Please check your internet connection and backend server.</p>
                    <button onclick="ATSChecker.instance.reset()" 
                            class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    async useStoredResume() {
        showNotification('Please upload a resume file directly', 'info');
    }

    showResults() {
        const inputSection = document.getElementById('ats-input-section');
        const resultsSection = document.getElementById('ats-results-section');
        const resultsContent = document.getElementById('ats-results-content');
        
        inputSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        const result = this.currentResult;
        const scoreColor = result.overallScore >= 80 ? 'text-green-500' : 
                          result.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500';
        
        resultsContent.innerHTML = `
            <!-- Overall Score -->
            <div class="text-center mb-8">
                <div class="score-circle mx-auto border-8" style="border-color: ${scoreColor.replace('text-', '')}">
                    <span class="${scoreColor}">${result.overallScore}%</span>
                </div>
                <h3 class="text-2xl font-bold mt-4">ATS Compatibility Score</h3>
                <p class="text-gray-400">
                    ${result.overallScore >= 80 ? 'Excellent! Your resume is ATS-friendly' :
                      result.overallScore >= 60 ? 'Good, but there\'s room for improvement' :
                      'Needs improvement to pass ATS systems'}
                </p>
            </div>
            
            <!-- Metrics Breakdown -->
            <div class="ats-results space-y-4">
                <h3 class="text-xl font-bold mb-4 text-accent-cyan">Detailed Metrics</h3>
                
                <div class="ats-metric">
                    <div class="flex-1">
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Formatting</span>
                            <span class="text-accent-cyan font-bold">${result.metrics.formatting}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${result.metrics.formatting}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="ats-metric">
                    <div class="flex-1">
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Keywords</span>
                            <span class="text-accent-cyan font-bold">${result.metrics.keywords}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${result.metrics.keywords}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="ats-metric">
                    <div class="flex-1">
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Readability</span>
                            <span class="text-accent-cyan font-bold">${result.metrics.readability}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${result.metrics.readability}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="ats-metric">
                    <div class="flex-1">
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Structure</span>
                            <span class="text-accent-cyan font-bold">${result.metrics.structure}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${result.metrics.structure}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Suggestions -->
            <div class="mt-8">
                <h3 class="text-xl font-bold mb-4 text-accent-cyan">Improvement Suggestions</h3>
                <div class="space-y-3">
                    ${result.suggestions.map((suggestion, index) => `
                        <div class="flex items-start gap-3 p-4 bg-primary-dark rounded-lg border border-accent-cyan/20">
                            <div class="w-8 h-8 bg-accent-cyan/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span class="text-accent-cyan font-bold">${index + 1}</span>
                            </div>
                            <p class="text-gray-300">${suggestion}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-4 mt-8">
                <button onclick="ATSChecker.instance.downloadReport()" 
                        class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                    Download Report
                </button>
                <button onclick="ATSChecker.instance.reset()" 
                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    Check Another Resume
                </button>
                <button onclick="this.closest('.modal-backdrop').remove()" 
                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    Close
                </button>
            </div>
        `;
        
        showNotification('ATS analysis complete!', 'success');
    }

    reset() {
        const inputSection = document.getElementById('ats-input-section');
        const resultsSection = document.getElementById('ats-results-section');
        
        resultsSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        
        // Recreate input section
        inputSection.innerHTML = `
            <div class="text-center mb-6">
                <div class="text-6xl mb-4">📄</div>
                <h3 class="text-xl font-bold mb-2">Check Your Resume's ATS Score</h3>
                <p class="text-gray-400">Upload your resume to see how well it passes Applicant Tracking Systems</p>
            </div>
            
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium mb-2">Upload Resume</label>
                    <input type="file" 
                           id="ats-resume-file"
                           accept=".pdf,.doc,.docx"
                           class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-cyan/20 file:text-accent-cyan hover:file:bg-accent-cyan/30">
                </div>
                
                <div class="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4">
                    <p class="text-sm text-gray-300">
                        💡 <strong>Tip:</strong> ATS systems scan for specific keywords, formatting, and structure. 
                        Our checker will analyze your resume and provide actionable suggestions to improve visibility.
                    </p>
                </div>
                
                <div class="flex gap-4">
                    <button onclick="ATSChecker.instance.useStoredResume()" 
                            class="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                        Use Stored Resume
                    </button>
                    <button onclick="ATSChecker.instance.checkATS()" 
                            class="flex-1 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        Check ATS Score
                    </button>
                </div>
            </div>
        `;
        
        this.currentResult = null;
    }

    downloadReport() {
        if (!this.currentResult) return;
        
        const result = this.currentResult;
        const report = `
ATS COMPATIBILITY REPORT
Generated: ${new Date().toLocaleString()}
=====================================

OVERALL SCORE: ${result.overallScore}%

DETAILED METRICS:
- Formatting: ${result.metrics.formatting}%
- Keywords: ${result.metrics.keywords}%
- Readability: ${result.metrics.readability}%
- Structure: ${result.metrics.structure}%

IMPROVEMENT SUGGESTIONS:
${result.suggestions.map((suggestion, i) => `${i + 1}. ${suggestion}`).join('\n')}

=====================================
Generated by HireWise - AI-Powered Interview Platform
        `;
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ats-report-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Report downloaded!', 'success');
    }
}

// Create singleton instance
ATSChecker.instance = new ATSChecker();

// Export for use in dashboard
if (typeof window !== 'undefined') {
    window.ATSChecker = ATSChecker;
}
