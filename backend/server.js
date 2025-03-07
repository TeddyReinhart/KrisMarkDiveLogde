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

// Endpoint for booking confirmation email
app.post('/send-booking-confirmation', (req, res) => {
  const { email, firstName, lastName, selectedRoom, checkInDate, checkOutDate, totalCost } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    text: `Dear ${firstName} ${lastName},\n\nYour booking for ${selectedRoom} from ${checkInDate} to ${checkOutDate} has been confirmed.\n\nTotal Cost: ₱${totalCost}\n\nThank you for choosing us!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending booking confirmation email:', error);
      res.status(500).send('Error sending booking confirmation email');
    } else {
      console.log('Booking confirmation email sent:', info.response);
      res.status(200).send('Booking confirmation email sent successfully');
    }
  });
});

// Endpoint for check-out payment confirmation email
app.post('/send-checkout-confirmation', (req, res) => {
  const { email, firstName, lastName, selectedRoom, checkInDate, checkOutDate, totalCost, paymentMethod } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Check-Out Payment Confirmation',
    text: `Dear ${firstName} ${lastName},\n\nYour check-out for ${selectedRoom} from ${checkInDate} to ${checkOutDate} has been processed.\n\nTotal Payment: ₱${totalCost}\nPayment Method: ${paymentMethod}\n\nThank you for staying with us!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending check-out confirmation email:', error);
      res.status(500).send('Error sending check-out confirmation email');
    } else {
      console.log('Check-out confirmation email sent:', info.response);
      res.status(200).send('Check-out confirmation email sent successfully');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});