// Storage Management - LocalStorage wrapper
const Storage = {
    // User Profile
    saveUser(userData) {
        try {
            localStorage.setItem('hirewise_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    },

    getUser() {
        try {
            const userData = localStorage.getItem('hirewise_user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    updateUser(updates) {
        const user = this.getUser();
        if (user) {
            const updatedUser = { ...user, ...updates };
            return this.saveUser(updatedUser);
        }
        return false;
    },

    clearUser() {
        localStorage.removeItem('hirewise_user');
    },

    // Session Management
    setSession(token) {
        localStorage.setItem('hirewise_session', token);
    },

    getSession() {
        return localStorage.getItem('hirewise_session');
    },

    clearSession() {
        localStorage.removeItem('hirewise_session');
    },

    isAuthenticated() {
        return !!this.getSession();
    },

    // Interview Records
    saveInterview(interviewData) {
        try {
            const interviews = this.getInterviews();
            interviews.push(interviewData);
            localStorage.setItem('hirewise_interviews', JSON.stringify(interviews));
            return true;
        } catch (error) {
            console.error('Error saving interview:', error);
            return false;
        }
    },

    getInterviews() {
        try {
            const interviews = localStorage.getItem('hirewise_interviews');
            return interviews ? JSON.parse(interviews) : [];
        } catch (error) {
            console.error('Error getting interviews:', error);
            return [];
        }
    },

    getInterviewById(id) {
        const interviews = this.getInterviews();
        return interviews.find(interview => interview.interviewId === id);
    },

    // JD Match Results
    saveJDMatch(matchData) {
        try {
            const matches = this.getJDMatches();
            matches.push(matchData);
            localStorage.setItem('hirewise_jd_matches', JSON.stringify(matches));
            return true;
        } catch (error) {
            console.error('Error saving JD match:', error);
            return false;
        }
    },

    getJDMatches() {
        try {
            const matches = localStorage.getItem('hirewise_jd_matches');
            return matches ? JSON.parse(matches) : [];
        } catch (error) {
            console.error('Error getting JD matches:', error);
            return [];
        }
    },

    // ATS Results
    saveATSResult(atsData) {
        try {
            const results = this.getATSResults();
            results.push(atsData);
            localStorage.setItem('hirewise_ats_results', JSON.stringify(results));
            return true;
        } catch (error) {
            console.error('Error saving ATS result:', error);
            return false;
        }
    },

    getATSResults() {
        try {
            const results = localStorage.getItem('hirewise_ats_results');
            return results ? JSON.parse(results) : [];
        } catch (error) {
            console.error('Error getting ATS results:', error);
            return [];
        }
    },

    // Resume Storage
    saveResume(resumeFile, resumeData) {
        try {
            const user = this.getUser();
            if (user) {
                user.resume = {
                    file: resumeData,
                    uploadedDate: new Date().toISOString()
                };
                return this.saveUser(user);
            }
            return false;
        } catch (error) {
            console.error('Error saving resume:', error);
            return false;
        }
    },

    getResume() {
        const user = this.getUser();
        return user?.resume || null;
    },

    // Settings
    saveSettings(settings) {
        try {
            localStorage.setItem('hirewise_settings', JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    getSettings() {
        try {
            const settings = localStorage.getItem('hirewise_settings');
            return settings ? JSON.parse(settings) : {
                notifications: true,
                emailReminders: true,
                theme: 'dark'
            };
        } catch (error) {
            console.error('Error getting settings:', error);
            return {};
        }
    },

    // Utility Methods
    clearAllData() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('hirewise_'));
        keys.forEach(key => localStorage.removeItem(key));
    },

    exportData() {
        const data = {
            user: this.getUser(),
            interviews: this.getInterviews(),
            jdMatches: this.getJDMatches(),
            atsResults: this.getATSResults(),
            settings: this.getSettings()
        };
        return JSON.stringify(data, null, 2);
    },

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.user) this.saveUser(data.user);
            if (data.interviews) localStorage.setItem('hirewise_interviews', JSON.stringify(data.interviews));
            if (data.jdMatches) localStorage.setItem('hirewise_jd_matches', JSON.stringify(data.jdMatches));
            if (data.atsResults) localStorage.setItem('hirewise_ats_results', JSON.stringify(data.atsResults));
            if (data.settings) this.saveSettings(data.settings);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // File conversion to Base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
