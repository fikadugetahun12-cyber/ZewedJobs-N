// Main Application Object
const ZewedJobs = {
    // Initialization
    init() {
        this.initMobileMenu();
        this.initFilters();
        this.initModals();
        this.initSearch();
        this.loadFeaturedJobs();
        this.loadJobCategories();
        this.loadTrendingSearches();
        this.initServiceWorker();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.initAdSystem();
    },
    
    // Mobile Menu
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navButtons = document.getElementById('navButtons');
        
        if (mobileMenuBtn && navButtons) {
            mobileMenuBtn.addEventListener('click', () => {
                navButtons.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (navButtons.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-buttons') && !e.target.closest('.mobile-menu-btn')) {
                    navButtons.classList.remove('active');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                }
            });
        }
    },
    
    // Advanced Filters
    initFilters() {
        const filterOptions = document.querySelectorAll('.filter-option');
        const filterToggle = document.querySelector('.filter-toggle');
        const advancedFilters = document.getElementById('advancedFilters');
        
        if (filterToggle && advancedFilters) {
            filterToggle.addEventListener('click', () => {
                advancedFilters.classList.toggle('active');
                const icon = filterToggle.querySelector('i');
                if (advancedFilters.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                    filterToggle.innerHTML = '<i class="fas fa-times"></i> Close Filters';
                } else {
                    icon.className = 'fas fa-filter';
                    filterToggle.innerHTML = '<i class="fas fa-filter"></i> Advanced Filters';
                }
            });
        }
        
        // Filter option click handler
        filterOptions.forEach(option => {
            option.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    },
    
    // Apply Filters
    applyFilters() {
        const activeFilters = {
            location: [],
            experience: [],
            salaryRange: document.getElementById('salaryRange').value,
            postedDate: document.getElementById('postedDate').value
        };
        
        // Collect active filter options
        document.querySelectorAll('.filter-option.active').forEach(option => {
            const type = option.dataset.filterType;
            const value = option.dataset.filterValue;
            if (type && value && activeFilters[type]) {
                if (Array.isArray(activeFilters[type])) {
                    activeFilters[type].push(value);
                }
            }
        });
        
        // Show notification with active filters
        let filterText = 'Applied filters: ';
        const filters = [];
        
        if (activeFilters.location.length > 0) {
            filters.push(`📍 ${activeFilters.location.join(', ')}`);
        }
        if (activeFilters.experience.length > 0) {
            filters.push(`💼 ${activeFilters.experience.join(', ')}`);
        }
        if (activeFilters.salaryRange) {
            filters.push(`💰 ${document.getElementById('salaryRange').options[document.getElementById('salaryRange').selectedIndex].text}`);
        }
        if (activeFilters.postedDate) {
            filters.push(`📅 ${document.getElementById('postedDate').options[document.getElementById('postedDate').selectedIndex].text}`);
        }
        
        if (filters.length > 0) {
            this.showNotification(`✅ ${filterText}${filters.join(' | ')}`, 'success');
        } else {
            this.showNotification('ℹ️ No filters selected', 'info');
        }
        
        // Close filters panel
        const advancedFilters = document.getElementById('advancedFilters');
        const filterToggle = document.querySelector('.filter-toggle');
        if (advancedFilters && filterToggle) {
            advancedFilters.classList.remove('active');
            filterToggle.innerHTML = '<i class="fas fa-filter"></i> Advanced Filters';
        }
    },
    
    // Modals
    initModals() {
        const modal = document.getElementById('modal');
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    },
    
    showModal(type) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        
        if (type === 'login') {
            modalBody.innerHTML = `
                <h3>Login to ZewedJobs</h3>
                <input type="email" id="loginEmail" placeholder="Email Address" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                        <input type="checkbox" id="rememberMe"> Remember me
                    </label>
                    <a href="#" style="color: var(--primary); font-size: 14px;" onclick="ZewedJobs.showForgotPassword()">Forgot password?</a>
                </div>
                <button onclick="ZewedJobs.submitLogin()" class="btn btn-primary" style="width: 100%; margin-bottom: 20px;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin-bottom: 15px;">Don't have an account?</p>
                    <button onclick="ZewedJobs.showModal('signup')" class="btn btn-outline">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </div>
            `;
        } else if (type === 'signup') {
            modalBody.innerHTML = `
                <h3>Create Account</h3>
                <input type="text" id="signupName" placeholder="Full Name" required>
                <input type="email" id="signupEmail" placeholder="Email Address" required>
                <input type="password" id="signupPassword" placeholder="Password (min. 8 characters)" required>
                <div id="passwordStrength" style="font-size: 12px; color: #666; margin-bottom: 15px;"></div>
                <select id="userType" style="margin-bottom: 20px;">
                    <option value="">I am looking for...</option>
                    <option value="job">💼 Job Opportunities</option>
                    <option value="course">🎓 Free Courses</option>
                    <option value="employer">🏢 Post Jobs (Employer)</option>
                </select>
                <div style="font-size: 12px; color: #666; margin-bottom: 20px;">
                    By signing up, you agree to our <a href="#" style="color: var(--primary);">Terms</a> and <a href="#" style="color: var(--primary);">Privacy Policy</a>
                </div>
                <button onclick="ZewedJobs.submitSignup()" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-user-plus"></i> Create Account
                </button>
            `;
            
            // Add password strength indicator
            const passwordInput = document.getElementById('signupPassword');
            const strengthIndicator = document.getElementById('passwordStrength');
            
            passwordInput.addEventListener('input', () => {
                const strength = this.checkPasswordStrength(passwordInput.value);
                strengthIndicator.innerHTML = `Password Strength: <strong style="color: ${strength.color};">${strength.text}</strong>`;
            });
        } else if (type === 'forgot') {
            modalBody.innerHTML = `
                <h3>Reset Password</h3>
                <p style="margin-bottom: 20px; color: #666;">Enter your email address and we'll send you a link to reset your password.</p>
                <input type="email" id="forgotEmail" placeholder="Email Address" required>
                <button onclick="ZewedJobs.submitForgotPassword()" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                    <i class="fas fa-paper-plane"></i> Send Reset Link
                </button>
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="ZewedJobs.showModal('login')" class="btn btn-outline" style="font-size: 14px;">
                        <i class="fas fa-arrow-left"></i> Back to Login
                    </button>
                </div>
            `;
        } else if (type === 'advertise') {
            modalBody.innerHTML = `
                <h3>Advertise with ZewedJobs</h3>
                <p style="margin-bottom: 20px; color: #666;">Reach 50,000+ Ethiopian professionals. Choose your advertising package:</p>
                
                <div style="background: var(--primary-light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px; color: var(--primary);">📢 Banner Advertising</h4>
                    <ul style="padding-left: 20px; margin-bottom: 10px;">
                        <li>Top banner: ETB 5,000/week</li>
                        <li>Middle banner: ETB 3,500/week</li>
                        <li>Sidebar banner: ETB 2,500/week</li>
                    </ul>
                </div>
                
                <div style="background: var(--primary-light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px; color: var(--primary);">🏢 Featured Business Listing</h4>
                    <ul style="padding-left: 20px; margin-bottom: 10px;">
                        <li>Basic listing: ETB 1,500/month</li>
                        <li>Premium listing: ETB 3,000/month</li>
                        <li>Featured spot: ETB 5,000/month</li>
                    </ul>
                </div>
                
                <input type="text" id="companyName" placeholder="Company Name" required>
                <input type="email" id="companyEmail" placeholder="Email Address" required>
                <input type="tel" id="companyPhone" placeholder="Phone Number" required>
                <select id="adPackage" style="margin-bottom: 20px;">
                    <option value="">Select Advertising Package</option>
                    <option value="top-banner">Top Banner (ETB 5,000/week)</option>
                    <option value="middle-banner">Middle Banner (ETB 3,500/week)</option>
                    <option value="sidebar-banner">Sidebar Banner (ETB 2,500/week)</option>
                    <option value="basic-listing">Basic Listing (ETB 1,500/month)</option>
                    <option value="premium-listing">Premium Listing (ETB 3,000/month)</option>
                </select>
                
                <button onclick="ZewedJobs.submitAdRequest()" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-paper-plane"></i> Submit Advertising Request
                </button>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666;">Or contact us directly:</p>
                    <p style="font-size: 14px; margin: 5px 0;"><i class="fas fa-phone"></i> +251 92 485 8244</p>
                    <p style="font-size: 14px; margin: 5px 0;"><i class="fas fa-envelope"></i> ads@zewedjobs.com</p>
                </div>
            `;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modalBody.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 100);
    },
    
    hideModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('modalBody').innerHTML = '';
    },
    
    showForgotPassword() {
        this.hideModal();
        setTimeout(() => this.showModal('forgot'), 300);
    },
    
    // Authentication
    submitLogin() {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading
        const button = document.querySelector('#modalBody .btn-primary');
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.hideModal();
            this.showNotification('✅ Login successful! Welcome back.', 'success');
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Update UI for logged in user
            this.updateUserUI({
                name: 'User Name',
                email: email,
                role: 'job_seeker'
            });
        }, 1500);
    },
    
    submitSignup() {
        const name = document.getElementById('signupName')?.value;
        const email = document.getElementById('signupEmail')?.value;
        const password = document.getElementById('signupPassword')?.value;
        const userType = document.getElementById('userType')?.value;
        
        if (!name || !email || !password || !userType) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (password.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Show loading
        const button = document.querySelector('#modalBody .btn-primary');
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.hideModal();
            this.showNotification('🎉 Account created successfully! Check your email for verification.', 'success');
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    },
    
    submitForgotPassword() {
        const email = document.getElementById('forgotEmail')?.value;
        
        if (!email) {
            this.showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Show loading
        const button = document.querySelector('#modalBody .btn-primary');
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.hideModal();
            this.showNotification('📧 Password reset link sent to your email.', 'success');
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    },
    
    checkPasswordStrength(password) {
        let strength = 0;
        let text = 'Very Weak';
        let color = '#e74c3c';
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        switch(strength) {
            case 0:
            case 1:
                text = 'Very Weak';
                color = '#e74c3c';
                break;
            case 2:
                text = 'Weak';
                color = '#e67e22';
                break;
            case 3:
                text = 'Good';
                color = '#f1c40f';
                break;
            case 4:
                text = 'Strong';
                color = '#2ecc71';
                break;
            case 5:
                text = 'Very Strong';
                color = '#27ae60';
                break;
        }
        
        return { text, color };
    },
    
    updateUserUI(userData) {
        // Update navigation for logged in user
        const navButtons = document.getElementById('navButtons');
        if (navButtons && userData.name) {
            navButtons.innerHTML = `
                <div class="user-menu" style="display: flex; align-items: center; gap: 10px;">
                    <button class="btn btn-outline" onclick="ZewedJobs.showUserMenu()">
                        <i class="fas fa-user"></i> ${userData.name.split(' ')[0]}
                    </button>
                </div>
            `;
        }
    },
    
    showUserMenu() {
        this.showNotification('User menu would open here', 'info');
    },
    
    // Search
    initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = searchInput?.nextElementSibling;
        
        if (searchInput) {
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchJobs();
                }
            });
            
            // Real-time suggestions
            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                if (searchInput.value.length >= 2) {
                    debounceTimer = setTimeout(() => {
                        this.showSearchSuggestions(searchInput.value);
                    }, 300);
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchJobs());
        }
    },
    
    searchJobs() {
        const query = document.getElementById('searchInput')?.value?.trim();
        if (!query) {
            this.showNotification('Please enter a search term', 'warning');
            return;
        }
        
        this.showNotification(`🔍 Searching for: "${query}"...`, 'info');
        
        // Show loading on search button
        const searchButton = document.querySelector('.search-box button');
        if (searchButton) {
            const originalText = searchButton.innerHTML;
            searchButton.innerHTML = '<div class="loading"></div>';
            searchButton.disabled = true;
            
            setTimeout(() => {
                searchButton.innerHTML = originalText;
                searchButton.disabled = false;
                // In real app: window.location.href = `/jobs?q=${encodeURIComponent(query)}`;
            }, 800);
        }
    },
    
    searchTag(tag) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = tag;
            this.searchJobs();
        }
    },
    
    showSearchSuggestions(query) {
        // Mock suggestions
        const suggestions = [
            { type: 'job', text: 'Software Developer', count: 245 },
            { type: 'job', text: 'Software Engineer', count: 189 },
            { type: 'course', text: 'Digital Marketing Course', count: 56 },
            { type: 'company', text: 'Safaricom Ethiopia', count: 34 },
            { type: 'skill', text: 'React.js', count: 89 }
        ].filter(item => 
            item.text.toLowerCase().includes(query.toLowerCase())
        );
        
        if (suggestions.length > 0) {
            // In a real app, you would display these suggestions in a dropdown
            console.log('Search suggestions:', suggestions);
        }
    },
    
    // Data Loading
    async loadFeaturedJobs() {
        try {
            const jobs = [
                {
                    id: 1,
                    title: 'Data Analyst',
                    company: 'Commercial Bank of Ethiopia',
                    location: 'Addis Ababa',
                    salary: 'ETB 35,000 - 45,000',
                    type: 'Full-time',
                    experience: '2-4 years',
                    icon: '📊'
                },
                {
                    id: 2,
                    title: 'Nurse',
                    company: 'St. Paul Hospital',
                    location: 'Addis Ababa',
                    salary: 'ETB 18,000 - 25,000',
                    type: 'Full-time',
                    experience: '1-3 years',
                    icon: '🏥'
                },
                {
                    id: 3,
                    title: 'Civil Engineer',
                    company: 'Ethiopian Construction Works',
                    location: 'Addis Ababa',
                    salary: 'ETB 40,000 - 55,000',
                    type: 'Contract',
                    experience: '3-5 years',
                    icon: '🏗️'
                }
            ];
            
            const container = document.getElementById('featuredJobs');
            if (container) {
                container.innerHTML = jobs.map(job => `
                    <div class="job-card" onclick="ZewedJobs.viewJob(${job.id})">
                        <div class="job-card-header">
                            <div class="job-card-icon">${job.icon}</div>
                            <div>
                                <h3 class="job-card-title">${job.title}</h3>
                                <p class="job-card-company">${job.company}</p>
                            </div>
                        </div>
                        <div class="job-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                            <span><i class="fas fa-clock"></i> ${job.type}</span>
                            <span><i class="fas fa-user-tie"></i> ${job.experience}</span>
                        </div>
                        <div class="job-card-salary">${job.salary}</div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading featured jobs:', error);
        }
    },
    
    async loadJobCategories() {
        try {
            const categories = [
                { name: 'Technology', count: 1245, icon: '💻' },
                { name: 'Healthcare', count: 876, icon: '🏥' },
                { name: 'Finance', count: 654, icon: '💰' },
                { name: 'Education', count: 543, icon: '🎓' },
                { name: 'Marketing', count: 432, icon: '📢' },
                { name: 'Engineering', count: 321, icon: '🔧' }
            ];
            
            const container = document.getElementById('jobCategories');
            if (container) {
                container.innerHTML = categories.map(cat => `
                    <div class="category-card" onclick="ZewedJobs.searchTag('${cat.name}')">
                        <div class="category-icon">${cat.icon}</div>
                        <div class="category-content">
                            <h4>${cat.name}</h4>
                            <p>${cat.count.toLocaleString()} jobs</p>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    },
    
    async loadTrendingSearches() {
        try {
            const trending = [
                'Software Developer',
                'Data Analyst',
                'Project Manager',
                'Nurse',
                'Accountant',
                'Digital Marketing',
                'Civil Engineer',
                'Teacher'
            ];
            
            const container = document.getElementById('trendingSearches');
            if (container) {
                container.innerHTML = trending.map(item => `
                    <button class="trending-tag" onclick="ZewedJobs.searchTag('${item}')">
                        <i class="fas fa-hashtag"></i> ${item}
                    </button>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading trending searches:', error);
        }
    },
    
    // Feature Functions
    applyOpportunity(jobTitle) {
        this.showNotification(`✅ Application submitted for: ${jobTitle}`, 'success');
    },
    
    enrollCourse(courseName) {
        this.showNotification(`🎓 Enrolled in: ${courseName}`, 'success');
    },
    
    selectPlan(planName) {
        if (planName === 'Enterprise') {
            this.showNotification(`📞 Contacting sales team for ${planName} plan...`, 'info');
        } else {
            this.showNotification(`✅ Selected plan: ${planName}`, 'success');
        }
    },
    
    followSocial(platform) {
        const links = {
            telegram: 'https://t.me/zewedjobs',
            facebook: 'https://facebook.com/zewedjobs',
            linkedin: 'https://linkedin.com/company/zewedjobs',
            youtube: 'https://youtube.com/zewedjobs'
        };
        
        this.showNotification(`📱 Opening ${platform}...`, 'info');
        // In real app: window.open(links[platform], '_blank');
    },
    
    registerEvent(eventName) {
        this.showNotification(`🎫 Registering for: ${eventName}`, 'success');
    },
    
    readNews(title) {
        this.showNotification(`📰 Opening article: ${title}`, 'info');
    },
    
    selectPayment(method) {
        const methodNames = {
            telebirr: 'Telebirr',
            cbe: 'CBE Birr',
            hellocash: 'HelloCash',
            amole: 'Amole'
        };
        
        this.showNotification(`💰 Selected payment: ${methodNames[method]}`, 'success');
    },
    
    copyTeleBirr(event) {
        event.stopPropagation();
        const phoneNumber = '+251924858244';
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(phoneNumber).then(() => {
                this.showNotification('📱 Telebirr number copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback for older browsers
                this.copyToClipboardFallback(phoneNumber);
            });
        } else {
            this.copyToClipboardFallback(phoneNumber);
        }
    },
    
    copyToClipboardFallback(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('📱 Telebirr number copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('❌ Failed to copy. Please copy manually: ' + text, 'error');
        }
        
        document.body.removeChild(textarea);
    },
    
    viewJob(jobId) {
        this.showNotification(`🔍 Viewing job details for ID: ${jobId}`, 'info');
        // In real app: window.location.href = `/job/${jobId}`;
    },
    
    // Policies
    showPrivacyPolicy() {
        this.showModal('privacy');
    },
    
    showTerms() {
        this.showModal('terms');
    },
    
    showCookiePolicy() {
        this.showModal('cookies');
    },
    
    // Service Worker
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    },
    
    // Auth Status
    checkAuthStatus() {
        // Check if user is logged in (from localStorage, cookies, etc.)
        const user = localStorage.getItem('zewedjobs-user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                this.updateUserUI(userData);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    },
    
    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${this.getNotificationIcon(type)}
            </div>
            <div style="flex: 1;">
                ${message}
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease reverse forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    },
    
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    },
    
    // Event Listeners
    setupEventListeners() {
        // Online/offline detection
        window.addEventListener('online', () => {
            this.showNotification('🌐 You are back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('📴 You are offline. Some features may be limited.', 'warning');
        });
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden
            } else {
                // Page is visible
            }
        });
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    ZewedJobs.init();
});

// Make functions globally available
window.showModal = (type) => ZewedJobs.showModal(type);
window.hideModal = () => ZewedJobs.hideModal();
window.searchJobs = () => ZewedJobs.searchJobs();
window.searchTag = (tag) => ZewedJobs.searchTag(tag);
window.toggleAdvancedFilters = () => {
    const btn = document.querySelector('.filter-toggle');
    if (btn) btn.click();
};
window.applyFilters = () => ZewedJobs.applyFilters();
window.applyOpportunity = (job) => ZewedJobs.applyOpportunity(job);
window.enrollCourse = (course) => ZewedJobs.enrollCourse(course);
window.selectPlan = (plan) => ZewedJobs.selectPlan(plan);
window.followSocial = (platform) => ZewedJobs.followSocial(platform);
window.registerEvent = (event) => ZewedJobs.registerEvent(event);
window.readNews = (title) => ZewedJobs.readNews(title);
window.selectPayment = (method) => ZewedJobs.selectPayment(method);
window.copyTeleBirr = (e) => ZewedJobs.copyTeleBirr(e);
window.showPrivacyPolicy = () => ZewedJobs.showPrivacyPolicy();
window.showTerms = () => ZewedJobs.showTerms();
window.showCookiePolicy = () => ZewedJobs.showCookiePolicy();
window.ZewedJobs = ZewedJobs;
