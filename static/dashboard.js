/**
 * CryptoPredict Dashboard - Enhanced Interactivity
 * This file contains JavaScript enhancements for better UX
 */

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    setupFormValidation();
});

// ============================================
// Dashboard Initialization
// ============================================

function initializeDashboard() {
    // Add staggered animation to cards
    const cards = document.querySelectorAll('[class*="animate-fade-in-up"]');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Initialize tooltips (if needed)
    initializeTooltips();

    // Setup responsive sidebar (mobile)
    setupResponsiveSidebar();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Range slider update
    const slider = document.getElementById('no_of_days');
    if (slider) {
        slider.addEventListener('input', function() {
            updateDaysValue(this.value);
            addSliderAnimation();
        });
    }

    // Form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            handleFormSubmit(e);
        });
    }

    // Navigation links
    setupNavigation();

    // Table row interactions
    setupTableInteractions();
}

// ============================================
// Form Validation & Submission
// ============================================

function setupFormValidation() {
    const tickerInput = document.getElementById('stock');
    
    if (tickerInput) {
        tickerInput.addEventListener('input', function() {
            validateTicker(this.value);
        });

        tickerInput.addEventListener('blur', function() {
            this.value = this.value.toUpperCase();
        });
    }
}

function validateTicker(ticker) {
    const input = document.getElementById('stock');
    const tickerRegex = /^[A-Z0-9\-]{2,12}$/;

    if (ticker && !tickerRegex.test(ticker.toUpperCase())) {
        input.classList.add('border-red-500');
        showHint('Invalid ticker format. Use format like: BTC-USD', 'error');
    } else {
        input.classList.remove('border-red-500');
        input.classList.add('border-green-500');
    }
}

function handleFormSubmit(e) {
    const ticker = document.getElementById('stock').value.trim();
    const days = document.getElementById('no_of_days').value;

    if (!ticker) {
        e.preventDefault();
        showNotification('Please enter a valid cryptocurrency ticker', 'error');
        return;
    }

    // Show loading state
    const button = e.target.querySelector('button[type="submit"]');
    if (button) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Re-enable after form submission
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
        }, 2000);
    }
}

// ============================================
// Range Slider Handler
// ============================================

function updateDaysValue(value) {
    const display = document.getElementById('days-value');
    if (display) {
        display.textContent = value;
        display.parentElement.classList.add('animate-bounce-in');
        setTimeout(() => {
            display.parentElement.classList.remove('animate-bounce-in');
        }, 600);
    }
}

function addSliderAnimation() {
    const slider = document.getElementById('no_of_days');
    if (slider) {
        slider.style.opacity = '0.8';
        setTimeout(() => {
            slider.style.opacity = '1';
        }, 100);
    }
}

// ============================================
// Navigation Setup
// ============================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }

        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// ============================================
// Table Interactions
// ============================================

function setupTableInteractions() {
    const tableRows = document.querySelectorAll('table tbody tr');

    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;

        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
            this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });

        row.addEventListener('click', function() {
            this.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 300);
        });
    });
}

// ============================================
// Notifications & Hints
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg animate-slide-in-right z-50`;

    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'warning'
    };

    const colors = {
        'info': 'bg-blue-50 text-blue-800 border border-blue-200',
        'success': 'bg-green-50 text-green-800 border border-green-200',
        'error': 'bg-red-50 text-red-800 border border-red-200',
        'warning': 'bg-yellow-50 text-yellow-800 border border-yellow-200'
    };

    notification.classList.add(colors[type]);
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

function showHint(message, type = 'info') {
    // Optional: Show inline hint near form element
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ============================================
// Responsive Sidebar
// ============================================

function setupResponsiveSidebar() {
    // Add hamburger menu for mobile (optional)
    if (window.innerWidth < 1024) {
        setupMobileSidebar();
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth < 1024) {
            setupMobileSidebar();
        }
    });
}

function setupMobileSidebar() {
    // Sidebar will be handled by Tailwind's responsive classes
    // This is a placeholder for future enhancements
}

// ============================================
// Tooltips (Optional)
// ============================================

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            // Position tooltip
            document.body.appendChild(tooltip);
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';

            element._tooltip = tooltip;
        });

        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                delete this._tooltip;
            }
        });
    });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Format number as currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Debounce function for performance
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function for scroll/resize events
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Performance Monitoring
// ============================================

function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page Load Time: ${loadTime}ms`);

        const metrics = {
            'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
            'TCP Connection': timing.connectEnd - timing.connectStart,
            'Server Response': timing.responseEnd - timing.requestStart,
            'DOM Parse': timing.domInteractive - timing.domLoading,
            'DOM Content Loaded': timing.domContentLoadedEventEnd - timing.navigationStart,
            'Page Load': loadTime
        };

        console.table(metrics);
    }
}

// Log performance metrics when page loads
window.addEventListener('load', function() {
    logPerformanceMetrics();
});

// ============================================
// Export Functions for Use
// ============================================

window.DashboardUtils = {
    formatCurrency,
    formatDate,
    debounce,
    throttle,
    showNotification,
    updateDaysValue
};

