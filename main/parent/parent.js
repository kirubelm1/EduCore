// Global variables
let sidebarCollapsed = false;
let mobileMenuOpen = false;
let currentDate = new Date();

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeCalendar();
    setActiveMenuItem();
    updateWelcomeMessage();
    initializeProgressChart();
    loadDashboardData();
});

// Initialize event listeners
function initializeEventListeners() {
    // Sidebar toggle for desktop
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebarCollapse);
    }
    

    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !e.target.classList.contains('mobile-menu-toggle')) {
                closeMobileSidebar();
            }
        }
    });
    

    window.addEventListener('resize', handleResize);

    
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


function addMenuItemClickHandlers() {
    
    const menuLinks = document.querySelectorAll('.menu-link[href]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveMenuItem(this);
            handleNavigation(this.getAttribute('href'));
            
        
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
            handleNavigation(this.getAttribute('href'));
            
            
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
}


function setActiveMenuItem(clickedItem = null) {
    
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const allSubmenuItems = document.querySelectorAll('.submenu-item');
    allSubmenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    if (clickedItem) {
    
        const parentMenuItem = clickedItem.closest('.menu-item');
        if (parentMenuItem) {
            parentMenuItem.classList.add('active');
        }
    } else {
     
        const dashboardItem = document.querySelector('.menu-item');
        if (dashboardItem) {
            dashboardItem.classList.add('active');
        }
    }
}


function setActiveSubmenuItem(clickedItem) {
    // Remove active class from all menu items and submenu items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const allSubmenuItems = document.querySelectorAll('.submenu-item');
    allSubmenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    clickedItem.classList.add('active');
    
    // Add active class to parent menu item
    const parentMenuItem = clickedItem.closest('.menu-item');
    if (parentMenuItem) {
        parentMenuItem.classList.add('active');
        parentMenuItem.classList.add('expanded');
    }
}

// Handle navigation
function handleNavigation(route) {
    console.log('Navigating to:', route);
    // In a real application, this would handle routing
    showNotification(`Navigating to ${route}`, 'info');
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 0) {
                searchMenuItems(searchTerm);
            } else {
                resetMenuSearch();
            }
        });
    }
}


function searchMenuItems(searchTerm) {
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    menuItems.forEach(item => {
        const menuText = item.querySelector('.menu-text');
        const menuLink = item.querySelector('.menu-link');
        
        if (menuText && menuLink) {
            const text = menuText.textContent.toLowerCase();
            const isMatch = text.includes(searchTerm);
            
            item.style.display = isMatch ? 'block' : 'none';
            
            // If parent matches, show all children
            if (isMatch && item.classList.contains('has-submenu')) {
                item.classList.add('expanded');
            }
        }
    });
    
    submenuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isMatch = text.includes(searchTerm);
        const parentMenuItem = item.closest('.menu-item');
        
        item.style.display = isMatch ? 'flex' : 'none';
        
        
        if (isMatch && parentMenuItem) {
            parentMenuItem.style.display = 'block';
            parentMenuItem.classList.add('expanded');
        }
    });
}


function resetMenuSearch() {
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    menuItems.forEach(item => {
        item.style.display = 'block';
        if (!item.classList.contains('pro-promotion')) {
            item.classList.remove('expanded');
        }
    });
    
    submenuItems.forEach(item => {
        item.style.display = 'flex';
    });
}

// Calendar functionality
function initializeCalendar() {
    updateCalendar();
    
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }
}

function updateCalendar() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!currentMonthElement || !calendarGrid) return;
    
    // Update month/year display
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const today = new Date();
    const eventDates = [20, 22]; // Sample event dates
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        
        // Add classes for styling
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        if (eventDates.includes(date.getDate()) && date.getMonth() === currentDate.getMonth()) {
            dayElement.classList.add('has-event');
        }
        
      
        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });
            if (!dayElement.classList.contains('other-month')) {
                dayElement.classList.add('selected');
                showNotification(`Selected date: ${date.toLocaleDateString()}`, 'info');
            }
        });
        
        calendarGrid.appendChild(dayElement);
    }
}


function updateWelcomeMessage() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Good morning';
    
    if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
    } else if (hour >= 17) {
        greeting = 'Good evening';
    }
    
    // This would normally get the parent name from user data
    const welcomeTitle = document.querySelector('.welcome-content h2');
    if (welcomeTitle) {
        welcomeTitle.textContent = `${greeting}, Mrs. Johnson!`;
    }
}


