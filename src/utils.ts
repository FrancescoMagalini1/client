export function unpackDate(date: Date) {
  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

export function formatDate(date: Date) {
  let month = "" + (date.getMonth() + 1),
    day = "" + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function formatDateTime(date: Date) {
  let hours = "" + date.getHours(),
    minutes = "" + date.getMinutes(),
    seconds = "" + date.getSeconds();

  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  if (seconds.length < 2) seconds = "0" + seconds;

  return formatDate(date) + " " + [hours, minutes, seconds].join(":");
}

export const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];
