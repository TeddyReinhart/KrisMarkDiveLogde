import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent({ date, setDate, bookedDates }) {
  // Function to check if a date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => date.toDateString() === bookedDate.toDateString()
    );
  };

  // Custom day class to highlight booked dates
  const dayClassName = (date) => {
    return isDateBooked(date) ? "bg-red-500 text-white rounded-full" : null;
  };

  return (
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      inline // Display the calendar inline
      dayClassName={dayClassName} // Apply custom class to booked dates
    />
  );
}

export default CalendarComponent;