// SlidePopup.jsx
import { useSelector, useDispatch } from "react-redux";
import { selectDate } from "../redux/calendarSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../components/SlidePopup.css";

const SlidePopup = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  const data = useSelector((state) => state.calendar.events);

  if (!selectedDate) return null;

  const selectedData = data[selectedDate] || [];

  // Aggregate values per user
  const chartData = selectedData.length
    ? selectedData.reduce((acc, entry) => {
        const user = entry.user || Object.keys(entry)[0]; // supports old format
        const value = entry.value || entry[user]; 
        const existing = acc.find((item) => item.name === user);
        if (existing) {
          existing.value += value;
        } else {
          acc.push({ name: user, value });
        }
        return acc;
      }, [])
    : [];

  const handleClose = () => dispatch(selectDate(null));

  return (
   <div className="popup-container">
  <button className="close-btn" onClick={handleClose}>X</button>

  <h3>📅 {selectedDate}</h3>

  {chartData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <p>No data found for the selected date: {selectedDate}</p>
  )}
</div>
  );
};

export default SlidePopup;
