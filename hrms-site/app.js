/**
 * Core application state and bootstrapping.
 * UI-specific rendering methods live in app-ui.js.
 */
const App = {
    db: {
        users: [
            { id: 1001, name: 'Nadeem', email: 'admin@odoo.com', pass: '1234', role: 'admin', job: 'HR Director', salary: '₹1,80,000/mo' },
            { id: 1002, name: 'Ritisha', email: 'ritisha.a@odoo.com', pass: '1234', role: 'admin', job: 'Talent Acquisition Lead', salary: '₹1,40,000/mo' },
            { id: 1003, name: 'Soumyashree', email: 'soumyashree@odoo.com', pass: '1234', role: 'admin', job: 'HR Manager', salary: '₹1,50,000/mo' },
            { id: 1004, name: 'Avishek', email: 'avishek@odoo.com', pass: '1234', role: 'admin', job: 'Payroll Manager', salary: '₹1,55,000/mo' },
            { id: 2001, name: 'nikitaa', email: 'emp@odoo.com', pass: '1234', role: 'employee', job: 'Senior Frontend Developer', salary: '₹1,20,000/mo' },
            { id: 2002, name: 'Priya Sharma', email: 'priya.s@odoo.com', pass: '1234', role: 'employee', job: 'Lead UI/UX Designer', salary: '₹1,15,000/mo' },
            { id: 2003, name: 'Rahul Verma', email: 'rahul.v@odoo.com', pass: '1234', role: 'employee', job: 'DevOps Specialist', salary: '₹1,35,000/mo' },
            { id: 2004, name: 'Anita Desai', email: 'anita.d@odoo.com', pass: '1234', role: 'employee', job: 'QA Automation Lead', salary: '₹95,000/mo' },
            { id: 2005, name: 'Vikram Das', email: 'vikram.d@odoo.com', pass: '1234', role: 'employee', job: 'Backend Systems Engineer', salary: '₹1,25,000/mo' },
            { id: 2006, name: 'Rohan Banerjee', email: 'rohan.b@odoo.com', pass: '1234', role: 'employee', job: 'Data Analyst', salary: '₹90,000/mo' },
            { id: 2007, name: 'Sneha Paul', email: 'sneha.p@odoo.com', pass: '1234', role: 'employee', job: 'Product Manager', salary: '₹1,50,000/mo' },
            { id: 2008, name: 'Amit Roy', email: 'amit.r@odoo.com', pass: '1234', role: 'employee', job: 'Electronics Integration Intern', salary: '₹35,000/mo' }
        ],
        attendance: [
            { date: '01/07/2026', userId: 2001, status: 'Present' },
            { date: '01/07/2026', userId: 2002, status: 'Present' },
            { date: '01/07/2026', userId: 2003, status: 'Present' },
            { date: '01/07/2026', userId: 2004, status: 'Leave' },
            { date: '01/07/2026', userId: 2005, status: 'Present' },
            { date: '01/07/2026', userId: 2006, status: 'Present' },
            { date: '02/07/2026', userId: 2001, status: 'Present' },
            { date: '02/07/2026', userId: 2002, status: 'Present' },
            { date: '02/07/2026', userId: 2003, status: 'Half-day' },
            { date: '02/07/2026', userId: 2004, status: 'Leave' },
            { date: '02/07/2026', userId: 2005, status: 'Present' },
            { date: '02/07/2026', userId: 2006, status: 'Present' },
            { date: '03/07/2026', userId: 2001, status: 'Present' },
            { date: '03/07/2026', userId: 2002, status: 'Present' },
            { date: '03/07/2026', userId: 2003, status: 'Present' },
            { date: '03/07/2026', userId: 2004, status: 'Present' },
            { date: '03/07/2026', userId: 2005, status: 'Absent' },
            { date: '03/07/2026', userId: 2006, status: 'Present' },
            { date: new Date().toLocaleDateString(), userId: 2001, status: 'Present' },
            { date: new Date().toLocaleDateString(), userId: 2002, status: 'Present' },
            { date: new Date().toLocaleDateString(), userId: 2003, status: 'Present' },
            { date: new Date().toLocaleDateString(), userId: 2006, status: 'Present' },
            { date: new Date().toLocaleDateString(), userId: 2007, status: 'Present' }
        ],
        leaves: [
            { id: 5001, userId: 2004, userName: 'Anita Desai', type: 'Sick Leave', start: '2026-07-01', end: '2026-07-02', status: 'Approved' },
            { id: 5002, userId: 2003, userName: 'Rahul Verma', type: 'Paid Leave', start: '2026-06-15', end: '2026-06-18', status: 'Approved' },
            { id: 5003, userId: 2005, userName: 'Vikram Das', type: 'Unpaid Leave', start: '2026-06-28', end: '2026-06-30', status: 'Rejected' },
            { id: 5004, userId: 2002, userName: 'Priya Sharma', type: 'Paid Leave', start: '2026-07-15', end: '2026-07-22', status: 'Pending' },
            { id: 5005, userId: 2006, userName: 'Rohan Banerjee', type: 'Sick Leave', start: '2026-07-10', end: '2026-07-11', status: 'Pending' },
            { id: 5006, userId: 2001, userName: 'nikitaa', type: 'Paid Leave', start: '2026-08-12', end: '2026-08-19', status: 'Pending' },
            { id: 5007, userId: 2008, userName: 'Amit Roy', type: 'Unpaid Leave', start: '2026-07-25', end: '2026-07-28', status: 'Pending' }
        ],
        performances: [
            { id: 6001, userId: 2001, reviewer: 'Nadeem', rating: 4.5, feedback: 'Excellent coding skills and team collaboration', date: '2026-06-30', period: 'Q2 2026' },
            { id: 6002, userId: 2002, reviewer: 'Nadeem', rating: 4.8, feedback: 'Outstanding UI/UX design contributions. Very creative.', date: '2026-06-30', period: 'Q2 2026' },
            { id: 6003, userId: 2003, reviewer: 'Ritisha', rating: 4.3, feedback: 'Good technical expertise in DevOps. Can improve communication.', date: '2026-06-30', period: 'Q2 2026' }
        ],
        salarySlips: [
            { id: 7001, userId: 2001, month: 'May 2026', basic: 100000, hra: 20000, da: 10000, allowances: 5000, tax: 15000, deductions: 10000, netPay: 110000, status: 'Generated' },
            { id: 7002, userId: 2001, month: 'June 2026', basic: 100000, hra: 20000, da: 10000, allowances: 6000, tax: 16000, deductions: 10000, netPay: 116000, status: 'Generated' },
            { id: 7003, userId: 2001, month: 'July 2026', basic: 100000, hra: 20000, da: 10000, allowances: 6000, tax: 16000, deductions: 10000, netPay: 116000, status: 'Pending' },
            { id: 7010, userId: 2002, month: 'June 2026', basic: 95000, hra: 19000, da: 9500, allowances: 4000, tax: 14000, deductions: 8000, netPay: 111500, status: 'Generated' },
            { id: 7011, userId: 2003, month: 'June 2026', basic: 120000, hra: 24000, da: 12000, allowances: 7000, tax: 20000, deductions: 12000, netPay: 113000, status: 'Generated' },
            { id: 7012, userId: 2004, month: 'June 2026', basic: 95000, hra: 18000, da: 9000, allowances: 3000, tax: 12000, deductions: 8000, netPay: 103000, status: 'Generated' },
            { id: 7013, userId: 2005, month: 'June 2026', basic: 125000, hra: 25000, da: 12500, allowances: 8000, tax: 22000, deductions: 13000, netPay: 110500, status: 'Generated' }
        ],
        holidays: [
            { id: 8001, date: '2026-07-15', name: 'Muharram', type: 'National Holiday' },
            { id: 8002, date: '2026-08-15', name: 'Independence Day', type: 'National Holiday' },
            { id: 8003, date: '2026-08-26', name: 'Janmashtami', type: 'National Holiday' },
            { id: 8004, date: '2026-09-16', name: 'Milad-un-Nabi', type: 'National Holiday' },
            { id: 8005, date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National Holiday' }
        ],
        shifts: [
            { id: 9001, userId: 2001, shiftType: 'General - 9:00 AM to 6:00 PM', department: 'Engineering', startDate: '2026-01-01' },
            { id: 9002, userId: 2002, shiftType: 'General - 9:00 AM to 6:00 PM', department: 'Design', startDate: '2026-01-01' },
            { id: 9003, userId: 2003, shiftType: 'Flexible - 10:00 AM to 7:00 PM', department: 'Engineering', startDate: '2026-01-01' }
        ],
        expenses: [
            { id: 10001, userId: 2001, amount: 2500, category: 'Travel', description: 'Client Meeting Travel - Delhi', date: '2026-07-01', status: 'Approved', receipt: 'Receipt attached' },
            { id: 10002, userId: 2002, amount: 1500, category: 'Meals', description: 'Team Lunch Meeting', date: '2026-07-02', status: 'Pending', receipt: 'Pending' },
            { id: 10003, userId: 2003, amount: 3200, category: 'Training', description: 'DevOps Certification Course', date: '2026-07-03', status: 'Pending', receipt: 'Receipt attached' },
            { id: 10004, userId: 2004, amount: 4200, category: 'Travel', description: 'Airport transfer for interviewee', date: '2026-06-28', status: 'Approved', receipt: 'Receipt attached' },
            { id: 10005, userId: 2005, amount: 800, category: 'Meals', description: 'Client snacks', date: '2026-06-30', status: 'Rejected', receipt: 'Receipt attached' },
            { id: 10006, userId: 2006, amount: 15000, category: 'Hardware', description: 'External SSD for backup', date: '2026-06-20', status: 'Approved', receipt: 'Receipt attached' },
            { id: 10007, userId: 2007, amount: 6000, category: 'Training', description: 'Product Management workshop fee', date: '2026-05-15', status: 'Pending', receipt: 'Receipt attached' }
        ],
        documents: [
            { id: 11001, userId: 2001, docName: 'Offer Letter', docType: 'Official', uploadDate: '2022-01-15', status: 'Active' },
            { id: 11002, userId: 2001, docName: 'Appointment Letter', docType: 'Official', uploadDate: '2022-02-01', status: 'Active' },
            { id: 11003, userId: 2002, docName: 'Employment Contract', docType: 'Legal', uploadDate: '2021-06-10', status: 'Active' }
        ]
    },
    currentUser: null,

    init() {
        // Allow forced reset via URL: open index.html?resetdb=1 to clear stored demo data
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get('resetdb') === '1') {
            localStorage.removeItem('hrms_db');
            localStorage.removeItem('hrms_user');
        }

        const storedDb = localStorage.getItem('hrms_db');
        if (storedDb) {
            try {
                const parsed = JSON.parse(storedDb);
                // Merge stored DB with default structure to ensure new arrays/fields exist
                for (const key of Object.keys(this.db)) {
                    if (!parsed.hasOwnProperty(key) || parsed[key] === null) parsed[key] = this.db[key];
                }
                this.db = parsed;
            } catch (e) {
                console.warn('Failed to parse stored hrms_db, using defaults.');
            }
        }

        const adminProfiles = {
            'admin@odoo.com': { name: 'Nadeem', role: 'admin', job: 'HR Director', salary: '₹1,80,000/mo' },
            'ritisha.a@odoo.com': { name: 'Ritisha', role: 'admin', job: 'Talent Acquisition Lead', salary: '₹1,40,000/mo' },
            'soumyashree@odoo.com': { name: 'Soumyashree', role: 'admin', job: 'HR Manager', salary: '₹1,50,000/mo' },
            'avishek@odoo.com': { name: 'Avishek', role: 'admin', job: 'Payroll Manager', salary: '₹1,55,000/mo' }
        };

        this.db.users = Array.isArray(this.db.users) ? this.db.users : [];
        this.db.users.forEach(user => {
            const profile = adminProfiles[user.email];
            if (profile) {
                user.name = profile.name;
                user.role = profile.role;
                user.job = profile.job;
                user.salary = profile.salary;
            }
        });

        const storedUser = localStorage.getItem('hrms_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            const freshUser = this.db.users.find(u => u.email === this.currentUser.email);
            if (freshUser) {
                this.currentUser = { ...freshUser };
                localStorage.setItem('hrms_user', JSON.stringify(this.currentUser));
            }
            this.navigate('dashboard');
        } else {
            this.renderLogin();
        }

        this.saveDb();
    },

    // Console helper: call `App.resetDb()` in browser console to clear stored demo data and reload.
    resetDb() {
        localStorage.removeItem('hrms_db');
        localStorage.removeItem('hrms_user');
        location.reload();
    },

    saveDb() {
        localStorage.setItem('hrms_db', JSON.stringify(this.db));
    },

    navigate(view) {
        const content = document.getElementById('main-content');
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('user-greeting').innerText = `Hello, ${this.currentUser.name} (${this.currentUser.role})`;
        content.innerHTML = '';

        switch (view) {
            case 'dashboard':
                this.currentUser.role === 'admin' ? this.renderAdminDashboard(content) : this.renderEmployeeDashboard(content);
                break;
            case 'leave_apply':
                this.renderLeaveApplication(content);
                break;
            case 'profile':
                this.renderProfile(content);
                break;
            case 'attendance_log':
                this.renderAttendanceLog(content);
                break;
            case 'salary_slip':
                this.renderSalarySlip(content);
                break;
            case 'performance':
                this.renderPerformanceReview(content);
                break;
            case 'expenses':
                this.renderExpenses(content);
                break;
            case 'documents':
                this.renderDocuments(content);
                break;
            case 'employee_analytics':
                this.renderEmployeeAnalytics(content);
                break;
            case 'holidays':
                this.renderHolidayCalendar(content);
                break;
            case 'shifts':
                this.renderShiftManagement(content);
                break;
        }
    }
};

window.onload = () => App.init();
