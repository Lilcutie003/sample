// CalendarComponent.jsx
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { selectDate } from "../redux/calendarSlice";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const formatDateKey = (dateObj) => {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function CalendarComponent() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.calendar.events);
  const selectedDate = useSelector((state) => state.calendar.selectedDate);

  const { events, highlightedDates } = useMemo(() => {
    const eventList = [];
    const highlightSet = new Set();

    Object.entries(data).forEach(([dateString, entries]) => {
  const [day, month, year] = dateString.split("-");
  const dateObj = new Date(year, month - 1, day);

entries.forEach((entry) => {
  const startTime = new Date(year, month - 1, day, entry.hour, entry.minute);
  const endTime = new Date(year, month - 1, day, entry.hour + 1, entry.minute); // 1-hour event

  eventList.push({
    title: `${entry.user}: ${entry.value}`,
    start: startTime,
    end: endTime,
    allDay: false,
  });
});

});


    return { events: eventList, highlightedDates: highlightSet };
  }, [data]);

  const dayPropGetter = (date) => {
    const dateStr = date.toDateString();

    // Highlight selected date
    if (selectedDate && typeof selectedDate === "string") {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const selectedDateObj = new Date(year, month - 1, day);
        if (dateStr === selectedDateObj.toDateString()) {
          return {
            style: {
              backgroundColor: "#2e6193ff",
              color: "#fff",
              border: "2px solid #1a75ff",
              cursor: "pointer",
              borderRadius: "6px",
            },
          };
        }
      }
    }

    // Highlight dates with data
    if (highlightedDates.has(dateStr)) {
      return {
        style: {
          backgroundColor: "#fff6a8",
          border: "2px solid #b6a200",
          cursor: "pointer",
          borderRadius: "6px",
        },
      };
    }

    return {};
  };

  const handleSelect = (value) => {
    const selected = formatDateKey(value.start);
    dispatch(selectDate(selected));
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      selectable
      defaultView="month"
      views={["month", "week", "day"]}
      dayPropGetter={dayPropGetter}
      style={{ height: 500, margin: "20px" }}
      onSelectEvent={handleSelect}
      onSelectSlot={handleSelect}
    />
  );
}
