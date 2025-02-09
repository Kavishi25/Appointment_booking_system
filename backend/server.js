require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// MySQL Connection with Promises
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check MySQL Connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL Database');
});

// ✅ Get All Available Slots
app.get('/available-slots', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM slots');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
});

// ✅ Book an Appointment (Now Using slot_id)
// ✅ Book an Appointment (Now Using slot_id)
app.post('/book-appointment', async (req, res) => {
    const { name, email, slot_id } = req.body;
    if (!name || !email || !slot_id) {
        return res.status(400).json({ error: "Name, email, and slot selection are required!" });
    }

    try {
        // Check if the slot is already booked
        const [existingAppointment] = await db.promise().query('SELECT * FROM appointments WHERE slot_id = ?', [slot_id]);
        if (existingAppointment.length > 0) {
            return res.status(400).json({ error: "This slot is already booked!" });
        }

        // Book the appointment if the slot is available
        await db.promise().query(
            'INSERT INTO appointments (name, email, slot_id) VALUES (?, ?, ?)', 
            [name, email, slot_id]
        );
        res.json({ message: "Appointment booked successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});


// ✅ Get All Appointments (Including Slot Details)
app.get('/appointments', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                appointments.id, 
                appointments.name, 
                appointments.email, 
                appointments.status,
                appointments.slot_id,
                slots.date, 
                slots.time 
            FROM appointments 
            LEFT JOIN slots ON appointments.slot_id = slots.id
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});


// ✅ Get Appointment by ID
app.get('/appointments/:id', async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const [rows] = await db.promise().query(
            `SELECT appointments.id, appointments.name, appointments.email, slots.date, slots.time 
            FROM appointments 
            JOIN slots ON appointments.slot_id = slots.id
            WHERE appointments.id = ?`,
            [appointmentId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch appointment details' });
    }
});

// ✅ Update an Appointment (Change Slot)
// ✅ Update an Appointment (Change Slot)
app.put('/update-appointment/:id', async (req, res) => {
    const { name, email, slot_id } = req.body;
    const appointmentId = req.params.id;

    try {
        // Check if the new slot is already booked (excluding the current appointment)
        const [existingAppointment] = await db.promise().query('SELECT * FROM appointments WHERE slot_id = ? AND id != ?', [slot_id, appointmentId]);

        if (existingAppointment.length > 0) {
            return res.status(400).json({ error: "This slot is already booked by another user!" });
        }

        // Update the appointment if the slot is available
        const [result] = await db.promise().query(
            'UPDATE appointments SET name = ?, email = ?, slot_id = ? WHERE id = ?', 
            [name, email, slot_id, appointmentId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json({ message: "Appointment updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});


// ✅ Delete an Appointment
app.delete('/delete-appointment/:id', async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const [result] = await db.promise().query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json({ message: "Appointment deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

// ✅ Get All Slots
app.get('/slots', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM slots');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch slots' });
    }
});

// ✅ Add a New Slot
app.post('/add-slot', async (req, res) => {
    const { date, time } = req.body;
    if (!date || !time) {
        return res.status(400).json({ error: "Date and time are required!" });
    }

    try {
        await db.promise().query('INSERT INTO slots (date, time) VALUES (?, ?)', [date, time]);
        res.json({ message: "Slot added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add slot' });
    }
});

// ✅ Delete a Slot
app.delete('/delete-slot/:id', async (req, res) => {
    try {
        const [result] = await db.promise().query('DELETE FROM slots WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Slot not found' });
        }
        res.json({ message: "Slot deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete slot' });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
