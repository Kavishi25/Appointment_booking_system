📌 Appointment Booking System
📖 Overview
This is a React.js + Node.js + MySQL based Appointment Booking System where users can:
✅ Log in using static credentials
✅ View available slots
✅ Book appointments (only available slots)
✅ Manage their booked appointments

Admins have the ability to:
✅ Manage available slots (Add, Edit, Delete)
✅ Monitor user bookings

🔑 User Login Credentials
For testing purposes, use the following static credentials:

Email: user@example.com
Password: password123
Admin credentials (for slot management):

Email: admin@example.com
Password: adminpass

(These credentials are currently hardcoded for testing. Update authentication logic for production use.)

Can not log in using invelid credentials.

🚀 Features
🔹 User Functionalities
✔️ Log in and access the system
✔️ View available appointment slots
✔️ Book an appointment (only available slots)
✔️ Edit or delete their booked appointments
✔️ Cannot book already booked slots

🔹 Admin Functionalities
✔️ Log in with admin credentials
✔️ Manage time slots (Add, Edit, Delete slots)
✔️ View and track all appointments

🛠️ Tech Stack
Frontend: React.js, HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL

📦 Installation & Setup
1️⃣ Clone the Repository

git clone https://github.com/yourusername/appointment-booking.git
cd appointment-booking

2️⃣ Install Dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install

3️⃣ Set Up MySQL Database

1. Create a MySQL database: appointment_db
2. Import database.sql (provided in the repository).
3. Update .env file in the backend with your database credentials.

4️⃣ Start the Application

Backend


cd backend
node server.js

Frontend

cd frontend
npm start

📌 API Endpoints
User Routes
🔹 GET /appointments → Fetch all appointments
🔹 POST /book-appointment → Book an appointment
🔹 PUT /update-appointment/:id → Update an appointment
🔹 DELETE /delete-appointment/:id → Cancel an appointment

Admin Routes
🔹 GET /slots → Fetch available slots
🔹 POST /add-slot → Add a new slot
🔹 PUT /update-slot/:id → Update slot details
🔹 DELETE /delete-slot/:id → Remove a slot

💡 Future Enhancements
🔸 Dynamic user authentication (JWT)
🔸 Role-based access control (RBAC)
🔸 Email/SMS notifications for bookings

👩‍💻 Author
Developed by Kavishi 🚀