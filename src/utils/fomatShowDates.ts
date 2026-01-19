export default function formatShowDate(iso: string,yearType:'2-digit'|'numeric'|undefined='2-digit') {
  const date = new Date(iso);

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: yearType,
      timeZone: "UTC",
    }),
    day: date.toLocaleDateString("en-IN", {
      weekday: "short",
      timeZone: "UTC",
    }),
  };
}


