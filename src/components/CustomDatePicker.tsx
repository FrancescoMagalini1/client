import "../assets/styles/custom-datepicker.css";
import CustomNumberInput from "./CustomNumberInput";
import CustomSelect from "./CustomSelect";
import { ChangeEvent, useCallback, useState, useRef, useEffect } from "react";

function getMonthList(
  locales?: string | string[],
  format: "long" | "short" = "long"
): string[] {
  const year = new Date().getFullYear();
  const monthList = [...Array(12).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const formatter = new Intl.DateTimeFormat(locales, {
    month: format,
  });

  const getMonthName = (monthIndex: number) =>
    formatter.format(new Date(year, monthIndex));

  return monthList.map(getMonthName);
}

function getNumberOfDays(year: number, month: number) {
  // JavaScript months are zero-indexed (0 for January, 11 for December)
  const date = new Date(year, month, 1);

  // Move to the next month and move back one day to get the last day of the given month
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);

  // Return the day of the month, which gives the number of days in the given month
  return date.getDate();
}

const initialDay = 1;
const initialMonth = 0;
const initialYear = new Date().getFullYear();

type props = {
  changeFunction?: (date: string) => void;
};

function CustomDatePickerSimple({ changeFunction }: props) {
  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [maxDay, setMaxDay] = useState(31);

  const monthList = useRef(getMonthList("en-EN"));

  let changeDay = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (!isNaN(value)) {
      setDay(value);
    }
  }, []);

  useEffect(() => {
    setMaxDay(getNumberOfDays(year, month));
  }, [year, month]);

  useEffect(() => {
    let date = new Date(year, month, day);
    if (!isNaN(date.getTime()) && changeFunction)
      changeFunction(date.toISOString());
  }, [year, month, day]);

  let changeMonth = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    let value = Number(e.target.value);
    if (!isNaN(value)) {
      setMonth(value);
    }
  }, []);

  let changeYear = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (!isNaN(value)) {
      setYear(value);
    }
  }, []);

  return (
    <div className="custom-datepicker-simple">
      <CustomNumberInput
        id="day"
        name="day"
        min={1}
        max={maxDay}
        initialValue={initialDay}
        changeFunction={changeDay}
      />
      <CustomSelect
        data={monthList.current}
        initialValue={initialMonth - 1}
        changeFunction={changeMonth}
        id="month"
        name="month"
      />
      <CustomNumberInput
        id="year"
        name="year"
        min={1}
        max={initialYear}
        initialValue={initialYear}
        changeFunction={changeYear}
      />
    </div>
  );
}

export default CustomDatePickerSimple;
