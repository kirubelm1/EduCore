# EduCore – School Management System
### 🚧 In Development

## 🌍 About EduCore
EduCore is a modern, Ethiopian-inspired **School Management System** designed to help administrators, teachers, students, and parents stay connected.  

It streamlines and digitalizes daily school operations such as:
- Built-in spreadsheet software for grades & ranking  
- Attendance tracking & analytics  
- Student and teacher dashboards  
- Admin dashboard with role-based controls  
- Secure authentication and account management  
- Communication tools for collaboration and updates  

EduCore combines **tradition and innovation**, supporting schools with a simple, reliable, and accessible platform tailored for the Ethiopian and global education context.  

---

## 🚀 Features

### 🎓 Academic
- Student information management (profiles, enrollment, academic history)  
- Teacher information management (profiles, subjects, schedules)  
- Class & section management  
- Gradebook & result calculation (sum, average, rank, GPA)  
- Built-in spreadsheet for advanced calculations and visualizations  
- Timetable & exam scheduling (auto/manual)  
- Homework/assignment management  
- Report cards & transcript generation  
- Library & resource management  

### 📊 Administration
- Admissions & enrollment (digital forms, approvals)  
- Attendance tracking (manual/biometric/RFID-ready)  
- Fees & finance management (invoices, receipts, late fee calculation)  
- Staff payroll management  
- Transport management (routes, fees, tracking)  
- Hostel/dormitory management  
- Inventory & asset management  

### 📱 Communication & Engagement
- Role-based dashboards (Admin, Teacher, Supervisor, Homeroom Teacher, Student, Parent)  
- File transfer & chatting system for teachers ↔ students  
- Built-in calendar & event reminders  
- Announcements & notice board  
- Parent portal (grades, attendance, fees, reports)  
- Student portal (assignments, progress, schedules)  
- Notifications (email, SMS, in-app)  

### 🌍 Advanced & Modern
- Secure authentication with bcrypt password hashing  
- MongoDB-powered scalable database  
- AI-ready analytics dashboard (performance prediction, attendance insights)  
- Mobile-friendly design (HTML, CSS, JavaScript frontend)  
- Multi-school/multi-branch support  
- Role-based access control & permissions  
- Cloud backup & data recovery  
- Ethiopian-inspired design & naming  

---

## 📂 Project Structure
```
EduCore/
│── Development/
│   ├── server.js          # Express server entry point
│   ├── mongodb.js         # MongoDB connection
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── public/            # Frontend files
│   │   ├── admin.html
│   │   ├── teacher.html
│   │   ├── student.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   │
│   │   ├── css/           # Stylesheets
│   │   │   ├── style.css  # Global + shared styles
│   │   │   ├── admin.css
│   │   │   ├── teacher.css
│   │   │   └── student.css
│   │   │
│   │   ├── js/            # Frontend scripts
│   │   │   ├── auth.js    # Login/Signup logic
│   │   │   ├── admin.js
│   │   │   ├── teacher.js
│   │   │   └── student.js
│   │   │
│   │   └── img/           # Images, logos
│   │       └── logo.png
│   │
│   ├── models/            # Database models
│   │   └── User.js        # Handles Admin, Teacher, Student roles
│   │
│   ├── routes/            # Express routes
│   │   └── auth.js        # Login & signup routes
│   │
│   └── README.md
│
└── .env                   # Environment variables (DB, secrets)

```

---

## ⚡️ Installation

Clone the repository:
```bash
git clone https://github.com/kirubelm1/EduCore.git
cd EduCore/Development
```

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Run production server:
```bash
npm start
```

---

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Security:** bcrypt (password hashing), cors (communication)  

---

## 🎯 Roadmap
- [ ] Attendance module with analytics  
- [ ] Assignment upload & submission system  
- [ ] AI-powered student performance dashboard  
- [ ] Parent & student mobile app  
- [ ] Transport & hostel modules  
- [ ] Multi-language & multi-branch support  
- [ ] Finance & payroll automation  
- [ ] API integrations (payment, SMS, video classes)  

---

## 🤝 Contributing
Contributions are welcome!  

1. Fork the repo  
2. Create a feature branch:  
   ```bash
   git checkout -b feature-name
   ```  
3. Commit changes:  
   ```bash
   git commit -m "Add new feature"
   ```  
4. Push to your branch and submit a PR  

---

## 📜 License
This project is licensed under the **MIT License** – see the LICENSE file for details.  

---

## 🌟 Show your support
If you like this project, please ⭐ star the repo to support development!  

👉 Repository: [EduCore on GitHub](https://github.com/kirubelm1/EduCore)  
