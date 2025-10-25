// API Handler - Real Backend Connection
const API = {
    baseURL: 'http://localhost:8001/api',
    
    // Helper to handle API responses
    async handleResponse(response) {
        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse response:', e);
            throw new Error('Invalid response from server');
        }
        
        if (!response.ok) {
            console.error('API Error Response:', data);
            throw new Error(data.detail || data.message || 'API request failed');
        }
        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Success'
        };
    },

    // Helper to handle errors
    handleError(error) {
        console.error('API Error:', error);
        return {
            success: false,
            message: error.message || 'Failed to connect to server. Please check if backend is running.'
        };
    },

    // Authentication
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await this.handleResponse(response);
            
            // Save user data to localStorage
            if (result.success && result.data.user) {
                Storage.saveUser(result.data.user);
                Storage.setSession('logged_in');
            }
            
            return result;
        } catch (error) {
            return this.handleError(error);
        }
    },

    async signup(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    full_name: userData.fullName,
                    phone: userData.phone || null,
                    education: userData.education || []
                })
            });
            
            const result = await this.handleResponse(response);
            
            // Save user data to localStorage
            if (result.success && result.data.user) {
                Storage.saveUser(result.data.user);
                Storage.setSession('logged_in');
            }
            
            return result;
        } catch (error) {
            return this.handleError(error);
        }
    },

    async logout() {
        Storage.clearSession();
        return {
            success: true,
            message: 'Logged out successfully'
        };
    },

    // User Profile
    async getProfile() {
        const user = Storage.getUser();
        if (!user || !user.userId) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        
        try {
            const response = await fetch(`${this.baseURL}/auth/profile/${user.userId}`);
            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async updateProfile(updates) {
        const user = Storage.getUser();
        if (!user || !user.userId) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        
        try {
            const response = await fetch(`${this.baseURL}/auth/profile/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: updates.fullName,
                    phone: updates.phone,
                    education: updates.education
                })
            });
            
            const result = await this.handleResponse(response);
            
            // Update localStorage with new data
            if (result.success && result.data) {
                Storage.updateUser(result.data);
            }
            
            return result;
        } catch (error) {
            return this.handleError(error);
        }
    },

    // Resume Management
    async getUserResumes() {
        const user = Storage.getUser();
        if (!user || !user.userId) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        
        try {
            const response = await fetch(`${this.baseURL}/ats/resumes/${user.userId}`);
            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async getResumeFile(resumeId) {
        try {
            console.log('Fetching resume file for ID:', resumeId);
            console.log('URL:', `${this.baseURL}/ats/resumes/file/${resumeId}`);
            
            const response = await fetch(`${this.baseURL}/ats/resumes/file/${resumeId}`);
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch resume file: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            console.log('Blob received:', blob.type, blob.size);
            return blob;
        } catch (error) {
            console.error('Error fetching resume file:', error);
            throw error; // Re-throw so calling function can handle it
        }
    },

    async deleteResume(resumeId) {
        try {
            const response = await fetch(`${this.baseURL}/ats/resumes/${resumeId}`, {
                method: 'DELETE'
            });
            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async checkATSStored(resumeId) {
        const user = Storage.getUser();
        
        try {
            const formData = new FormData();
            formData.append('resume_id', resumeId);
            
            if (user?.userId) {
                formData.append('user_id', user.userId);
            }
            
            const response = await fetch(`${this.baseURL}/ats/analyze-stored`, {
                method: 'POST',
                body: formData
            });
            
            const result = await this.handleResponse(response);
            
            // Save ATS result to localStorage
            if (result.success && result.data) {
                Storage.saveATSResult(result.data);
            }
            
            return result;
        } catch (error) {
            return this.handleError(error);
        }
    },

    async analyzeJDMatchStored(resumeId, jobDescription) {
        const user = Storage.getUser();
        
        try {
            const formData = new FormData();
            formData.append('resume_id', resumeId);
            formData.append('job_description', jobDescription);
            
            if (user?.userId) {
                formData.append('user_id', user.userId);
            }
            
            const response = await fetch(`${this.baseURL}/jd-matcher/analyze-stored`, {
                method: 'POST',
                body: formData
            });
            
            const result = await this.handleResponse(response);
            
            // Save match data to localStorage
            if (result.success && result.data) {
                Storage.saveJDMatch(result.data);
            }
            
            return result;
        } catch (error) {
            return this.handleError(error);
        }
    },

    // Interviews
    async getInterviews() {
        const interviews = Storage.getInterviews();
        return {
            success: true,
            data: interviews
        };
    },

    async createInterview(interviewData) {
        const interview = {
            interviewId: 'int_' + Date.now(),
            userId: Storage.getUser()?.userId,
            date: new Date().toISOString(),
            duration: 0,
            score: 0,
            questions: [],
            answers: [],
            feedback: null,
            status: 'pending',
            ...interviewData
        };
        
        Storage.saveInterview(interview);
        
        return {
            success: true,
            data: interview,
            message: 'Interview created'
        };
    },

    async submitInterview(interviewId, responses) {
        // Mock feedback generation for now
        const score = Math.floor(Math.random() * 30) + 70;
        
        const feedback = {
            toneAnalysis: 'Confident and professional tone detected.',
            bodyLanguage: 'Good eye contact and posture.',
            strengths: [
                'Clear communication',
                'Technical knowledge',
                'Problem-solving approach'
            ],
            improvements: [
                'Could elaborate more on examples',
                'Practice STAR method for behavioral questions'
            ]
        };
        
        const interview = Storage.getInterviewById(interviewId);
        if (interview) {
            interview.score = score;
            interview.feedback = feedback;
            interview.answers = responses;
            interview.status = 'completed';
            interview.completedAt = new Date().toISOString();
        }
        
        const user = Storage.getUser();
        if (user) {
            user.totalPoints = (user.totalPoints || 0) + score;
            user.streak = (user.streak || 0) + 1;
            Storage.saveUser(user);
        }
        
        return {
            success: true,
            data: { interview, feedback, score },
            message: 'Interview submitted successfully'
        };
    },

    // JD Matcher - Connected to Backend
    async analyzeJDMatch(resumeFile, jobDescription) {
        try {
            console.log('Starting JD match with file:', resumeFile.name);
            console.log('Job description length:', jobDescription.length);
            
            const formData = new FormData();
            formData.append('resume_file', resumeFile);
            formData.append('job_description', jobDescription);
            
            const user = Storage.getUser();
            if (user?.userId) {
                formData.append('user_id', user.userId);
            }
            
            console.log('Sending request to:', `${this.baseURL}/jd-matcher/analyze`);
            
            const response = await fetch(`${this.baseURL}/jd-matcher/analyze`, {
                method: 'POST',
                body: formData
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            const result = await this.handleResponse(response);
            
            console.log('Parsed result:', result);
            
            // Save match data to localStorage
            if (result.success && result.data) {
                Storage.saveJDMatch(result.data);
            }
            
            return result;
        } catch (error) {
            console.error('Detailed error in analyzeJDMatch:', error);
            return this.handleError(error);
        }
    },

    // ATS Checker - Connected to Backend
    async checkATS(resumeFile) {
        try {
            console.log('Starting ATS check with file:', resumeFile.name);
            
            const formData = new FormData();
            formData.append('file', resumeFile);
            
            const user = Storage.getUser();
            if (user?.userId) {
                formData.append('user_id', user.userId);
            }
            
            console.log('Sending request to:', `${this.baseURL}/ats/analyze`);
            
            const response = await fetch(`${this.baseURL}/ats/analyze`, {
                method: 'POST',
                body: formData
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            const result = await this.handleResponse(response);
            
            console.log('Parsed result:', result);
            
            // Save ATS result to localStorage
            if (result.success && result.data) {
                Storage.saveATSResult(result.data);
            }
            
            return result;
        } catch (error) {
            console.error('Detailed error in checkATS:', error);
            return this.handleError(error);
        }
    },

    // Dashboard Stats
    async getDashboardStats() {
        const interviews = Storage.getInterviews();
        const user = Storage.getUser();
        
        const completedInterviews = interviews.filter(i => i.status === 'completed');
        const totalScore = completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0);
        const avgScore = completedInterviews.length > 0 
            ? Math.round(totalScore / completedInterviews.length) 
            : 0;
        
        return {
            success: true,
            data: {
                totalInterviews: completedInterviews.length,
                avgScore,
                streak: user?.streak || 0,
                totalPoints: user?.totalPoints || 0,
                recentInterviews: completedInterviews.slice(-5).reverse()
            }
        };
    },

    // Mock Questions (still using local data)
    async getInterviewQuestions(role = 'software-engineer', count = 5) {
        const questions = [
            { id: 1, question: 'Tell me about yourself', type: 'behavioral' },
            { id: 2, question: 'What are your strengths and weaknesses?', type: 'behavioral' },
            { id: 3, question: 'Describe a challenging project you worked on', type: 'behavioral' },
            { id: 4, question: 'Where do you see yourself in 5 years?', type: 'behavioral' },
            { id: 5, question: 'Why do you want to work for our company?', type: 'behavioral' }
        ];
        
        return {
            success: true,
            data: questions.slice(0, count)
        };
    },

    // Calendar Activities API
    async getCalendarActivities(startDate = null, endDate = null) {
        try {
            const user = Storage.getUser();
            if (!user) throw new Error('User not authenticated');

            let url = `${this.baseURL}/calendar/activities`;
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.email}`
                }
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async getActivitiesByDate(date) {
        try {
            const user = Storage.getUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.baseURL}/calendar/activities/${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.email}`
                }
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async createCalendarActivity(activityData) {
        try {
            const user = Storage.getUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.baseURL}/calendar/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.email}`
                },
                body: JSON.stringify(activityData)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async updateCalendarActivity(activityId, activityData) {
        try {
            const user = Storage.getUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.baseURL}/calendar/activities/${activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.email}`
                },
                body: JSON.stringify(activityData)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async deleteCalendarActivity(activityId) {
        try {
            const user = Storage.getUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.baseURL}/calendar/activities/${activityId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.email}`
                }
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    },

    async getCalendarStats() {
        try {
            const user = Storage.getUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.baseURL}/calendar/stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.email}`
                }
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
