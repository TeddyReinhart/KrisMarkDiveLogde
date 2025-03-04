// CalendarComponent.jsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ date, setDate }) => {
  return (
    <aside className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Calendar</h3>
      </div>
      <Calendar onChange={setDate} value={date} className="react-calendar" />
      <div className="mt-4">
        <p className="text-sm font-bold">Today's Date :</p>
        <p className="text-sm text-gray-600">{date.toDateString()}</p>
      </div>
    </aside>
  );
};

export default CalendarComponent;
