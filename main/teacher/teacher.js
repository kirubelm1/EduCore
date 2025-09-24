// Global variables
let sidebarCollapsed = false;
let mobileMenuOpen = false;
let students = []; // Placeholder for student data from backend
let classes = []; // Placeholder for class data from backend
let schedule = []; // Placeholder for schedule data
let activities = []; // Placeholder for recent activities
let events = []; // Placeholder for upcoming events
let reminders = []; // Placeholder for reminders

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const modalContainer = document.getElementById('modalContainer');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.querySelector('.modal-close-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCurrentTime();
    setActiveMenuItem();
    initializeReminders();
    initializeQuickActions();
    fetchInitialData();
});

// Fetch initial data from backend (placeholder)
async function fetchInitialData() {
    try {
        // Fetch user data
        const userResponse = await fetch('/api/user');
        const userData = await userResponse.json();
        document.getElementById('userName').textContent = userData.name || 'Teacher Name';
        document.getElementById('userRole').textContent = userData.role || 'Class Teacher';

        // Fetch students
        const studentsResponse = await fetch('/api/students');
        students = await studentsResponse.json();
        
        // Fetch classes
        const classesResponse = await fetch('/api/classes');
        classes = await classesResponse.json();
        
        // Fetch schedule
        const scheduleResponse = await fetch('/api/schedule');
        schedule = await scheduleResponse.json();
        
        // Fetch recent activities
        const activitiesResponse = await fetch('/api/activities');
        activities = await activitiesResponse.json();
        
        // Fetch events
        const eventsResponse = await fetch('/api/events');
        events = await eventsResponse.json();
        
        // Fetch reminders
        const remindersResponse = await fetch('/api/reminders');
        reminders = await remindersResponse.json();

        // Update dashboard
        updateDashboardData({
            totalStudents: students.length,
            attendanceRate: calculateAttendanceRate(),
            activeAssignments: await fetchActiveAssignments(),
            classAverage: await fetchClassAverage()
        });

        // Populate dynamic sections
        populateSchedule();
        populateActivities();
        populateEvents();
        populateReminders();
        populateAttendanceSummary();
        populateAssignmentStats();
    } catch (error) {
        showNotification('Failed to load initial data.', 'error');
    }
}

// Update dashboard data
function updateDashboardData(data) {
    document.getElementById('totalStudents').textContent = data.totalStudents || 0;
    document.getElementById('attendanceRate').textContent = `${data.attendanceRate || 0}%`;
    document.getElementById('activeAssignments').textContent = data.activeAssignments || 0;
    document.getElementById('classAverage').textContent = data.classAverage || 0;
    document.getElementById('studentsPresent').textContent = data.studentsPresent || 0;
    document.getElementById('studentsAbsent').textContent = data.studentsAbsent || 0;
    document.getElementById('assignmentsDue').textContent = data.assignmentsDue || 0;
}

// Calculate attendance rate (placeholder)
function calculateAttendanceRate() {
    // Placeholder for backend calculation
    return Math.round((students.filter(s => s.attendanceStatus === 'present').length / students.length) * 100) || 0;
}

// Fetch active assignments (placeholder)
async function fetchActiveAssignments() {
    try {
        const response = await fetch('/api/assignments/active');
        const assignments = await response.json();
        return assignments.length;
    } catch {
        return 0;
    }
}

// Fetch class average (placeholder)
async function fetchClassAverage() {
    try {
        const response = await fetch('/api/grades/average');
        const average = await response.json();
        return average || 0;
    } catch {
        return 0;
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // Sidebar toggle for desktop
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebarCollapse);
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Close sidebar/modal when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !e.target.classList.contains('mobile-menu-toggle')) {
                closeMobileSidebar();
            }
            if (!modalContainer.contains(e.target) && !e.target.classList.contains('modal-close-btn')) {
                closeModal();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Add click handlers for menu items
    addMenuItemClickHandlers();
    
    // Initialize search
    initializeSearch();
}

// Toggle sidebar collapse (desktop)
function toggleSidebarCollapse() {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    
    // Close all submenus when collapsing
    if (sidebarCollapsed) {
        const expandedItems = document.querySelectorAll('.menu-item.expanded');
        expandedItems.forEach(item => {
            item.classList.remove('expanded');
        });
    }
}

