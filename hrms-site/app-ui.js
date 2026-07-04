Object.assign(App, {
    renderLogin(isSignup = false) {
        document.getElementById('navbar').classList.add('hidden');
        const content = document.getElementById('main-content');

        content.innerHTML = `
            <div class="auth-container">
                <h2>${isSignup ? 'Sign Up for HRMS' : 'Sign In to HRMS'}</h2>
                ${isSignup ? `
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="auth-name" placeholder="nikitaa">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="auth-role">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin / HR</option>
                        </select>
                    </div>
                ` : ''}
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="auth-email" placeholder="email@odoo.com" value="${!isSignup ? 'emp@odoo.com' : ''}">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="auth-pass" placeholder="Enter password (demo: 1234)" value="${!isSignup ? '1234' : ''}">
                </div>
                <button class="btn btn-primary" style="width: 100%" onclick="App.${isSignup ? 'handleSignup()' : 'handleLogin()'}">
                    ${isSignup ? 'Register' : 'Login'}
                </button>
                <div class="auth-switch" onclick="App.renderLogin(${!isSignup})">
                    ${isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </div>
            </div>
        `;
    },

    handleLogin() {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-pass').value;
        const user = this.db.users.find(u => u.email === email && u.pass === pass);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('hrms_user', JSON.stringify(user));
            this.navigate('dashboard');
        } else {
            alert('Invalid Credentials. Please try again.');
        }
    },

    handleSignup() {
        const name = document.getElementById('auth-name').value;
        const role = document.getElementById('auth-role').value;
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-pass').value;

        if (!name || !email || !pass) return alert('All fields are required.');

        const newUser = { id: Date.now(), name, email, pass, role, job: 'New Hire', salary: 'TBD' };
        this.db.users.push(newUser);
        this.saveDb();
        alert('Registration successful! Please login.');
        this.renderLogin();
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('hrms_user');
        this.renderLogin();
    },

    renderEmployeeDashboard(container) {
        const todayRecord = this.db.attendance.find(a => a.userId === this.currentUser.id && a.date === new Date().toLocaleDateString());
        const isCheckedIn = !!todayRecord;

        container.innerHTML = `
            <div class="section-header">
                <h2>Employee Dashboard</h2>
                <button class="btn ${isCheckedIn ? 'btn-outline' : 'btn-primary'}" onclick="App.toggleAttendance()" ${isCheckedIn ? 'disabled' : ''}>
                    ${isCheckedIn ? 'Checked In Today' : 'Check In'}
                </button>
            </div>
            <div class="grid-cards">
                <div class="card" onclick="App.navigate('profile')">
                    <h3>👤 My Profile</h3>
                    <p>View personal details, job role, and read-only salary structure.</p>
                </div>
                <div class="card" onclick="App.navigate('leave_apply')">
                    <h3>📅 Apply Leave</h3>
                    <p>Request paid, sick, or unpaid time-off and track approval status.</p>
                </div>
                <div class="card" onclick="App.navigate('attendance_log')">
                    <h3>⏱️ Attendance Log</h3>
                    <p>Daily and weekly views of your check-ins.</p>
                </div>
                <div class="card" onclick="App.navigate('salary_slip')">
                    <h3>💰 Salary Slips</h3>
                    <p>View payroll, salary breakup, and deductions monthly.</p>
                </div>
                <div class="card" onclick="App.navigate('performance')">
                    <h3>⭐ Performance Reviews</h3>
                    <p>Track performance feedback and ratings from managers.</p>
                </div>
                <div class="card" onclick="App.navigate('expenses')">
                    <h3>🧾 Expenses & Claims</h3>
                    <p>Submit and track reimbursement requests.</p>
                </div>
                <div class="card" onclick="App.navigate('documents')">
                    <h3>📄 My Documents</h3>
                    <p>Access offer letters, contracts, and official documents.</p>
                </div>
                <div class="card" onclick="App.navigate('shifts')">
                    <h3>🕐 Shift Schedule</h3>
                    <p>View your work shift and department assignments.</p>
                </div>
                <div class="card" onclick="App.navigate('holidays')">
                    <h3>🎉 Holiday Calendar</h3>
                    <p>Check all company holidays and special days.</p>
                </div>
            </div>
            
            <h3 style="margin-top: 3rem; color: var(--odoo-primary);">My Recent Leave Requests</h3>
            <table class="data-table">
                <thead><tr><th>Type</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead>
                <tbody>
                    ${this.db.leaves.filter(l => l.userId === this.currentUser.id).map(l => `
                        <tr>
                            <td>${l.type}</td>
                            <td>${l.start}</td>
                            <td>${l.end}</td>
                            <td><span class="badge ${l.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${l.status}</span></td>
                        </tr>
                    `).join('') || '<tr><td colspan="4">No requests found.</td></tr>'}
                </tbody>
            </table>
        `;
    },

    renderProfile(container) {
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>My Profile</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" value="${this.currentUser.name}" disabled>
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${this.currentUser.job}" disabled>
                </div>
                <div class="form-group">
                    <label>Salary Structure (Read-Only)</label>
                    <input type="text" value="${this.currentUser.salary}" disabled>
                </div>
            </div>
        `;
    },

    renderAttendanceLog(container) {
        const userAttendance = this.db.attendance.filter(a => a.userId === this.currentUser.id);
        const totalPresent = userAttendance.length;
        const today = new Date().toLocaleDateString();
        const isCheckedInToday = userAttendance.some(a => a.date === today);

        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Attendance Log</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: var(--radius); text-align: center;">
                        <h3 style="color: var(--odoo-primary); font-size: 1.5rem;">${totalPresent}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Total Check-ins</p>
                    </div>
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: var(--radius); text-align: center;">
                        <h3 style="color: var(--success); font-size: 1.5rem;">${isCheckedInToday ? '✓' : '—'}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Today's Status</p>
                    </div>
                </div>

                <h3 style="color: var(--odoo-primary); margin-bottom: 1rem;">Check-in History</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userAttendance.length > 0 ? userAttendance.map(a => `
                            <tr>
                                <td>${a.date}</td>
                                <td><span class="badge badge-success">${a.status}</span></td>
                                <td>
                                    <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.deleteAttendance('${a.date}', ${a.userId})">Remove</button>
                                </td>
                            </tr>
                        `).join('') : '<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No attendance records found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    deleteAttendance(date, userId) {
        if (confirm('Are you sure you want to remove this attendance record?')) {
            this.db.attendance = this.db.attendance.filter(a => !(a.date === date && a.userId === userId));
            this.saveDb();
            this.navigate('attendance_log');
        }
    },

    renderLeaveApplication(container) {
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Apply for Leave</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <div class="form-group">
                    <label>Leave Type</label>
                    <select id="leave-type">
                        <option>Paid Leave</option>
                        <option>Sick Leave</option>
                        <option>Unpaid Leave</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" id="leave-start">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="date" id="leave-end">
                </div>
                <div class="form-group">
                    <label>Remarks</label>
                    <input type="text" id="leave-remarks" placeholder="Reason for leave...">
                </div>
                <button class="btn btn-primary" onclick="App.submitLeave()">Submit Request</button>
            </div>
        `;
    },

    submitLeave() {
        const type = document.getElementById('leave-type').value;
        const start = document.getElementById('leave-start').value;
        const end = document.getElementById('leave-end').value;

        if (!start || !end) return alert('Please select dates.');

        this.db.leaves.push({
            id: Date.now(),
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            type, start, end, status: 'Pending'
        });
        this.saveDb();
        alert('Leave request submitted successfully.');
        this.navigate('dashboard');
    },

    toggleAttendance() {
        const today = new Date().toLocaleDateString();
        this.db.attendance.push({ date: today, userId: this.currentUser.id, status: 'Present' });
        this.saveDb();
        this.navigate('dashboard');
    },

    renderAdminDashboard(container) {
        const pendingLeaves = this.db.leaves.filter(l => l.status === 'Pending');

        container.innerHTML = `
            <div class="section-header">
                <h2>Admin & HR Dashboard</h2>
                <button class="btn btn-primary" onclick="App.navigate('employee_analytics')">📊 View Analytics</button>
            </div>
            
            <h3 style="margin-top: 1rem; color: var(--odoo-primary);">Leave Approvals (${pendingLeaves.length})</h3>
            <table class="data-table">
                <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Action</th></tr></thead>
                <tbody>
                    ${pendingLeaves.map(l => `
                        <tr>
                            <td>${l.userName}</td>
                            <td>${l.type}</td>
                            <td>${l.start} to ${l.end}</td>
                            <td>
                                <button class="btn btn-primary" style="padding: 5px 10px;" onclick="App.processLeave(${l.id}, 'Approved')">Approve</button>
                                <button class="btn btn-outline" style="padding: 5px 10px; border-color: var(--danger); color: var(--danger)" onclick="App.processLeave(${l.id}, 'Rejected')">Reject</button>
                            </td>
                        </tr>
                    `).join('') || '<tr><td colspan="4">No pending leave requests.</td></tr>'}
                </tbody>
            </table>

            <h3 style="margin-top: 3rem; color: var(--odoo-primary);">Employee Directory & Payroll Control</h3>
            <table class="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Salary Base</th></tr></thead>
                <tbody>
                    ${this.db.users.filter(u => u.role === 'employee').map(u => `
                        <tr>
                            <td>#${u.id}</td>
                            <td>${u.name}</td>
                            <td>${u.job}</td>
                            <td>${u.salary}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    processLeave(id, status) {
        const req = this.db.leaves.find(l => l.id === id);
        if (req) {
            req.status = status;
            this.saveDb();
            this.navigate('dashboard');
        }
    },

    renderSalarySlip(container) {
        const isAdmin = this.currentUser && this.currentUser.role === 'admin';
        const userSlips = isAdmin ? this.db.salarySlips : this.db.salarySlips.filter(s => s.userId === this.currentUser.id);
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Salary Slips</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${isAdmin ? '<th>Employee</th>' : ''}
                            <th>Month</th><th>Basic</th><th>HRA</th><th>DA</th><th>Allowances</th><th>Tax</th><th>Deductions</th><th>Net Pay</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userSlips.map(s => `
                            <tr>
                                ${isAdmin ? `<td>${(this.db.users.find(u => u.id === s.userId) || {}).name || 'User #' + s.userId}</td>` : ''}
                                <td>${s.month}</td>
                                <td>₹${s.basic}</td>
                                <td>₹${s.hra}</td>
                                <td>₹${s.da}</td>
                                <td>₹${s.allowances || 0}</td>
                                <td>₹${s.tax || 0}</td>
                                <td>₹${s.deductions || 0}</td>
                                <td style="font-weight: bold;">₹${s.netPay}</td>
                                <td><span class="badge badge-success">${s.status}</span></td>
                            </tr>
                        `).join('') || '<tr><td colspan="10" style="text-align: center;">No salary slips available.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderPerformanceReview(container) {
        const userReviews = this.db.performances.filter(p => p.userId === this.currentUser.id);
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Performance Reviews</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                ${userReviews.length > 0 ? userReviews.map(r => `
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="color: var(--odoo-primary); margin-bottom: 0.5rem;">${r.period}</h4>
                                <p style="color: var(--text-muted); font-size: 0.9rem;">Reviewed by: ${r.reviewer}</p>
                            </div>
                            <div style="font-size: 1.5rem; color: var(--success);">★ ${r.rating}/5</div>
                        </div>
                        <p style="margin-top: 1rem; line-height: 1.6;">${r.feedback}</p>
                    </div>
                `).join('') : '<p style="text-align: center; color: var(--text-muted);">No performance reviews yet.</p>'}
            </div>
        `;
    },

    renderExpenses(container) {
        const isAdmin = this.currentUser && this.currentUser.role === 'admin';
        const userExpenses = isAdmin ? this.db.expenses : this.db.expenses.filter(e => e.userId === this.currentUser.id);
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Expense Claims & Reimbursements</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <button class="btn btn-primary" style="margin-bottom: 1.5rem;" onclick="App.renderNewExpenseForm()">+ New Expense Claim</button>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${isAdmin ? '<th>Employee</th>' : ''}
                            <th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userExpenses.map(e => `
                            <tr>
                                ${isAdmin ? `<td>${(this.db.users.find(u => u.id === e.userId) || {}).name || 'User #' + e.userId}</td>` : ''}
                                <td>${e.category}</td>
                                <td>${e.description}</td>
                                <td>₹${e.amount}</td>
                                <td>${e.date}</td>
                                <td><span class="badge ${e.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${e.status}</span></td>
                            </tr>
                        `).join('') || '<tr><td colspan="6" style="text-align: center;">No expense claims found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderNewExpenseForm() {
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>New Expense Claim</h2>
                    <button class="btn btn-outline" onclick="App.navigate('expenses')">Cancel</button>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="expense-category">
                        <option>Travel</option>
                        <option>Meals</option>
                        <option>Training</option>
                        <option>Equipment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" id="expense-desc" placeholder="Expense details...">
                </div>
                <div class="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="expense-amount" placeholder="Enter amount">
                </div>
                <button class="btn btn-primary" onclick="App.submitExpense()">Submit Claim</button>
            </div>
        `;
    },

    submitExpense() {
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-desc').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        if (!description || !amount) return alert('All fields required.');
        this.db.expenses.push({
            id: Date.now(), userId: this.currentUser.id, amount, category, description,
            date: new Date().toLocaleDateString(), status: 'Pending', receipt: 'Pending'
        });
        this.saveDb();
        alert('Expense claim submitted successfully.');
        this.navigate('expenses');
    },

    renderDocuments(container) {
        const userDocs = this.db.documents.filter(d => d.userId === this.currentUser.id);
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>My Documents</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <table class="data-table">
                    <thead><tr><th>Document</th><th>Type</th><th>Upload Date</th><th>Status</th></tr></thead>
                    <tbody>
                        ${userDocs.map(d => `
                            <tr>
                                <td>📄 ${d.docName}</td>
                                <td>${d.docType}</td>
                                <td>${d.uploadDate}</td>
                                <td><span class="badge badge-success">${d.status}</span></td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" style="text-align: center;">No documents found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderEmployeeAnalytics(container) {
        const totalEmployees = this.db.users.filter(u => u.role === 'employee').length;
        const presentToday = this.db.attendance.filter(a => a.date === new Date().toLocaleDateString() && a.status === 'Present').length;
        const pendingLeaves = this.db.leaves.filter(l => l.status === 'Pending').length;
        const approvedExpenses = this.db.expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);

        container.innerHTML = `
            <div class="section-header">
                <h2>Employee Analytics & HR Metrics</h2>
                <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
            </div>
            
            <div class="grid-cards">
                <div class="card">
                    <h3>👥 Total Employees</h3>
                    <h2 style="color: var(--odoo-primary); margin: 1rem 0;">${totalEmployees}</h2>
                    <p style="color: var(--text-muted);">Active workforce</p>
                </div>
                <div class="card">
                    <h3>✓ Present Today</h3>
                    <h2 style="color: var(--success); margin: 1rem 0;">${presentToday}</h2>
                    <p style="color: var(--text-muted);">Out of ${totalEmployees} employees</p>
                </div>
                <div class="card">
                    <h3>⏳ Pending Leaves</h3>
                    <h2 style="color: var(--warning); margin: 1rem 0;">${pendingLeaves}</h2>
                    <p style="color: var(--text-muted);">Awaiting approval</p>
                </div>
                <div class="card">
                    <h3>💰 Approved Expenses</h3>
                    <h2 style="color: var(--success); margin: 1rem 0;">₹${approvedExpenses}</h2>
                    <p style="color: var(--text-muted);">Total reimbursement</p>
                </div>
            </div>

            <h3 style="margin-top: 3rem; color: var(--odoo-primary);">Department Breakdown</h3>
            <table class="data-table">
                <thead><tr><th>Department</th><th>Employees</th><th>Avg Rating</th></tr></thead>
                <tbody>
                    <tr><td>Engineering</td><td>4</td><td>4.3/5 ⭐</td></tr>
                    <tr><td>Design</td><td>1</td><td>4.8/5 ⭐</td></tr>
                    <tr><td>Operations</td><td>3</td><td>4.1/5 ⭐</td></tr>
                </tbody>
            </table>
        `;
    },

    renderHolidayCalendar(container) {
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Holiday Calendar 2026</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <table class="data-table">
                    <thead><tr><th>Date</th><th>Holiday</th><th>Type</th></tr></thead>
                    <tbody>
                        ${this.db.holidays.map(h => `
                            <tr>
                                <td style="font-weight: bold;">${h.date}</td>
                                <td>${h.name}</td>
                                <td><span class="badge badge-success">${h.type}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderShiftManagement(container) {
        const userShift = this.db.shifts.filter(s => s.userId === this.currentUser.id);
        container.innerHTML = `
            <div class="panel">
                <div class="section-header">
                    <h2>Shift Management</h2>
                    <button class="btn btn-outline" onclick="App.navigate('dashboard')">Back</button>
                </div>
                <table class="data-table">
                    <thead><tr><th>Shift Type</th><th>Department</th><th>Start Date</th></tr></thead>
                    <tbody>
                        ${userShift.map(s => `
                            <tr>
                                <td>${s.shiftType}</td>
                                <td>${s.department}</td>
                                <td>${s.startDate}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="3" style="text-align: center;">No shift data found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }
});