function initializeProgressChart() {
    const chartContainer = document.querySelector('.progress-chart');
    if (chartContainer) {
        // This is a placeholder for the chart
        chartContainer.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                <i class="fas fa-chart-line" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                <p>Academic Progress Chart</p>
                <p style="font-size: 12px; opacity: 0.7;">Performance tracking visualization</p>
            </div>
        `;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading data
    setTimeout(() => {
        updateStatistics({
            attendance: 95,
            attendanceTrend: '+2%',
            overallGrade: 'A-',
            gradeTrend: 'Improved',
            pendingTasks: 3,
            taskTrend: 'On Track',
            dueFees: 0,
            feesTrend: 'Paid'
        });
    }, 1000);
}

// Update statistics
function updateStatistics(data) {
    if (!data) return;
    
    // Update attendance
    const attendanceCard = document.querySelector('.attendance-card');
    if (attendanceCard && data.attendance !== undefined) {
        const numberEl = attendanceCard.querySelector('.stat-number');
        const trendEl = attendanceCard.querySelector('.stat-trend');
        if (numberEl) numberEl.textContent = `${data.attendance}%`;
        if (trendEl) trendEl.textContent = data.attendanceTrend;
    }
    
    // Update grade
    const gradeCard = document.querySelector('.grade-card');
    if (gradeCard && data.overallGrade !== undefined) {
        const numberEl = gradeCard.querySelector('.stat-number');
        const trendEl = gradeCard.querySelector('.stat-trend');
        if (numberEl) numberEl.textContent = data.overallGrade;
        if (trendEl) trendEl.textContent = data.gradeTrend;
    }
    
    // Update homework
    const homeworkCard = document.querySelector('.homework-card');
    if (homeworkCard && data.pendingTasks !== undefined) {
        const numberEl = homeworkCard.querySelector('.stat-number');
        const trendEl = homeworkCard.querySelector('.stat-trend');
        if (numberEl) numberEl.textContent = data.pendingTasks;
        if (trendEl) trendEl.textContent = data.taskTrend;
    }
    
    // Update fees
    const feesCard = document.querySelector('.fees-card');
    if (feesCard && data.dueFees !== undefined) {
        const numberEl = feesCard.querySelector('.stat-number');
        const trendEl = feesCard.querySelector('.stat-trend');
        if (numberEl) numberEl.textContent = `$${data.dueFees}`;
        if (trendEl) trendEl.textContent = data.feesTrend;
    }
}

// Notification system
function showNotification(message, type = 'info') {
   
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#059669';
        case 'error': return '#dc2626';
        case 'warning': return '#f59e0b';
        default: return '#4f46e5';
    }
}


function navigateTo(section) {
    console.log(`Navigating to ${section}`);
    showNotification(`Opening ${section} section...`, 'info');
    
   
}

function requestLeave() {
    showNotification('Opening leave request form...', 'info');
    // In the completed app, this would open a modal or navigate to leave request page
}

function payFees() {
    showNotification('Redirecting to payment gateway...', 'info');
    // In a real app, this would integrate with payment system
}

function downloadReports() {
    showNotification('Preparing report download...', 'info');
    // In a real app, this would generate and download reports
}

function contactTeacher() {
    showNotification('Opening teacher messaging...', 'info');
    // In a real app, this would open messaging interface
}

function viewTransportation() {
    showNotification('Loading bus tracking...', 'info');
    // In a real app, this would show live GPS tracking
}

function bookAppointment() {
    showNotification('Opening appointment booking...', 'info');
    // In a real app, this would show calendar booking interface
}

function showNotifications() {
    showNotification('You have 5 new notifications', 'info');
    // In a real app, this would show notification panel
}

function showMessages() {
    showNotification('You have 2 new messages', 'info');
    // In a real app, this would show messages panel
}

function openFullCalendar() {
    showNotification('Opening full calendar view...', 'info');
    // In a real app, this would show expanded calendar
}

// Handle PRO community button
document.addEventListener('DOMContentLoaded', function() {
    const proButton = document.querySelector('.pro-button');
    if (proButton) {
        proButton.addEventListener('click', function() {
            showNotification('Welcome to Parent Community! Connect with other parents and share experiences.', 'success');
        });
    }
});

// Simulate real-time updates
setInterval(() => {
    // Update time in schedule if needed
    updateCurrentTime();
}, 60000); // Update every minute

function updateCurrentTime() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Update active schedule item based on current time
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach((item, index) => {
        item.classList.remove('active');
        
        // Sample logic to highlight current class
        const scheduleHours = [9, 10, 11, 14]; // 9AM, 10AM, 11AM, 2PM
        if (currentHour === scheduleHours[index]) {
            item.classList.add('active');
        }
    });
}