// Toggle sidebar for mobile
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        mobileMenuOpen = !mobileMenuOpen;
        sidebar.classList.toggle('mobile-open', mobileMenuOpen);
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    if (mobileMenuOpen) {
        mobileMenuOpen = false;
        sidebar.classList.remove('mobile-open');
        document.body.style.overflow = 'auto';
    }
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 768) {
        mobileMenuOpen = false;
        sidebar.classList.remove('mobile-open');
        document.body.style.overflow = 'auto';
    } else {
        sidebarCollapsed = false;
        sidebar.classList.remove('collapsed');
    }
}

// Toggle submenu expansion
function toggleSubmenu(element) {
    if (sidebarCollapsed) {
        return;
    }
    
    const menuItem = element.closest('.menu-item');
    const isExpanded = menuItem.classList.contains('expanded');
    
    const allMenuItems = document.querySelectorAll('.menu-item.expanded');
    allMenuItems.forEach(item => {
        if (item !== menuItem) {
            item.classList.remove('expanded');
        }
    });
    
    menuItem.classList.toggle('expanded', !isExpanded);
}

// Add click handlers for menu items
function addMenuItemClickHandlers() {
    const menuLinks = document.querySelectorAll('.menu-link[href]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveMenuItem(this);
            const href = this.getAttribute('href').substring(1);
            handleMenuAction(href);
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    const submenuLinks = document.querySelectorAll('.submenu-item');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveSubmenuItem(this);
            const href = this.getAttribute('href').substring(1);
            handleMenuAction(href);
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleMenuAction(action);
        });
    });
}

// Set active menu item
function setActiveMenuItem(element) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    if (element) {
        element.closest('.menu-item').classList.add('active');
    }
}

