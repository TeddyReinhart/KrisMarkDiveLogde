require('dotenv').config(); // Load environment variables
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Configure Nodemailer using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASSWORD, // Use environment variable
  },
});

app.post('/send-email', (req, res) => {
  const { email, firstName, lastName, selectedRoom, checkInDate, checkOutDate, totalCost } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    text: `Dear ${firstName} ${lastName},\n\nYour booking for ${selectedRoom} from ${checkInDate} to ${checkOutDate} has been confirmed.\n\nTotal Cost: ₱${totalCost}\n\nThank you for choosing us!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});