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
  initialDate?: number[]; // year month day
  changeFunction?: (date: string) => void;
};

function CustomDatePickerSimple({ changeFunction, initialDate = [] }: props) {
  const [day, setDay] = useState(initialDate[2] ?? initialDay);
  const [month, setMonth] = useState(initialDate[1] ?? initialMonth);
  const [year, setYear] = useState(initialDate[0] ?? initialYear);
  const [maxDay, setMaxDay] = useState(
    getNumberOfDays(
      initialDate[0] ?? initialYear,
      initialDate[1] ?? initialMonth
    )
  );

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
        initialValue={initialDate[2] ?? initialDay}
        changeFunction={changeDay}
      />
      <CustomSelect
        data={monthList.current}
        initialValue={initialDate[1] ?? initialMonth}
        changeFunction={changeMonth}
        id="month"
        name="month"
      />
      <CustomNumberInput
        id="year"
        name="year"
        min={1}
        max={initialDate[0] ?? initialYear}
        initialValue={initialDate[0] ?? initialYear}
        changeFunction={changeYear}
      />
    </div>
  );
}

export default CustomDatePickerSimple;
