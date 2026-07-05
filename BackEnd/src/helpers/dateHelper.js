function formatDate(dateStr) {
  if (!dateStr) return null;

  const [date, time] = dateStr.split(" ");
  const [day, month, year] = date.split("-");

  return `${year}-${month}-${day} ${time}`;
}

function parseUffizioDate(dateStr) {
  if (!dateStr) return null;

  const [date, time] = dateStr.split(" ");
  const [day, month, year] = date.split("-");

  return new Date(`${year}-${month}-${day}T${time}`);
}

module.exports = {
  formatDate,
  parseUffizioDate,
};