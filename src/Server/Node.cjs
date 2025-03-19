const http = require("http");
const nodemailer = require("nodemailer");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPqri0UCzENgItQouSBFk235hQdaEsuPM",
  authDomain: "final-project-18590.firebaseapp.com",
  projectId: "final-project-18590",
  storageBucket: "final-project-18590.appspot.com",
  messagingSenderId: "97806653299",
  appId: "1:97806653299:web:bf23143ddd89eb797ed706",
  measurementId: "G-QRFTE8RRRV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const port = 3000;

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "auve.dual.swu@phinmaed.com",
    pass: "zcso yywq aneg ibad",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) console.error("SMTP Connection Error:", error);
  else console.log("SMTP Server is ready to send emails");
});

// Helper function to validate required fields
const validateFields = (data, requiredFields) => {
  return requiredFields.every((field) => data[field] && typeof data[field] !== "undefined");
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/send-booking-confirmation") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        let bookingData = JSON.parse(body);
        console.log("Booking data received:", bookingData);
        const requiredFields = [
          "email",
          "firstName",
          "lastName",
          "selectedRoom",
          "checkInDate",
          "checkOutDate",
          "totalCost",
          "numberOfNights",
          "numberOfGuests",
          "guestInfo",
        ];

        if (!validateFields(bookingData, requiredFields)) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Missing required fields." }));
        }

        const bookingMailOptions = {
          from: '"Krismark Dive Lodge" <krismarkdivelodge@gmail.com>',
          to: bookingData.email,
          subject: "Booking Confirmation - Krismark Dive Lodge",
          text: `Dear ${bookingData.firstName} ${bookingData.lastName},\n\nThank you for choosing Krismark Dive Lodge for your stay! We’re delighted to have had you as our guest and truly appreciate your support. We hope you had a wonderful and memorable experience with us.\n\n---\n\nBooking Details:\nRoom: ${bookingData.selectedRoom}\nCheck-in Date: ${bookingData.checkInDate}\nCheck-out Date: ${bookingData.checkOutDate}\nNumber of Nights: ${bookingData.numberOfNights}\nNumber of Guests: ${bookingData.numberOfGuests}\nTotal Amount: ₱${bookingData.totalCost.toLocaleString()}\n\n---\n\nGuest Information:\nName: ${bookingData.firstName} ${bookingData.lastName}\nEmail: ${bookingData.email}\nPhone: ${bookingData.guestInfo.mobileNumber}\n\n---\n\nBest regards,\nKrismark Dive Lodge Team`,
        };

        await transporter.sendMail(bookingMailOptions);
        console.log("Booking email sent to:", bookingData.email);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Booking confirmation email sent successfully." }));
      } catch (error) {
        console.error("Error in /send-booking-confirmation:", error.message, error.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Internal server error: " + error.message }));
      }
    });
  }

  else if (req.method === "POST" && req.url === "/send-payment-receipt") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        let paymentData = JSON.parse(body);
        console.log("Payment data received:", paymentData);
        const requiredFields = [
          "email",
          "firstName",
          "lastName",
          "selectedRoom",
          "checkInDate",
          "checkOutDate",
          "totalCost",
          "paymentMethod",
          "numberOfNights",
          "numberOfGuests",
          "guestInfo",
        ];

        if (!validateFields(paymentData, requiredFields)) {
          console.log("Missing fields in payment data:", paymentData);
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Missing required fields." }));
        }

        // Prepare payment details string based on payment method
        let paymentDetails = `Payment Method: ${paymentData.paymentMethod}\n`;
        if (paymentData.paymentMethod === "GCash") {
          paymentDetails += `Reference Number: ${paymentData.referenceNumber || "N/A"}`;
        } else {
          paymentDetails += "Visa: ending in 1783";
        }

        const paymentMailOptions = {
          from: '"Krismark Dive Lodge" <krismarkdivelodge@gmail.com>',
          to: paymentData.email,
          subject: "Payment Receipt - Krismark Dive Lodge",
          text: `Dear ${paymentData.firstName} ${paymentData.lastName},\n\nYour payment has been successfully processed. Your booking is now fully confirmed. Here's your receipt:\n\n---\n\nBilling Information:\nName: ${paymentData.firstName} ${paymentData.lastName}\nEmail: ${paymentData.email}\nPhone: ${paymentData.guestInfo.mobileNumber}\n\n---\n\nBooking Details:\nRoom: ${paymentData.selectedRoom}\nCheck-in Date: ${paymentData.checkInDate}\nCheck-out Date: ${paymentData.checkOutDate}\nNumber of Nights: ${paymentData.numberOfNights}\nNumber of Guests: ${paymentData.numberOfGuests}\n\n---\n\nPayment Details:\n${paymentDetails}\nTotal Amount Paid: ₱${paymentData.totalCost.toLocaleString()}\n\n---\n\nWe’re excited to welcome you to Krismark Dive Lodge! If you have any questions, feel free to contact us.\n\nBest regards,\nKrismark Dive Lodge Team`,
        };

        await transporter.sendMail(paymentMailOptions);
        console.log("Payment receipt sent to:", paymentData.email);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Payment receipt email sent successfully." }));
      } catch (error) {
        console.error("Error in /send-payment-receipt:", error.message, error.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Internal server error: " + error.message }));
      }
    });
  }

  else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});