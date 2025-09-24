// Global variables
let sidebarCollapsed = false;
let mobileMenuOpen = false;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeChart();
    initializeCalendar();
    setActiveMenuItem();
});

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
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !e.target.classList.contains('mobile-menu-toggle')) {
                closeMobileSidebar();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Add click handlers for menu items
    addMenuItemClickHandlers();
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
        // Reset mobile menu state on desktop
        mobileMenuOpen = false;
        sidebar.classList.remove('mobile-open');
        document.body.style.overflow = 'auto';
    } else {
        // Reset collapse state on mobile
        sidebarCollapsed = false;
        sidebar.classList.remove('collapsed');
    }
}

// Toggle submenu expansion
function toggleSubmenu(element) {
    // Don't expand submenus when sidebar is collapsed
    if (sidebarCollapsed) {
        return;
    }
    
    const menuItem = element.closest('.menu-item');
    const isExpanded = menuItem.classList.contains('expanded');
    
    // Close all other expanded submenus
    const allMenuItems = document.querySelectorAll('.menu-item.expanded');
    allMenuItems.forEach(item => {
        if (item !== menuItem) {
            item.classList.remove('expanded');
        }
    });
    
    // Toggle current submenu
    menuItem.classList.toggle('expanded', !isExpanded);
}

// Add click handlers for menu items
function addMenuItemClickHandlers() {
    // Handle regular menu links
    const menuLinks = document.querySelectorAll('.menu-link[href]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveMenuItem(this);
            
            // Close mobile menu after selection
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    // Handle submenu links
    const submenuLinks = document.querySelectorAll('.submenu-item');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveSubmenuItem(this);
            
            // Close mobile menu after selection
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
}

// Set active menu item
function setActiveMenuItem(clickedItem = null) {
    // Remove active class from all menu items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Remove active class from all submenu items
    const allSubmenuItems = document.querySelectorAll('.submenu-item');
    allSubmenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    if (clickedItem) {
        // Add active class to clicked menu item
        const parentMenuItem = clickedItem.closest('.menu-item');
        if (parentMenuItem) {
            parentMenuItem.classList.add('active');
        }
    } else {
        // Set Dashboard as active by default
        const dashboardItem = document.querySelector('.menu-item');
        if (dashboardItem) {
            dashboardItem.classList.add('active');
        }
    }
}

// Set active submenu item
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
    
    // Add active class to clicked submenu item
    clickedItem.classList.add('active');
    
    // Add active class to parent menu item
    const parentMenuItem = clickedItem.closest('.menu-item');
    if (parentMenuItem) {
        parentMenuItem.classList.add('active');
    }
}

// Initialize chart (placeholder)
function initializeChart() {
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        // This is a placeholder for the chart
        // In a real application, you would use a library like Chart.js or D3.js
        chartContainer.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                <i class="fas fa-chart-line" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                <p>Chart data will be displayed here</p>
                <p style="font-size: 12px; opacity: 0.7;">Connect your data source to view statistics</p>
            </div>
        `;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Update statistics (example function)
function updateStatistics(data) {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (data && statCards.length > 0) {
        // Update Total Students
        const studentsCard = statCards[0];
        const studentsNumber = studentsCard.querySelector('.stat-number');
        const studentsMonth = studentsCard.querySelector('.stat-period');
        if (studentsNumber && data.totalStudents !== undefined) {
            studentsNumber.textContent = formatNumber(data.totalStudents);
            studentsMonth.textContent = `This Month: ${data.studentsThisMonth || 0}`;
        }
        
        // Update Total Employees
        const employeesCard = statCards[1];
        const employeesNumber = employeesCard.querySelector('.stat-number');
        const employeesMonth = employeesCard.querySelector('.stat-period');
        if (employeesNumber && data.totalEmployees !== undefined) {
            employeesNumber.textContent = formatNumber(data.totalEmployees);
            employeesMonth.textContent = `This Month: ${data.employeesThisMonth || 0}`;
        }
        
        // Update Revenue
        const revenueCard = statCards[2];
        const revenueNumber = revenueCard.querySelector('.stat-number');
        const revenueMonth = revenueCard.querySelector('.stat-period');
        if (revenueNumber && data.revenue !== undefined) {
            revenueNumber.textContent = formatNumber(data.revenue);
            revenueMonth.textContent = `This Month: $${data.revenueThisMonth || 0}`;
        }
        
        // Update Total Profit
        const profitCard = statCards[3];
        const profitNumber = profitCard.querySelector('.stat-number');
        const profitMonth = profitCard.querySelector('.stat-period');
        if (profitNumber && data.totalProfit !== undefined) {
            profitNumber.textContent = formatNumber(data.totalProfit);
            profitMonth.textContent = `This Month: $${data.profitThisMonth || 0}`;
        }
    }
}

// Handle PRO upgrade button
function handleProUpgrade() {
    const proButton = document.querySelector('.pro-button');
    if (proButton) {
        proButton.addEventListener('click', function() {
            showNotification('Redirecting to PRO version upgrade...', 'info');
            // In a real application, this would redirect to the upgrade page
            setTimeout(() => {
                window.open('#pro-upgrade', '_blank');
            }, 1000);
        });
    }
}

// Initialize PRO upgrade handler
document.addEventListener('DOMContentLoaded', function() {
    handleProUpgrade();
});

// Search functionality
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

// Search through menu items
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
        
        // If child matches, show parent and expand it
        if (isMatch && parentMenuItem) {
            parentMenuItem.style.display = 'block';
            parentMenuItem.classList.add('expanded');
        }
    });
}

// Reset menu search
function resetMenuSearch() {
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    menuItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('expanded');
    });
    
    submenuItems.forEach(item => {
        item.style.display = 'flex';
    });
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeCalendar();
});

// Calendar functionality
let currentDate = new Date();

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
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!currentMonthElement || !calendarGrid) return;
    
    // Update month/year display
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    const today = new Date();
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
        
        // Add click handler
        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });
            dayElement.classList.add('selected');
        });
        
        calendarGrid.appendChild(dayElement);
    }
}


// updateStatistics({
//     totalStudents: 1250,
//     studentsThisMonth: 45,
//     totalEmployees: 85,
//     employeesThisMonth: 3,
//     revenue: 125000,
//     revenueThisMonth: 15000,
//     totalProfit: 45000,
//     profitThisMonth: 8500
// });