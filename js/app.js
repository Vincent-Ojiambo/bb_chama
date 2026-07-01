/**
 * Main Application - Fully Responsive with Mobile Sidebar
 */
(function() {
    'use strict';

    // ===== DOM REFS =====
    const DOM = {
        app: document.getElementById('app'),
        header: document.getElementById('header'),
        headerNav: document.getElementById('headerNav'),
        mobileToggle: document.getElementById('mobileToggle'),
        mobileSidebar: document.getElementById('mobileSidebar'),
        mobileOverlay: document.getElementById('mobileOverlay'),
        mobileSidebarClose: document.getElementById('mobileSidebarClose'),
        userBadge: document.getElementById('userBadge'),
        userNameDisplay: document.getElementById('userNameDisplay'),
        roleBadge: document.getElementById('roleBadge'),
        loginNavBtn: document.getElementById('loginNavBtn'),
        registerNavBtn: document.getElementById('registerNavBtn'),
        logoutNavBtn: document.getElementById('logoutNavBtn'),
        brandHome: document.getElementById('brandHome'),
        membersNav: document.getElementById('membersNav'),
        mobileMembersNav: document.getElementById('mobileMembersNav'),
        mobileLoginNav: document.getElementById('mobileLoginNav'),
        mobileRegisterNav: document.getElementById('mobileRegisterNav'),
        mobileLogoutNav: document.getElementById('mobileLogoutNav'),
        mobileSidebarUser: document.getElementById('mobileSidebarUser'),
        mobileUserName: document.getElementById('mobileUserName'),
        mobileUserRole: document.getElementById('mobileUserRole'),
        modalOverlay: document.getElementById('modalOverlay'),
        modalTitle: document.getElementById('modalTitle'),
        modalMessage: document.getElementById('modalMessage'),
        modalCloseBtn: document.getElementById('modalCloseBtn'),
        modalConfirmBtn: document.getElementById('modalConfirmBtn'),
        modalInputContainer: document.getElementById('modalInputContainer'),
        toastContainer: document.getElementById('toastContainer'),
        body: document.body
    };

    // ===== STATE =====
    let currentUser = null;
    let modalCallback = null;
    let isLoggedIn = false;

    // ===== MOCK DATA =====
    const mockData = {
        transactions: [
            { id: 1, date: '2026-06-28', description: 'Monthly Contribution', type: 'deposit', amount: 10000, status: 'completed' },
            { id: 2, date: '2026-06-25', description: 'Project Dividend', type: 'deposit', amount: 2400, status: 'completed' },
            { id: 3, date: '2026-06-20', description: 'Welfare Support', type: 'withdraw', amount: 5000, status: 'active' },
            { id: 4, date: '2026-06-15', description: 'Loan Repayment', type: 'withdraw', amount: 3200, status: 'pending' },
            { id: 5, date: '2026-06-10', description: 'Investment Return', type: 'deposit', amount: 1800, status: 'completed' },
            { id: 6, date: '2026-06-05', description: 'Emergency Fund', type: 'withdraw', amount: 2000, status: 'completed' },
            { id: 7, date: '2026-06-01', description: 'Monthly Contribution', type: 'deposit', amount: 10000, status: 'completed' },
            { id: 8, date: '2026-05-28', description: 'Business Loan', type: 'loan', amount: 50000, status: 'active' },
        ],
        loans: [
            { id: 1, member: 'John Kamau', amount: 50000, interest: 10, term: '6 months', status: 'active', date: '2026-05-28' },
            { id: 2, member: 'Mary Wanjiku', amount: 30000, interest: 8, term: '4 months', status: 'pending', date: '2026-06-20' },
            { id: 3, member: 'Peter Ochieng', amount: 75000, interest: 12, term: '8 months', status: 'completed', date: '2026-04-15' },
            { id: 4, member: 'Grace Akinyi', amount: 20000, interest: 8, term: '3 months', status: 'active', date: '2026-06-10' },
        ],
        investments: [
            { id: 1, name: 'Real Estate Fund', amount: 100000, returns: 15, status: 'active', date: '2026-01-15' },
            { id: 2, name: 'Agricultural Project', amount: 50000, returns: 12, status: 'completed', date: '2025-11-20' },
            { id: 3, name: 'Tech Startup', amount: 25000, returns: 20, status: 'active', date: '2026-03-10' },
        ],
        members: [
            { id: 1, name: 'John Kamau', email: 'john@email.com', role: 'member', status: 'online', joined: '2020-01-15' },
            { id: 2, name: 'Mary Wanjiku', email: 'mary@email.com', role: 'member', status: 'online', joined: '2021-03-20' },
            { id: 3, name: 'Peter Ochieng', email: 'peter@email.com', role: 'member', status: 'offline', joined: '2022-06-10' },
            { id: 4, name: 'Grace Akinyi', email: 'grace@email.com', role: 'member', status: 'online', joined: '2023-01-05' },
            { id: 5, name: 'David Mwangi', email: 'david@email.com', role: 'pending', status: 'pending', joined: '2026-06-25' },
        ],
        events: [
            { date: '2026-07-05', desc: 'Monthly Meeting' },
            { date: '2026-07-15', desc: 'Investment Review' },
            { date: '2026-07-20', desc: 'Welfare Committee Meeting' },
            { date: '2026-07-28', desc: 'Dividend Payout' },
        ]
    };

    // ===== UTILITY FUNCTIONS =====

    function showToast(message, type = '') {
        const toast = document.createElement('div');
        toast.className = 'toast' + (type ? ' ' + type : '');
        toast.textContent = message;
        DOM.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }

    function toggleHeader(show) {
        if (show) {
            DOM.header.classList.remove('hidden');
            DOM.body.classList.remove('header-hidden');
        } else {
            DOM.header.classList.add('hidden');
            DOM.body.classList.add('header-hidden');
        }
    }

    function toggleMobileSidebar(open) {
        if (open) {
            DOM.mobileSidebar.classList.add('open');
            DOM.mobileOverlay.classList.add('active');
            DOM.body.classList.add('mobile-sidebar-open');
        } else {
            DOM.mobileSidebar.classList.remove('open');
            DOM.mobileOverlay.classList.remove('active');
            DOM.body.classList.remove('mobile-sidebar-open');
        }
    }

    function formatCurrency(amount) {
        return 'KES ' + amount.toLocaleString();
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function getStatusBadge(status) {
        const map = {
            'completed': 'completed',
            'active': 'active',
            'pending': 'pending',
            'failed': 'failed',
            'online': 'active',
            'offline': 'pending',
            'approved': 'completed',
            'rejected': 'failed'
        };
        return map[status] || status;
    }

    function showModal(title, message, confirmText, onConfirm, inputPlaceholder, inputType = 'text') {
        DOM.modalTitle.textContent = title;
        DOM.modalMessage.textContent = message;
        DOM.modalConfirmBtn.textContent = confirmText || 'Confirm';
        DOM.modalInputContainer.innerHTML = '';
        modalCallback = onConfirm;

        if (inputPlaceholder) {
            const input = document.createElement('input');
            input.type = inputType;
            input.className = 'modal-input';
            input.placeholder = inputPlaceholder;
            input.id = 'modalInput';
            DOM.modalInputContainer.appendChild(input);
        }

        const newConfirm = DOM.modalConfirmBtn.cloneNode(true);
        const newClose = DOM.modalCloseBtn.cloneNode(true);
        DOM.modalConfirmBtn.parentNode.replaceChild(newConfirm, DOM.modalConfirmBtn);
        DOM.modalCloseBtn.parentNode.replaceChild(newClose, DOM.modalCloseBtn);

        const confirmBtn = document.getElementById('modalConfirmBtn');
        const closeBtn = document.getElementById('modalCloseBtn');

        confirmBtn.addEventListener('click', function() {
            DOM.modalOverlay.classList.remove('active');
            const input = document.getElementById('modalInput');
            if (modalCallback) {
                modalCallback(input ? input.value : null);
            }
        });

        closeBtn.addEventListener('click', function() {
            DOM.modalOverlay.classList.remove('active');
            if (modalCallback) modalCallback(null);
        });

        DOM.modalOverlay.classList.add('active');
        DOM.modalOverlay.onclick = function(e) {
            if (e.target === DOM.modalOverlay) {
                DOM.modalOverlay.classList.remove('active');
                if (modalCallback) modalCallback(null);
            }
        };
    }

    // ===== PAGE RENDERERS =====
    // (All page renderers remain the same as before - see previous version)
    // For brevity, I'll include the key renderers and navigation

    function renderHome() {
        const html = `
            <div class="hero">
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-text">
                            <h1>Welcome to <br><span>AKL Beyond Borders</span></h1>
                            <p>Empowering members through collective savings, strategic investments, and financial growth. Join our community and build your financial future together.</p>
                            <div class="hero-buttons">
                                <a class="btn btn-primary btn-lg" data-page="register"><i class="fas fa-user-plus"></i> Become a Member</a>
                                <a class="btn btn-outline-light btn-lg" data-page="login"><i class="fas fa-sign-in-alt"></i> Login</a>
                            </div>
                            <div class="hero-stats">
                                <div class="hero-stat"><div class="number">100+</div><div class="label">Active Members</div></div>
                                <div class="hero-stat"><div class="number">KES 5M</div><div class="label">Total Savings</div></div>
                                <div class="hero-stat"><div class="number">50+</div><div class="label">Projects Funded</div></div>
                            </div>
                        </div>
                        <div class="hero-image">
                            <div class="hero-card">
                                <div class="icon"><i class="fas fa-hand-holding-usd"></i></div>
                                <h3>Why Join Us?</h3>
                                <p>Access to loans, investments, welfare support, and financial education.</p>
                                <ul class="hero-features">
                                    <li><i class="fas fa-check-circle"></i> Forced Savings</li>
                                    <li><i class="fas fa-check-circle"></i> Affordable Loans</li>
                                    <li><i class="fas fa-check-circle"></i> Investment Returns</li>
                                    <li><i class="fas fa-check-circle"></i> Welfare Support</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="about-section">
                <div class="container">
                    <div class="about-grid">
                        <div class="about-image">
                            <i class="fas fa-users"></i>
                            <h3>Building Financial Freedom Together</h3>
                            <p style="color: #2e7d32; margin-top: 8px;">Since 2020</p>
                        </div>
                        <div class="about-text">
                            <h2>About Our Chama</h2>
                            <p>AKL Beyond Borders Group is a premier financial community founded by visionary individuals dedicated to transforming lives through collective savings and strategic investments.</p>
                            <p>We have grown from a small savings group to a robust financial ecosystem with over 100 members across different regions, all united by a common goal: financial freedom.</p>
                            <ul>
                                <li><i class="fas fa-check-circle"></i> Transparent operations and governance</li>
                                <li><i class="fas fa-check-circle"></i> Member-centric approach</li>
                                <li><i class="fas fa-check-circle"></i> Proven track record of returns</li>
                                <li><i class="fas fa-check-circle"></i> Strong community support network</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="features-section">
                <div class="container">
                    <div class="text-center">
                        <h2 class="section-title">Why Choose AKL Beyond Borders?</h2>
                        <p class="section-sub">Comprehensive financial solutions designed for your growth</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card"><div class="icon"><i class="fas fa-piggy-bank"></i></div><h4>Forced Savings</h4><p>Build discipline through regular contributions that grow over time.</p></div>
                        <div class="feature-card"><div class="icon"><i class="fas fa-hand-holding-usd"></i></div><h4>Access to Loans</h4><p>Affordable loans with competitive rates based on your savings.</p></div>
                        <div class="feature-card"><div class="icon"><i class="fas fa-chart-line"></i></div><h4>Investment Returns</h4><p>Participate in group investments that generate consistent returns.</p></div>
                        <div class="feature-card"><div class="icon"><i class="fas fa-heartbeat"></i></div><h4>Welfare Support</h4><p>Emergency financial support during difficult times and celebrations.</p></div>
                        <div class="feature-card"><div class="icon"><i class="fas fa-graduation-cap"></i></div><h4>Financial Education</h4><p>Learn about wealth creation, investment strategies, and money management.</p></div>
                        <div class="feature-card"><div class="icon"><i class="fas fa-network-wired"></i></div><h4>Networking</h4><p>Connect with like-minded individuals and build valuable relationships.</p></div>
                    </div>
                </div>
            </div>

            <div id="services-section">
                <div class="container">
                    <div class="text-center">
                        <h2 class="section-title">What We Offer</h2>
                        <p class="section-sub">Comprehensive financial services for our members</p>
                    </div>
                    <div class="services-grid">
                        <div class="service-card"><div class="icon"><i class="fas fa-coins"></i></div><h4>Savings Plans</h4><p>Flexible savings plans to suit your financial goals</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-hand-holding-usd"></i></div><h4>Loan Services</h4><p>Quick access to affordable loans with fair terms</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-building"></i></div><h4>Real Estate</h4><p>Group real estate investments for long-term wealth</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-seedling"></i></div><h4>Agriculture</h4><p>Agribusiness investments with sustainable returns</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-chart-pie"></i></div><h4>Dividend Payouts</h4><p>Regular dividend distributions from profitable investments</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-heart"></i></div><h4>Welfare Fund</h4><p>Support for members during emergencies and celebrations</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-graduation-cap"></i></div><h4>Financial Literacy</h4><p>Workshops and resources on money management</p></div>
                        <div class="service-card"><div class="icon"><i class="fas fa-users-cog"></i></div><h4>Community Building</h4><p>Networking events and community activities</p></div>
                    </div>
                </div>
            </div>

            <div id="testimonials-section">
                <div class="container">
                    <div class="text-center">
                        <h2 class="section-title">What Our Members Say</h2>
                        <p class="section-sub">Real experiences from our community</p>
                    </div>
                    <div class="testimonials-grid">
                        <div class="testimonial-card">
                            <p>"Joining AKL Beyond Borders was one of the best financial decisions I've made. The disciplined savings approach and access to loans have helped me grow my business significantly."</p>
                            <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                            <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>John Kamau</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2020</div></div></div>
                        </div>
                        <div class="testimonial-card">
                            <p>"The welfare support came in handy when I had a medical emergency. The group stood by me and provided the financial assistance I needed. This is truly a family."</p>
                            <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                            <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>Mary Wanjiku</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2021</div></div></div>
                        </div>
                        <div class="testimonial-card">
                            <p>"The investment opportunities have been amazing. I've learned so much about financial management and my savings have grown beyond my expectations."</p>
                            <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></div>
                            <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>Peter Ochieng</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2022</div></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="cta-section">
                <div class="container">
                    <h2>Ready to Build Your Financial Future?</h2>
                    <p>Join AKL Beyond Borders today and start your journey towards financial freedom with a community that cares.</p>
                    <div class="cta-buttons">
                        <a class="btn btn-primary btn-lg" data-page="register"><i class="fas fa-user-plus"></i> Join Now</a>
                        <a class="btn btn-outline-light btn-lg" data-page="login"><i class="fas fa-sign-in-alt"></i> Login</a>
                    </div>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';
    }

    // ===== SIMPLE PAGE RENDERERS =====
    function renderAbout() {
        const html = `
            <div class="container" style="padding: 40px 0;">
                <div class="text-center" style="margin-bottom: 40px;">
                    <h2 class="section-title">About AKL Beyond Borders</h2>
                    <p class="section-sub">Building financial freedom together since 2020</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
                    <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-radius: 32px; padding: 60px 40px; text-align: center; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <i class="fas fa-users" style="font-size: 5rem; color: #2e7d32; margin-bottom: 16px;"></i>
                        <h3 style="font-size: 2rem; color: #1a2e1a;">Our Story</h3>
                        <p style="color: #2e7d32; margin-top: 8px;">Founded in 2020</p>
                    </div>
                    <div>
                        <h2 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 16px;">Who We Are</h2>
                        <p style="color: #4a6a4a; font-size: 1.05rem; margin-bottom: 20px;">AKL Beyond Borders Group is a premier financial community founded by visionary individuals dedicated to transforming lives through collective savings and strategic investments.</p>
                        <p style="color: #4a6a4a; font-size: 1.05rem; margin-bottom: 20px;">We have grown from a small savings group to a robust financial ecosystem with over 100 members across different regions, all united by a common goal: financial freedom.</p>
                        <ul>
                            <li style="padding: 8px 0; display: flex; align-items: center; gap: 12px; font-weight: 500;"><i class="fas fa-check-circle" style="color: #43a047; font-size: 1.2rem;"></i> Transparent operations and governance</li>
                            <li style="padding: 8px 0; display: flex; align-items: center; gap: 12px; font-weight: 500;"><i class="fas fa-check-circle" style="color: #43a047; font-size: 1.2rem;"></i> Member-centric approach</li>
                            <li style="padding: 8px 0; display: flex; align-items: center; gap: 12px; font-weight: 500;"><i class="fas fa-check-circle" style="color: #43a047; font-size: 1.2rem;"></i> Proven track record of returns</li>
                            <li style="padding: 8px 0; display: flex; align-items: center; gap: 12px; font-weight: 500;"><i class="fas fa-check-circle" style="color: #43a047; font-size: 1.2rem;"></i> Strong community support network</li>
                        </ul>
                        <a class="btn btn-primary" data-page="register" style="margin-top: 16px;"><i class="fas fa-user-plus"></i> Join Our Community</a>
                    </div>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';
    }

    function renderFeatures() {
        const html = `
            <div class="container" style="padding: 40px 0;">
                <div class="text-center" style="margin-bottom: 48px;">
                    <h2 class="section-title">Our Features</h2>
                    <p class="section-sub">Comprehensive solutions for your financial growth</p>
                </div>
                <div class="features-grid">
                    <div class="feature-card"><div class="icon"><i class="fas fa-piggy-bank"></i></div><h4>Forced Savings</h4><p>Build discipline through regular contributions that grow over time.</p></div>
                    <div class="feature-card"><div class="icon"><i class="fas fa-hand-holding-usd"></i></div><h4>Access to Loans</h4><p>Affordable loans with competitive rates based on your savings.</p></div>
                    <div class="feature-card"><div class="icon"><i class="fas fa-chart-line"></i></div><h4>Investment Returns</h4><p>Participate in group investments that generate consistent returns.</p></div>
                    <div class="feature-card"><div class="icon"><i class="fas fa-heartbeat"></i></div><h4>Welfare Support</h4><p>Emergency financial support during difficult times and celebrations.</p></div>
                    <div class="feature-card"><div class="icon"><i class="fas fa-graduation-cap"></i></div><h4>Financial Education</h4><p>Learn about wealth creation, investment strategies, and money management.</p></div>
                    <div class="feature-card"><div class="icon"><i class="fas fa-network-wired"></i></div><h4>Networking</h4><p>Connect with like-minded individuals and build valuable relationships.</p></div>
                </div>
                <div style="text-align: center; margin-top: 40px;">
                    <a class="btn btn-primary" data-page="register"><i class="fas fa-user-plus"></i> Get Started Today</a>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';
    }

    function renderServices() {
        const html = `
            <div class="container" style="padding: 40px 0;">
                <div class="text-center" style="margin-bottom: 48px;">
                    <h2 class="section-title">Our Services</h2>
                    <p class="section-sub">Comprehensive financial services for our members</p>
                </div>
                <div class="services-grid">
                    <div class="service-card"><div class="icon"><i class="fas fa-coins"></i></div><h4>Savings Plans</h4><p>Flexible savings plans to suit your financial goals</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-hand-holding-usd"></i></div><h4>Loan Services</h4><p>Quick access to affordable loans with fair terms</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-building"></i></div><h4>Real Estate</h4><p>Group real estate investments for long-term wealth</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-seedling"></i></div><h4>Agriculture</h4><p>Agribusiness investments with sustainable returns</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-chart-pie"></i></div><h4>Dividend Payouts</h4><p>Regular dividend distributions from profitable investments</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-heart"></i></div><h4>Welfare Fund</h4><p>Support for members during emergencies and celebrations</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-graduation-cap"></i></div><h4>Financial Literacy</h4><p>Workshops and resources on money management</p></div>
                    <div class="service-card"><div class="icon"><i class="fas fa-users-cog"></i></div><h4>Community Building</h4><p>Networking events and community activities</p></div>
                </div>
                <div style="text-align: center; margin-top: 40px;">
                    <a class="btn btn-primary" data-page="register"><i class="fas fa-user-plus"></i> Join and Access Services</a>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';
    }

    function renderTestimonials() {
        const html = `
            <div class="container" style="padding: 40px 0;">
                <div class="text-center" style="margin-bottom: 48px;">
                    <h2 class="section-title">What Our Members Say</h2>
                    <p class="section-sub">Real experiences from our community</p>
                </div>
                <div class="testimonials-grid">
                    <div class="testimonial-card">
                        <p>"Joining AKL Beyond Borders was one of the best financial decisions I've made. The disciplined savings approach and access to loans have helped me grow my business significantly."</p>
                        <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>John Kamau</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2020</div></div></div>
                    </div>
                    <div class="testimonial-card">
                        <p>"The welfare support came in handy when I had a medical emergency. The group stood by me and provided the financial assistance I needed. This is truly a family."</p>
                        <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>Mary Wanjiku</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2021</div></div></div>
                    </div>
                    <div class="testimonial-card">
                        <p>"The investment opportunities have been amazing. I've learned so much about financial management and my savings have grown beyond my expectations."</p>
                        <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></div>
                        <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>Peter Ochieng</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2022</div></div></div>
                    </div>
                    <div class="testimonial-card">
                        <p>"The transparency and accountability in this group is unmatched. I trust AKL Beyond Borders with my savings and investments completely."</p>
                        <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>Grace Akinyi</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2023</div></div></div>
                    </div>
                    <div class="testimonial-card">
                        <p>"The financial education sessions have transformed how I manage my money. I've learned so much about investing and building wealth."</p>
                        <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>David Mwangi</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2022</div></div></div>
                    </div>
                    <div class="testimonial-card">
                        <p>"Being part of this community has given me financial security and peace of mind. The support system here is incredible."</p>
                        <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <div class="author"><div class="avatar"><i class="fas fa-user"></i></div><div><strong>Sarah Chelangat</strong><div style="font-size:0.8rem; color:#4a6a4a;">Member since 2021</div></div></div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 40px;">
                    <a class="btn btn-primary" data-page="register"><i class="fas fa-user-plus"></i> Join Our Community</a>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';
    }

    function renderLogin() {
        const html = `
            <div class="container" style="padding: 40px 0;">
                <div class="auth-wrapper">
                    <div class="auth-card">
                        <h2><i class="fas fa-sign-in-alt" style="color:#2e7d32;"></i> Login</h2>
                        <p class="sub">Access your role-based dashboard</p>
                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" placeholder="Enter email" id="loginEmail" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" placeholder="Enter password" id="loginPassword" required />
                            </div>
                            <button type="submit" class="btn btn-primary w-100"><i class="fas fa-arrow-right"></i> Login</button>
                        </form>
                        <div class="auth-footer">Don't have an account? <a data-page="register">Register now</a></div>
                    </div>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            handleLogin(email, password);
        });
    }

    function renderRegister() {
        const html = `
            <div class="container" style="padding: 40px 0;">
                <div class="auth-wrapper">
                    <div class="auth-card">
                        <h2><i class="fas fa-user-plus" style="color:#2e7d32;"></i> Join Us</h2>
                        <p class="sub">Choose your role and create an account</p>
                        <form id="registerForm">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" placeholder="Your full name" id="regName" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" placeholder="Email address" id="regEmail" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" placeholder="Phone number" id="regPhone" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" placeholder="Create password" id="regPassword" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Select Role</label>
                                <div class="role-selector" id="roleSelector">
                                    <div class="role-option selected" data-role="member"><i class="fas fa-user"></i> Member</div>
                                    <div class="role-option" data-role="admin"><i class="fas fa-user-shield"></i> Chama Admin</div>
                                </div>
                                <input type="hidden" id="regRole" value="member" />
                            </div>
                            <button type="submit" class="btn btn-success w-100"><i class="fas fa-check-circle"></i> Register</button>
                        </form>
                        <div class="auth-footer">Already a member? <a data-page="login">Login here</a></div>
                    </div>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        DOM.membersNav.style.display = 'none';
        DOM.mobileMembersNav.style.display = 'none';

        const roleOptions = document.querySelectorAll('.role-option');
        const regRoleInput = document.getElementById('regRole');
        roleOptions.forEach(opt => {
            opt.addEventListener('click', function() {
                roleOptions.forEach(o => {
                    o.classList.remove('selected');
                    o.style.borderColor = '#e8f0e8';
                    o.style.background = 'transparent';
                });
                this.classList.add('selected');
                this.style.borderColor = '#2e7d32';
                this.style.background = 'rgba(46, 125, 50, 0.06)';
                regRoleInput.value = this.dataset.role;
            });
        });

        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const role = document.getElementById('regRole').value;
            handleRegister(name, email, phone, password, role);
        });
    }

    // ===== DASHBOARD RENDERER =====
    function renderDashboard() {
        const isAdmin = currentUser && currentUser.role === 'admin';
        const role = currentUser ? currentUser.role : 'member';

        const totalSavings = mockData.transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
        const totalWithdrawals = mockData.transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
        const totalLoans = mockData.loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.amount, 0);
        const totalInvestments = mockData.investments.reduce((sum, i) => sum + i.amount, 0);
        const pendingLoans = mockData.loans.filter(l => l.status === 'pending').length;
        const activeMembers = mockData.members.filter(m => m.status === 'online').length;
        const totalMembers = mockData.members.length;

        const html = `
            <div class="container">
                <div class="dash-header">
                    <div class="user-info">
                        <div class="avatar"><i class="fas fa-user"></i></div>
                        <div>
                            <strong style="font-size: 1.1rem;">${currentUser ? currentUser.name : 'Member'}</strong>
                            <span class="badge ${isAdmin ? 'admin' : 'member'}" style="margin-left: 8px;">${isAdmin ? 'Chama Admin' : 'Member'}</span>
                            <div style="font-size: 0.8rem; color: #4a6a4a;">Active · Last login: Today</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <span class="badge success"><i class="fas fa-circle" style="color: #4ade80; font-size: 0.5rem; margin-right: 4px;"></i> Online</span>
                        <a href="#" class="btn btn-sm btn-secondary" id="dashLogoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="icon green"><i class="fas fa-piggy-bank"></i></div>
                        <div class="info">
                            <h3>${formatCurrency(totalSavings)}</h3>
                            <p>Total Savings</p>
                            <div class="trend up"><i class="fas fa-arrow-up"></i> 12.5% this month</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon yellow"><i class="fas fa-hand-holding-usd"></i></div>
                        <div class="info">
                            <h3>${formatCurrency(totalLoans)}</h3>
                            <p>Active Loans</p>
                            <div class="trend up"><i class="fas fa-arrow-up"></i> 8.3% this month</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon blue"><i class="fas fa-chart-line"></i></div>
                        <div class="info">
                            <h3>${formatCurrency(totalInvestments)}</h3>
                            <p>Total Investments</p>
                            <div class="trend up"><i class="fas fa-arrow-up"></i> 15.2% this month</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon purple"><i class="fas fa-users"></i></div>
                        <div class="info">
                            <h3>${totalMembers}</h3>
                            <p>Active Members</p>
                            <div class="trend up"><i class="fas fa-arrow-up"></i> ${activeMembers} online now</div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-main">
                        <div class="card">
                            <div class="card-header">
                                <h3><i class="fas fa-bolt" style="color: #2e7d32;"></i> Quick Actions</h3>
                            </div>
                            <div class="quick-actions-grid">
                                <div class="quick-action-btn" id="quickContribute">
                                    <i class="fas fa-plus-circle"></i>
                                    <span>Contribute</span>
                                </div>
                                <div class="quick-action-btn" id="quickLoan">
                                    <i class="fas fa-hand-holding-usd"></i>
                                    <span>Apply Loan</span>
                                </div>
                                <div class="quick-action-btn" id="quickInvest">
                                    <i class="fas fa-chart-pie"></i>
                                    <span>Invest</span>
                                </div>
                                <div class="quick-action-btn" id="quickWelfare">
                                    <i class="fas fa-heart"></i>
                                    <span>Welfare Request</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h3><i class="fas fa-clock" style="color: #2e7d32;"></i> Recent Activity</h3>
                            </div>
                            <div class="activity-list">
                                ${mockData.transactions.slice(0, 5).map(t => `
                                    <div class="activity-item">
                                        <div class="icon ${t.type}">
                                            <i class="fas fa-${t.type === 'deposit' ? 'arrow-down' : t.type === 'withdraw' ? 'arrow-up' : t.type === 'loan' ? 'hand-holding-usd' : 'chart-line'}"></i>
                                        </div>
                                        <div class="details">
                                            <h4>${t.description}</h4>
                                            <p>${formatDate(t.date)} · ${t.status}</p>
                                        </div>
                                        <div class="amount ${t.type === 'deposit' || t.type === 'loan' ? 'positive' : 'negative'}">
                                            ${t.type === 'deposit' || t.type === 'loan' ? '+' : '-'} ${formatCurrency(t.amount)}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-sidebar">
                        ${isAdmin ? `
                        <div class="widget">
                            <div class="widget-title"><i class="fas fa-users" style="color: #2e7d32;"></i> Member Stats</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div style="background: #f5faf5; padding: 12px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 1.4rem; font-weight: 700;">${mockData.members.filter(m => m.status === 'online').length}</div>
                                    <div style="font-size: 0.75rem; color: #4a6a4a;">Online</div>
                                </div>
                                <div style="background: #f5faf5; padding: 12px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 1.4rem; font-weight: 700;">${mockData.members.filter(m => m.role === 'pending').length}</div>
                                    <div style="font-size: 0.75rem; color: #4a6a4a;">Pending</div>
                                </div>
                                <div style="background: #f5faf5; padding: 12px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 1.4rem; font-weight: 700;">${mockData.loans.filter(l => l.status === 'active').length}</div>
                                    <div style="font-size: 0.75rem; color: #4a6a4a;">Active Loans</div>
                                </div>
                                <div style="background: #f5faf5; padding: 12px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 1.4rem; font-weight: 700;">${mockData.loans.filter(l => l.status === 'pending').length}</div>
                                    <div style="font-size: 0.75rem; color: #4a6a4a;">Pending Loans</div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <div class="widget">
                            <div class="widget-title"><i class="fas fa-calendar-alt" style="color: #2e7d32;"></i> Upcoming Events</div>
                            <ul class="upcoming-events">
                                ${mockData.events.map(e => `
                                    <li>
                                        <div class="event-date">${formatDate(e.date)}</div>
                                        <div class="event-desc">${e.desc}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="widget">
                            <div class="widget-title"><i class="fas fa-chart-simple" style="color: #2e7d32;"></i> Quick Stats</div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: #4a6a4a;">Total Deposits</span>
                                    <span style="font-weight: 600;">${formatCurrency(totalSavings)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: #4a6a4a;">Total Withdrawals</span>
                                    <span style="font-weight: 600;">${formatCurrency(totalWithdrawals)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: #4a6a4a;">Pending Loans</span>
                                    <span style="font-weight: 600;">${pendingLoans}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.06);">
                                    <span style="color: #4a6a4a;">Total Members</span>
                                    <span style="font-weight: 600;">${totalMembers}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        bindDashboardEvents();
        DOM.membersNav.style.display = isAdmin ? 'inline-block' : 'none';
        DOM.mobileMembersNav.style.display = isAdmin ? 'block' : 'none';
    }

    function renderMembers() {
        if (!currentUser || currentUser.role !== 'admin') {
            navigateTo('dashboard');
            return;
        }

        const html = `
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 1.8rem;"><i class="fas fa-users-cog" style="color: #2e7d32;"></i> Member Management</h2>
                        <p style="color: #4a6a4a;">Manage all members and their roles</p>
                    </div>
                    <button class="btn btn-primary" id="addMemberBtn"><i class="fas fa-user-plus"></i> Add Member</button>
                </div>

                <div class="card">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mockData.members.map(m => `
                                    <tr>
                                        <td><strong>${m.name}</strong></td>
                                        <td>${m.email}</td>
                                        <td><span class="badge ${m.role === 'admin' ? 'admin' : 'member'}">${m.role === 'admin' ? 'Admin' : m.role === 'pending' ? 'Pending' : 'Member'}</span></td>
                                        <td>
                                            <span class="status-dot ${m.status}" style="width: 8px; height: 8px; border-radius: 50%; display: inline-block; background: ${m.status === 'online' ? '#43a047' : m.status === 'pending' ? '#f9a825' : '#c62828'};"></span>
                                            ${m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                                        </td>
                                        <td>${formatDate(m.joined)}</td>
                                        <td>
                                            <button class="btn btn-sm btn-secondary" onclick="window.viewMember(${m.id})"><i class="fas fa-eye"></i></button>
                                            ${m.role !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="window.removeMember(${m.id})"><i class="fas fa-trash"></i></button>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        DOM.app.innerHTML = html;
        bindPageNavigation();
        bindMemberEvents();
        DOM.membersNav.style.display = 'inline-block';
        DOM.mobileMembersNav.style.display = 'block';
    }

    // ===== AUTHENTICATION =====

    function handleLogin(email, password) {
        if (!email || !password) {
            showToast('Please fill all fields', 'error');
            return false;
        }

        const stored = localStorage.getItem('akl_user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                if (user.email === email) {
                    currentUser = {
                        name: user.name,
                        email: user.email,
                        role: user.role || 'member'
                    };
                    localStorage.setItem('akl_user', JSON.stringify(currentUser));
                    showToast('Welcome back, ' + currentUser.name + '!', 'success');
                    updateUIForUser();
                    return true;
                }
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }

        let role = 'member';
        if (email.toLowerCase().includes('admin')) {
            role = 'admin';
        }
        const name = email.split('@')[0];
        const newUser = { name, email, role };
        localStorage.setItem('akl_user', JSON.stringify(newUser));
        currentUser = newUser;
        showToast('Welcome ' + name + '!', 'success');
        updateUIForUser();
        return true;
    }

    function handleRegister(name, email, phone, password, role) {
        if (!name || !email || !phone || !password) {
            showToast('Please fill all fields', 'error');
            return false;
        }
        const user = { name, email, phone, role: role || 'member' };
        localStorage.setItem('akl_user', JSON.stringify(user));
        currentUser = user;
        showToast('Account created as ' + (role === 'admin' ? 'Chama Admin' : 'Member') + '!', 'success');
        updateUIForUser();
        return true;
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('akl_user');
        showToast('Logged out successfully', '');
        updateUIForUser();
        navigateTo('home');
        toggleMobileSidebar(false);
    }

    function updateUIForUser() {
        if (currentUser) {
            isLoggedIn = true;
            
            // Update header user badge
            DOM.userBadge.style.display = 'flex';
            DOM.userNameDisplay.textContent = currentUser.name;

            // Update mobile sidebar user
            DOM.mobileSidebarUser.style.display = 'flex';
            DOM.mobileUserName.textContent = currentUser.name;

            const role = currentUser.role || 'member';
            const roleLabel = role === 'admin' ? 'Chama Admin' : 'Member';
            const badgeClass = role === 'admin' ? 'admin' : 'member';
            
            DOM.roleBadge.textContent = roleLabel;
            DOM.roleBadge.className = 'badge ' + badgeClass;
            DOM.mobileUserRole.textContent = roleLabel;
            DOM.mobileUserRole.className = 'badge ' + badgeClass;

            // Show/hide nav buttons
            DOM.loginNavBtn.style.display = 'none';
            DOM.registerNavBtn.style.display = 'none';
            DOM.logoutNavBtn.style.display = 'inline-flex';
            DOM.mobileLoginNav.style.display = 'none';
            DOM.mobileRegisterNav.style.display = 'none';
            DOM.mobileLogoutNav.style.display = 'flex';

            toggleHeader(false);
            navigateTo('dashboard');
        } else {
            isLoggedIn = false;
            
            DOM.userBadge.style.display = 'none';
            DOM.mobileSidebarUser.style.display = 'none';
            
            DOM.loginNavBtn.style.display = 'inline-flex';
            DOM.registerNavBtn.style.display = 'inline-flex';
            DOM.logoutNavBtn.style.display = 'none';
            DOM.mobileLoginNav.style.display = 'flex';
            DOM.mobileRegisterNav.style.display = 'flex';
            DOM.mobileLogoutNav.style.display = 'none';

            toggleHeader(true);
            navigateTo('home');
        }
    }

    // ===== NAVIGATION =====

    function navigateTo(page, data) {
        if (page === 'dashboard' && !currentUser) {
            showToast('Please login first', 'error');
            navigateTo('login');
            return;
        }

        if ((page === 'login' || page === 'register') && currentUser) {
            showToast('You are already logged in', '');
            navigateTo('dashboard');
            return;
        }

        // Update header nav active state
        document.querySelectorAll('.header-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.page === page);
        });

        // Update mobile sidebar nav active state
        document.querySelectorAll('.mobile-sidebar-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.page === page);
        });

        switch (page) {
            case 'home':
                renderHome();
                break;
            case 'about':
                renderAbout();
                break;
            case 'features':
                renderFeatures();
                break;
            case 'services':
                renderServices();
                break;
            case 'testimonials':
                renderTestimonials();
                break;
            case 'login':
                renderLogin();
                break;
            case 'register':
                renderRegister();
                break;
            case 'dashboard':
                renderDashboard();
                break;
            case 'members':
                renderMembers();
                break;
            default:
                renderHome();
        }

        // Close mobile sidebar when navigating
        toggleMobileSidebar(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== BIND EVENTS =====

    function bindPageNavigation() {
        // Desktop nav links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) {
                    navigateTo(page);
                }
            });
        });

        // Footer nav links
        document.querySelectorAll('.footer a[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) {
                    navigateTo(page);
                }
            });
        });
    }

    function bindDashboardEvents() {
        const dashLogoutBtn = document.getElementById('dashLogoutBtn');
        if (dashLogoutBtn) {
            dashLogoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }

        const quickContribute = document.getElementById('quickContribute');
        if (quickContribute) {
            quickContribute.addEventListener('click', function() {
                showModal('Contribute', 'Enter contribution amount (KES):', 'Submit', function(value) {
                    if (value && !isNaN(value) && parseInt(value) > 0) {
                        showToast('Contribution of KES ' + value + ' submitted successfully!', 'success');
                    } else if (value !== null) {
                        showToast('Please enter a valid amount', 'error');
                    }
                }, 'Enter amount (KES)');
            });
        }

        const quickLoan = document.getElementById('quickLoan');
        if (quickLoan) {
            quickLoan.addEventListener('click', function() {
                showModal('Apply for Loan', 'Enter loan amount and purpose:', 'Apply', function(value) {
                    if (value && value.trim().length > 0) {
                        showToast('Loan application for "' + value + '" submitted for review.', 'success');
                    } else if (value !== null) {
                        showToast('Please enter loan details', 'error');
                    }
                }, 'Amount & purpose (e.g., 50000 Business)');
            });
        }

        const quickInvest = document.getElementById('quickInvest');
        if (quickInvest) {
            quickInvest.addEventListener('click', function() {
                showModal('New Investment', 'Enter investment amount and project name:', 'Invest', function(value) {
                    if (value && value.trim().length > 0) {
                        showToast('Investment of "' + value + '" recorded successfully!', 'success');
                    } else if (value !== null) {
                        showToast('Please enter investment details', 'error');
                    }
                }, 'Amount & Project (e.g., 50000 Real Estate)');
            });
        }

        const quickWelfare = document.getElementById('quickWelfare');
        if (quickWelfare) {
            quickWelfare.addEventListener('click', function() {
                showModal('Welfare Request', 'Enter amount and reason for welfare support:', 'Submit', function(value) {
                    if (value && value.trim().length > 0) {
                        showToast('Welfare request submitted for approval.', 'success');
                    } else if (value !== null) {
                        showToast('Please enter request details', 'error');
                    }
                }, 'Amount & Reason');
            });
        }
    }

    function bindMemberEvents() {
        const addMemberBtn = document.getElementById('addMemberBtn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', function() {
                showModal('Add Member', 'Enter new member details:', 'Add', function(value) {
                    if (value && value.trim().length > 0) {
                        showToast('Member added successfully!', 'success');
                    } else if (value !== null) {
                        showToast('Please enter member details', 'error');
                    }
                }, 'Name | Email | Phone | Role');
            });
        }

        window.viewMember = function(id) {
            showModal('Member Details', 'Viewing member profile...', 'Close', function() {});
        };

        window.removeMember = function(id) {
            showModal('Remove Member', 'Remove this member from the group?', 'Remove', function() {
                showToast('Member removed.', '');
            });
        };
    }

    // ===== RESTORE SESSION =====

    function restoreSession() {
        const stored = localStorage.getItem('akl_user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                currentUser = {
                    name: user.name,
                    email: user.email,
                    role: user.role || 'member'
                };
                updateUIForUser();
                return;
            } catch (e) {
                console.error('Error restoring session:', e);
                currentUser = null;
            }
        }
        updateUIForUser();
    }

    // ===== INITIALIZE =====

    function init() {
        // Header scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 20 && !DOM.header.classList.contains('hidden')) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
        });

        // Mobile toggle
        DOM.mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileSidebar(true);
        });

        // Mobile sidebar close
        DOM.mobileSidebarClose.addEventListener('click', function() {
            toggleMobileSidebar(false);
        });

        // Mobile overlay close
        DOM.mobileOverlay.addEventListener('click', function() {
            toggleMobileSidebar(false);
        });

        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                toggleMobileSidebar(false);
            }
        });

        // Brand home click
        DOM.brandHome.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                navigateTo('dashboard');
            } else {
                navigateTo('home');
            }
            toggleMobileSidebar(false);
        });

        // Login nav button
        DOM.loginNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                navigateTo('dashboard');
                return;
            }
            navigateTo('login');
            DOM.headerNav.classList.remove('open');
            toggleMobileSidebar(false);
        });

        // Register nav button
        DOM.registerNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                navigateTo('dashboard');
                return;
            }
            navigateTo('register');
            DOM.headerNav.classList.remove('open');
            toggleMobileSidebar(false);
        });

        // Logout nav button
        DOM.logoutNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
            toggleMobileSidebar(false);
        });

        // Mobile sidebar nav links
        DOM.mobileLoginNav.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                navigateTo('dashboard');
                return;
            }
            navigateTo('login');
            toggleMobileSidebar(false);
        });

        DOM.mobileRegisterNav.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                navigateTo('dashboard');
                return;
            }
            navigateTo('register');
            toggleMobileSidebar(false);
        });

        DOM.mobileLogoutNav.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
            toggleMobileSidebar(false);
        });

        // Mobile sidebar nav items
        document.querySelectorAll('.mobile-sidebar-nav a[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) {
                    navigateTo(page);
                }
                toggleMobileSidebar(false);
            });
        });

        window.showToast = showToast;
        window.navigateTo = navigateTo;

        // Footer service links
        document.getElementById('savingsLink').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Savings services details coming soon!', 'success');
        });
        document.getElementById('loansLink').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Loan services details coming soon!', 'success');
        });
        document.getElementById('investmentsLink').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Investment services details coming soon!', 'success');
        });
        document.getElementById('welfareLink').addEventListener('click', function(e) {
            e.preventDefault();
            showModal('Welfare Program', 'Our welfare program provides support during emergencies, medical needs, and celebrations. Members contribute monthly to the welfare fund.', 'Learn More', function() {
                showToast('Welfare details sent to your email.', 'success');
            });
        });

        // Social links
        document.querySelectorAll('.social-links a').forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platforms = ['Facebook', 'Twitter', 'Instagram', 'WhatsApp', 'LinkedIn'];
                showToast(platforms[index] + ' page coming soon!', 'success');
            });
        });

        restoreSession();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();