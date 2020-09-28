import React, {useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


function MyCalendar() {
  const [value, onChange] = useState(new Date());
    return (
      <Calendar
      onChange={onChange}
      value={value}
      style={{"width": "100%", "margin": "0 auto"}} />
    )
}

export default MyCalendar
