export default function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const newDate = new Date(d.setDate(diff));
  newDate.setMinutes(0);
  newDate.setHours(0);
  newDate.setMilliseconds(0);
  return newDate;
}
