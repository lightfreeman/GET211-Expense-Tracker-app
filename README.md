# Expense Tracker with Budget Alerts

## Course Code
GET 211

## Project Title
Expense Tracker with Budget Alerts

---

## Project Description

The Expense Tracker with Budget Alerts is a web-based application developed as a departmental course project for GET 211.

The system allows users to register and log in, set a total budget, record daily expenses, visualize spending through charts, and receive alerts when expenses approach or exceed the set budget.

This project demonstrates the practical application of the Software Development Life Cycle (SDLC) using a full-stack approach.

---

## Project Objectives

- Implement user registration and login
- Allow users to add and delete expenses
- Store user and expense data in a database
- Enable budget setting and tracking
- Automatically calculate expenses and remaining balance
- Display budget warning and critical alerts
- Visualize expenses using charts
- Apply SDLC principles throughout development

---

## Project Scope

### In Scope
- User authentication (login and registration)
- Expense management (Add and Delete)
- Budget tracking
- Expense dashboard with calculations
- Chart-based expense visualization
- Budget alert notifications

### Out of Scope
- Online payment processing
- Bank or wallet integrations
- Mobile application version
- Cloud deployment

---

## Technologies Used

### Frontend
- HTML
- CSS (Modern and responsive design)
- JavaScript (Vanilla JS)
- Chart.js (for expense visualization)

### Backend
- PHP
- PHP Sessions for authentication

### Database
- MySQL (phpMyAdmin)

### Tools & Environment
- XAMPP (Apache and MySQL)
- Git & GitHub
- VS Code
- Localhost

---

## System Features

- Secure user authentication
- Expense tracking dashboard
- Budget input and monitoring
- Automatic expense calculations
- Budget warning and over-budget alerts
- Interactive expense charts
- Responsive and user-friendly interface

---

## Project Folder Structure

GET211-Expense-Tracker-app/
│
├── backend/
│ ├── config/
│ │ └── db.php
│ ├── auth/
│ │ ├── login.php
│ │ └── register.php
│ └── expenses/
│ ├── add.php
│ └── delete.php
│
├── pages/
│ ├── login.html
│ ├── register.html
│ └── dashboard.html
│
├── assets/
│ ├── css/
│ │ └── style.css
│ └── js/
│ ├── auth.js
│ └── dashboard.js
│
├── index.html
└── README.md


---

## Database Structure

### users Table
| Column | Description |
|------|------------|
| id | Primary Key |
| fullname | User full name |
| email | User email |
| password | Hashed password |
| created_at | Timestamp |

### expenses Table
| Column | Description |
|------|------------|
| id | Primary Key |
| user_id | Foreign Key |
| description | Expense description |
| amount | Expense amount |
| created_at | Timestamp |

---

## How to Run the Project Locally

1. Install XAMPP
 Download and install from https://www.apachefriends.org/index.html
2. Start Apache and MySQL
3. Clone the repository:
git clone https://github.com/lightfreeman/GET211-Expense-Tracker-app.git
4. Move the project folder into:
C:\xampp\htdocs\
5. Create the database:
- Open `http://localhost/phpmyadmin`
- Create database named `expense_tracker` by running the following SQL commands:
   CREATE DATABASE expense_tracker;
   USE expense_tracker;
- Create `users` and `expenses` tables by running the following SQL commands:
   CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

6. Open the project in your browser:
http://localhost/GET211-Expense-Tracker-app/


---

## Collaboration and Version Control

GitHub is used for version control and collaboration among group members. Each member works on assigned features and integrates changes through the shared repository.

---

## Deployment

This project is developed and tested only on localhost due to its academic nature.

---

## SDLC Phases Applied

1. Planning and Requirements Analysis
2. System Design
3. Implementation
4. Testing
5. Deployment (Localhost)

---

## Contributors

GET 211 Group Project

---

## License

This project is developed strictly for educational purposes.
