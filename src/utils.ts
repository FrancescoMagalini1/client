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

export const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];
