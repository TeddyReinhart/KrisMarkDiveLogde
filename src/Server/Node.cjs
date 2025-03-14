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
    user: "auve.dual.swu@phinmaed.com", // Hardcoded email
    pass: "zcso yywq aneg ibad", // Hardcoded password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Helper function to validate required fields
const validateFields = (data, requiredFields) => {
  return requiredFields.every((field) => data[field] && typeof data[field] !== "undefined");
};

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Handle POST /send-booking-confirmation (booking receipt)
  if (req.method === "POST" && req.url === "/send-booking-confirmation") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        // Parse JSON safely
        let bookingData;
        try {
          bookingData = JSON.parse(body);
        } catch (parseError) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Invalid JSON format." }));
        }

        // Required fields for booking confirmation
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
        if (!validateFields(bookingData, requiredFields)) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Missing required fields." }));
        }

        // Send booking confirmation email
        const mailOptions = {
          from: '"Krismark Dive Lodge" <krismarkdivelodge@gmail.com>', // Sender name and email
          to: bookingData.email, // Recipient email
          subject: "Booking Confirmation", // Email subject
          text: `Hey ${bookingData.firstName},\n\nYour payment for the hotel reservation has been successfully received. Thank you for choosing us for your accommodation needs. Your booking is now confirmed, and we’re excited to provide you with a pleasant and memorable stay. If there’s anything you need, feel free to contact us at any time.\n\nYour receipt for your payment can be found below.\n\n---\n\n## Billing Information\n${bookingData.firstName} ${bookingData.lastName}\n${bookingData.guestInfo.mobileNumber}\n${bookingData.email}\n\n---\n\n## Booking Details\nRoom: ${bookingData.selectedRoom}\nCheck-in Date: ${bookingData.checkInDate}\nCheck-out Date: ${bookingData.checkOutDate}\nNumber of Nights: ${bookingData.numberOfNights}\nNumber of Guests: ${bookingData.numberOfGuests}\n\n---\n\n## Payment Details\nPayment Method: ${bookingData.paymentMethod}\n${
            bookingData.paymentMethod === "GCash"
              ? `GCash Number: ${bookingData.gcashNumber}`
              : "Visa: xxxxxxxxxxxxxxxxx1783"
          }\n\n---\n\n## Total\nTotal amount: ₱${bookingData.totalCost.toLocaleString()}\n\n**Total amount : ${bookingData.totalCost.toLocaleString()} PHP**\n\n---\n\nBest regards,\nKrismark Dive Lodge`,
        };

        await transporter.sendMail(mailOptions);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Booking confirmation email sent successfully." }));
      } catch (error) {
        console.error("Error in /send-booking-confirmation:", error.message);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Internal server error. Please try again later." }));
      }
    });
  }

  // Handle unknown routes
  else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});