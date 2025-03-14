import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CalendarComponent.css";

function CalendarComponent({ date, setDate, bookedDates }) {
  // Function to check if a date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => date.toDateString() === bookedDate.toDateString()
    );
  };

  // Custom day class to highlight booked dates and apply general styles
  const dayClassName = (date) => {
    const baseClass = "flex-1 flex items-center justify-center";
    return isDateBooked(date)
      ? `${baseClass} bg-red-500 text-white rounded-full`
      : baseClass;
  };

  return (
    <div className="w-full h-full"> {/* Ensure the parent container has full width and height */}
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        inline // Display the calendar inline
        dayClassName={dayClassName} // Apply custom class to all days
        calendarClassName="w-full h-full flex flex-col" // Force calendar to fill container
        className="w-full h-full" // Ensure the DatePicker itself takes full space
        wrapperClassName="w-full h-full" // Ensure the wrapper takes full space
        monthClassName="w-full h-full flex flex-col" // Ensure month container is full
        weekClassName="w-full flex-1 flex" // Ensure weeks are flexible and full width
        renderCustomHeader={({
          monthDate,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-2 py-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {"<"}
            </button>
            <span className="text-lg font-semibold">
              {monthDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {">"}
            </button>
          </div>
        )}
      />
    </div>
  );
}

export default CalendarComponent;