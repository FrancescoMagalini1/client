import { useState, useCallback, ChangeEvent, useEffect } from "react";
import CustomNumberInput from "./CustomNumberInput";
import "../assets/styles/components/custom-timepicker.css";

const initialHours = 8;
const initialMinutes = 0;

type props = {
  initialTime?: number[]; // year month day
  changeFunction?: (time: number[] | null) => void;
};

function CustomTimePickerSimple({ changeFunction, initialTime = [] }: props) {
  const [hours, setHours] = useState(initialTime[0] ?? initialHours);
  const [minutes, setMinutes] = useState(initialTime[1] ?? initialMinutes);

  useEffect(() => {
    if (changeFunction) changeFunction([hours, minutes]);
  }, [hours, minutes]);

  let changeHours = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      if (changeFunction) changeFunction(null);
      return;
    }
    let value = Number(e.target.value);
    if (!isNaN(value)) {
      setHours(value);
    }
  }, []);

  let changeMinutes = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      if (changeFunction) changeFunction(null);
      return;
    }
    let value = Number(e.target.value);
    if (!isNaN(value)) {
      setMinutes(value);
    }
  }, []);

  return (
    <div className="custom-timepicker-simple">
      <CustomNumberInput
        id="hours"
        name="hours"
        min={0}
        max={23}
        initialValue={initialTime[0] ?? initialHours}
        changeFunction={changeHours}
      />
      <p>:</p>
      <CustomNumberInput
        id="minutes"
        name="minutes"
        min={0}
        max={59}
        initialValue={initialTime[1] ?? initialMinutes}
        changeFunction={changeMinutes}
      />
    </div>
  );
}

export default CustomTimePickerSimple;
