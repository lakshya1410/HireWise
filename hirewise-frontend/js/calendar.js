// Calendar Component Logic
class CalendarManager {
    constructor(elementId) {
        this.elementId = elementId;
        this.calendar = null;
    }

    initialize() {
        const calendarEl = document.getElementById(this.elementId);
        if (!calendarEl) {
            console.error('Calendar element not found');
            return;
        }

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            events: this.getEvents(),
            eventClick: this.handleEventClick.bind(this),
            dateClick: this.handleDateClick.bind(this),
            height: 'auto',
            themeSystem: 'standard',
            eventColor: '#00acc1',
            eventDisplay: 'block',
            displayEventTime: true,
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
            }
        });

        this.calendar.render();
    }

    getEvents() {
        const interviews = Storage.getInterviews();
        
        return interviews.map(interview => {
            const isCompleted = interview.status === 'completed';
            
            return {
                id: interview.interviewId,
                title: isCompleted ? `✓ Interview (Score: ${interview.score})` : '📅 Scheduled Interview',
                start: interview.date,
                color: isCompleted ? '#10b981' : '#00acc1',
                extendedProps: {
                    interview: interview
                }
            };
        });
    }

    handleEventClick(info) {
        const interview = info.event.extendedProps.interview;
        this.showInterviewDetails(interview);
    }

    handleDateClick(info) {
        if (confirm(`Schedule a new interview for ${info.dateStr}?`)) {
            this.scheduleInterview(info.dateStr);
        }
    }

    showInterviewDetails(interview) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        
        modal.innerHTML = `
            <div class="modal max-w-2xl p-0">
                <div class="modal-header">
                    <h2 class="text-2xl font-bold">Interview Details</h2>
                    <button class="close-modal" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="space-y-4">
                        <div>
                            <p class="text-gray-400 text-sm">Date</p>
                            <p class="text-lg">${new Date(interview.date).toLocaleString()}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-sm">Status</p>
                            <p class="text-lg capitalize">${interview.status}</p>
                        </div>
                        ${interview.score ? `
                        <div>
                            <p class="text-gray-400 text-sm">Score</p>
                            <p class="text-3xl font-bold text-accent-cyan">${interview.score}/100</p>
                        </div>
                        ` : ''}
                        ${interview.feedback ? `
                        <div>
                            <p class="text-gray-400 text-sm mb-2">Feedback</p>
                            <div class="bg-primary-dark rounded-lg p-4 space-y-3">
                                <div>
                                    <p class="font-semibold mb-1">Strengths:</p>
                                    <ul class="list-disc list-inside text-gray-300">
                                        ${interview.feedback.strengths.map(s => `<li>${s}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <p class="font-semibold mb-1">Areas for Improvement:</p>
                                    <ul class="list-disc list-inside text-gray-300">
                                        ${interview.feedback.improvements.map(i => `<li>${i}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="this.closest('.modal-backdrop').remove()" 
                            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async scheduleInterview(date) {
        try {
            const response = await API.createInterview({
                date: new Date(date).toISOString(),
                status: 'scheduled'
            });
            
            if (response.success) {
                this.refresh();
                showNotification('Interview scheduled successfully!', 'success');
            }
        } catch (error) {
            showNotification('Error scheduling interview', 'error');
        }
    }

    refresh() {
        if (this.calendar) {
            this.calendar.refetchEvents();
        }
    }

    destroy() {
        if (this.calendar) {
            this.calendar.destroy();
        }
    }
}

// Export for use in dashboard
if (typeof window !== 'undefined') {
    window.CalendarManager = CalendarManager;
}