// Set active submenu item
function setActiveSubmenuItem(element) {
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

// Handle menu actions
function handleMenuAction(action) {
    switch (action) {
        case 'mark-attendance':
            openMarkAttendanceForm();
            break;
        case 'create-assignment':
            openCreateAssignmentForm();
            break;
        case 'parent-messages':
            openParentMessagesForm();
            break;
        case 'enter-grades':
            openEnterGradesForm();
            break;
        case 'announcements':
            openAnnouncementsForm();
            break;
        case 'parent-meetings':
            openScheduleMeetingForm();
            break;
        case 'add-reminder':
            openAddReminderForm();
            break;
        case 'events-calendar':
            openAddEventForm();
            break;
        case 'attendance-reports':
            openAttendanceReports();
            break;
        case 'recent-activities':
            openRecentActivities();
            break;
        case 'student-list':
            openStudentList();
            break;
        case 'class-overview':
            openClassOverview();
            break;
        default:
            showNotification(`Feature '${action}' is not yet implemented.`, 'info');
    }
}

// Open modal with content
function openModal(content) {
    modalBody.innerHTML = content;
    modalContainer.classList.add('active');
}

// Close modal
function closeModal() {
    modalContainer.classList.remove('active');
    modalBody.innerHTML = '';
}

// Form templates
function openMarkAttendanceForm() {
    const form = `
        <h2>Mark Attendance</h2>
        <form id="attendanceForm">
            <label for="classSelect">Select Class</label>
            <select id="classSelect" name="classId">
                ${classes.length ? classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('') : '<option value="">No classes available</option>'}
            </select>
            <div class="student-list-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Late</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.length ? students.map(student => `
                            <tr>
                                <td>${student.name}</td>
                                <td><input type="radio" name="attendance_${student.id}" value="present" checked></td>
                                <td><input type="radio" name="attendance_${student.id}" value="absent"></td>
                                <td><input type="radio" name="attendance_${student.id}" value="late"></td>
                            </tr>
                        `).join('') : '<tr><td colspan="4">No students available</td></tr>'}
                    </tbody>
                </table>
            </div>
            <button type="submit">Submit Attendance</button>
        </form>
    `;
    openModal(form);
    document.getElementById('attendanceForm').addEventListener('submit', handleAttendanceSubmit);
}

function openCreateAssignmentForm() {
    const form = `
        <h2>Create Assignment</h2>
        <form id="assignmentForm">
            <label for="assignmentTitle">Title</label>
            <input type="text" id="assignmentTitle" name="title" required>
            <label for="assignmentClass">Class</label>
            <select id="assignmentClass" name="classId">
                ${classes.length ? classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('') : '<option value="">No classes available</option>'}
            </select>
            <label for="assignmentDueDate">Due Date</label>
            <input type="date" id="assignmentDueDate" name="dueDate" required>
            <label for="assignmentDescription">Description</label>
            <textarea id="assignmentDescription" name="description" rows="4"></textarea>
            <button type="submit">Create Assignment</button>
        </form>
    `;
    openModal(form);
    document.getElementById('assignmentForm').addEventListener('submit', handleAssignmentSubmit);
}

function openParentMessagesForm() {
    const form = `
        <h2>Send Parent Message</h2>
        <form id="messageForm">
            <label for="recipient">Recipient</label>
            <select id="recipient" name="recipientId">
                ${students.length ? students.map(student => `<option value="${student.parentId}">${student.parentName || 'Parent of ' + student.name}</option>`).join('') : '<option value="">No recipients available</option>'}
            </select>
            <label for="messageSubject">Subject</label>
            <input type="text" id="messageSubject" name="subject" required>
            <label for="messageContent">Message</label>
            <textarea id="messageContent" name="content" rows="4" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    `;
    openModal(form);
    document.getElementById('messageForm').addEventListener('submit', handleMessageSubmit);
}

function openEnterGradesForm() {
    const form = `
        <h2>Enter Grades</h2>
        <form id="gradesForm">
            <label for="gradeClass">Class</label>
            <select id="gradeClass" name="classId">
                ${classes.length ? classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('') : '<option value="">No classes available</option>'}
            </select>
            <label for="assignmentSelect">Assignment</label>
            <select id="assignmentSelect" name="assignmentId">
                <!-- Populated dynamically via API -->
            </select>
            <div class="student-list-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.length ? students.map(student => `
                            <tr>
                                <td>${student.name}</td>
                                <td><input type="number" name="grade_${student.id}" min="0" max="100"></td>
                            </tr>
                        `).join('') : '<tr><td colspan="2">No students available</td></tr>'}
                    </tbody>
                </table>
            </div>
            <button type="submit">Submit Grades</button>
        </form>
    `;
    openModal(form);
    document.getElementById('gradesForm').addEventListener('submit', handleGradesSubmit);
}

function openAnnouncementsForm() {
    const form = `
        <h2>Create Announcement</h2>
        <form id="announcementForm">
            <label for="announcementTitle">Title</label>
            <input type="text" id="announcementTitle" name="title" required>
            <label for="announcementClass">Class</label>
            <select id="announcementClass" name="classId">
                ${classes.length ? classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('') : '<option value="">No classes available</option>'}
            </select>
            <label for="announcementContent">Content</label>
            <textarea id="announcementContent" name="content" rows="4" required></textarea>
            <button type="submit">Post Announcement</button>
        </form>
    `;
    openModal(form);
    document.getElementById('announcementForm').addEventListener('submit', handleAnnouncementSubmit);
}

function openScheduleMeetingForm() {
    const form = `
        <h2>Schedule Parent Meeting</h2>
        <form id="meetingForm">
            <label for="meetingTitle">Title</label>
            <input type="text" id="meetingTitle" name="title" required>
            <label for="meetingDate">Date</label>
            <input type="date" id="meetingDate" name="date" required>
            <label for="meetingTime">Time</label>
            <input type="time" id="meetingTime" name="time" required>
            <label for="meetingLocation">Location</label>
            <input type="text" id="meetingLocation" name="location" required>
            <button type="submit">Schedule Meeting</button>
        </form>
    `;
    openModal(form);
    document.getElementById('meetingForm').addEventListener('submit', handleMeetingSubmit);
}

function openAddReminderForm() {
    const form = `
        <h2>Add Reminder</h2>
        <form id="reminderForm">
            <label for="reminderTitle">Title</label>
            <input type="text" id="reminderTitle" name="title" required>
            <label for="reminderDueDate">Due Date</label>
            <input type="date" id="reminderDueDate" name="dueDate" required>
            <label for="reminderPriority">Priority</label>
            <select id="reminderPriority" name="priority">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
            </select>
            <button type="submit">Add Reminder</button>
        </form>
    `;
    openModal(form);
    document.getElementById('reminderForm').addEventListener('submit', handleReminderSubmit);
}

function openAddEventForm() {
    const form = `
        <h2>Add Event</h2>
        <form id="eventForm">
            <label for="eventTitle">Title</label>
            <input type="text" id="eventTitle" name="title" required>
            <label for="eventDate">Date</label>
            <input type="date" id="eventDate" name="date" required>
            <label for="eventTime">Time</label>
            <input type="time" id="eventTime" name="time" required>
            <label for="eventLocation">Location</label>
            <input type="text" id="eventLocation" name="location" required>
            <button type="submit">Add Event</button>
        </form>
    `;
    openModal(form);
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
}

function openAttendanceReports() {
    const report = `
        <h2>Attendance Reports</h2>
        <p>Attendance reports will be displayed here.</p>
        <!-- Add report visualization or table here when backend is available -->
    `;
    openModal(report);
}

function openRecentActivities() {
    const activitiesList = `
        <h2>Recent Activities</h2>
        <div class="activity-list">
            ${activities.length ? activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas fa-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-description">${activity.description}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('') : '<p>No recent activities available.</p>'}
        </div>
    `;
    openModal(activitiesList);
}

function openStudentList() {
    const studentList = `
        <h2>Student List</h2>
        <div class="student-list-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.length ? students.map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.id}</td>
                            <td>${student.className}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="3">No students available</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    openModal(studentList);
}

function openClassOverview() {
    const overview = `
        <h2>Class Overview</h2>
        <p>Class overview details will be displayed here.</p>
        <!-- Add class overview details when backend is available -->
    `;
    openModal(overview);
}

// Form submission handlers
async function handleAttendanceSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const attendanceData = {
        classId: formData.get('classId'),
        students: students.map(student => ({
            id: student.id,
            status: formData.get(`attendance_${student.id}`)
        }))
    };
    try {
        await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });
        showNotification('Attendance submitted successfully.', 'success');
        closeModal();
        populateAttendanceSummary();
    } catch {
        showNotification('Failed to submit attendance.', 'error');
    }
}

async function handleAssignmentSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const assignmentData = {
        title: formData.get('title'),
        classId: formData.get('classId'),
        dueDate: formData.get('dueDate'),
        description: formData.get('description')
    };
    try {
        await fetch('/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignmentData)
        });
        showNotification('Assignment created successfully.', 'success');
        closeModal();
        populateAssignmentStats();
    } catch {
        showNotification('Failed to create assignment.', 'error');
    }
}

async function handleMessageSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const messageData = {
        recipientId: formData.get('recipientId'),
        subject: formData.get('subject'),
        content: formData.get('content')
    };
    try {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        });
        showNotification('Message sent successfully.', 'success');
        closeModal();
    } catch {
        showNotification('Failed to send message.', 'error');
    }
}

async function handleGradesSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gradesData = {
        classId: formData.get('classId'),
        assignmentId: formData.get('assignmentId'),
        grades: students.map(student => ({
            studentId: student.id,
            grade: formData.get(`grade_${student.id}`)
        }))
    };
    try {
        await fetch('/api/grades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gradesData)
        });
        showNotification('Grades submitted successfully.', 'success');
        closeModal();
    } catch {
        showNotification('Failed to submit grades.', 'error');
    }
}

async function handleAnnouncementSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const announcementData = {
        title: formData.get('title'),
        classId: formData.get('classId'),
        content: formData.get('content')
    };
    try {
        await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcementData)
        });
        showNotification('Announcement posted successfully.', 'success');
        closeModal();
    } catch {
        showNotification('Failed to post announcement.', 'error');
    }
}

async function handleMeetingSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const meetingData = {
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location')
    };
    try {
        await fetch('/api/meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meetingData)
        });
        showNotification('Meeting scheduled successfully.', 'success');
        closeModal();
    } catch {
        showNotification('Failed to schedule meeting.', 'error');
    }
}

async function handleReminderSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reminderData = {
        title: formData.get('title'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority')
    };
    try {
        await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reminderData)
        });
        showNotification('Reminder added successfully.', 'success');
        closeModal();
        populateReminders();
    } catch {
        showNotification('Failed to add reminder.', 'error');
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = {
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location')
    };
    try {
        await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        showNotification('Event added successfully.', 'success');
        closeModal();
        populateEvents();
    } catch {
        showNotification('Failed to add event.', 'error');
    }
}

// Populate dynamic sections
function populateSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = schedule.length ? schedule.map(item => `
        <div class="schedule-item ${item.status}">
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-subject">${item.subject}</div>
            <div class="schedule-topic">${item.topic}</div>
            <div class="schedule-status ${item.status}">${item.status}</div>
        </div>
    `).join('') : '<p>No schedule available.</p>';
}

function populateActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activities.length ? activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('') : '<p>No recent activities.</p>';
}

function populateEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = events.length ? events.map(event => `
        <div class="event-item">
            <div class="event-date">
                <div class="event-day">${event.day}</div>
                <div class="event-month">${event.month}</div>
            </div>
            <div class="event-content">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${event.time}</div>
                <div class="event-location">${event.location}</div>
            </div>
        </div>
    `).join('') : '<p>No upcoming events.</p>';
}

function populateReminders() {
    const remindersList = document.getElementById('remindersList');
    remindersList.innerHTML = reminders.length ? reminders.map(reminder => `
        <div class="reminder-item ${reminder.priority} ${reminder.completed ? 'completed' : ''}">
            <div class="reminder-checkbox">
                <input type="checkbox" ${reminder.completed ? 'checked' : ''} onchange="toggleReminderStatus(${reminder.id}, this.checked)">
            </div>
            <div class="reminder-content ${reminder.completed ? 'completed' : ''}">
                <div class="reminder-title">${reminder.title}</div>
                <div class="reminder-due">${reminder.dueDate}</div>
                <div class="reminder-priority ${reminder.priority}">${reminder.priority}</div>
            </div>
        </div>
    `).join('') : '<p>No reminders available.</p>';
}

function populateAttendanceSummary() {
    const attendanceSummary = document.getElementById('attendanceSummary');
    const present = students.filter(s => s.attendanceStatus === 'present').length;
    const absent = students.filter(s => s.attendanceStatus === 'absent').length;
    const late = students.filter(s => s.attendanceStatus === 'late').length;
    attendanceSummary.innerHTML = `
        <div class="attendance-stat present">
            <div class="stat-number">${present}</div>
            <div class="stat-label">Present</div>
        </div>
        <div class="attendance-stat absent">
            <div class="stat-number">${absent}</div>
            <div class="stat-label">Absent</div>
        </div>
        <div class="attendance-stat late">
            <div class="stat-number">${late}</div>
            <div class="stat-label">Late</div>
        </div>
    `;
    document.getElementById('absentList').innerHTML = absent > 0 ? students.filter(s => s.attendanceStatus === 'absent').map(s => `
        <div class="absent-student">
            <div class="student-name">${s.name}</div>
            <div class="absence-reason">${s.reason || 'No reason provided'}</div>
        </div>
    `).join('') : '<p>No absent students.</p>';
}

function populateAssignmentStats() {
    const assignmentStats = document.getElementById('assignmentStats');
    // Placeholder for assignment stats from backend
    assignmentStats.innerHTML = `
        <div class="assignment-stat">
            <div class="stat-circle pending">0</div>
            <div class="stat-info">
                <div class="stat-label">Pending</div>
                <div class="stat-description">Assignments awaiting submission</div>
            </div>
        </div>
        <div class="assignment-stat">
            <div class="stat-circle overdue">0</div>
            <div class="stat-info">
                <div class="stat-label">Overdue</div>
                <div class="stat-description">Assignments past due date</div>
            </div>
        </div>
        <div class="assignment-stat">
            <div class="stat-circle completed">0</div>
            <div class="stat-info">
                <div class="stat-label">Completed</div>
                <div class="stat-description">Assignments submitted</div>
            </div>
        </div>
    `;
}

// Toggle reminder status
async function toggleReminderStatus(reminderId, completed) {
    try {
        await fetch(`/api/reminders/${reminderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        reminders = reminders.map(r => r.id === reminderId ? { ...r, completed } : r);
        populateReminders();
        showNotification('Reminder status updated.', 'success');
    } catch {
        showNotification('Failed to update reminder status.', 'error');
    }
}

// Initialize search
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        // Placeholder for search functionality with backend
        showNotification('Search functionality will be implemented with backend.', 'info');
    });
}

// Initialize reminders
function initializeReminders() {
    document.getElementById('remindersList').addEventListener('click', function(e) {
        if (e.target.type === 'checkbox') {
            const reminderId = parseInt(e.target.parentElement.parentElement.dataset.id);
            toggleReminderStatus(reminderId, e.target.checked);
        }
    });
}

// Initialize quick actions
function initializeQuickActions() {
    // Handled in addMenuItemClickHandlers
}

// Update current time
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    const update = () => {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };
    update();
    setInterval(update, 60000); // Update every minute
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}