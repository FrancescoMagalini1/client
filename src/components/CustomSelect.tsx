import { ChangeEvent, memo, useRef } from "react";
import "../assets/styles/components/custom-select.css";
import { animated, useSpringRef, Controller } from "@react-spring/web";

type props = {
  data: string[];
  id?: string;
  name?: string;
  initialValue?: number;
  changeFunction?: (e: ChangeEvent<HTMLSelectElement>) => void;
};

function CustomSelectComponent({
  data,
  id = "",
  name = "",
  initialValue = 0,
  changeFunction,
}: props) {
  let selectRef = useRef<HTMLSelectElement>(null);
  let api = useSpringRef();
  let animation = new Controller({
    ref: api,
    backgroundPositionX: "100%",
  });

  function focus() {
    animation.start({ backgroundPositionX: "0%" });
  }

  function blur() {
    animation.start({ backgroundPositionX: "100%" });
  }

  function change(e: ChangeEvent<HTMLSelectElement>) {
    if (selectRef.current) selectRef.current.value = e.target.value;
    if (changeFunction) changeFunction(e);
  }

  return (
    <animated.select
      ref={selectRef}
      className="custom-select"
      name={name}
      id={id}
      style={{ backgroundPositionY: "100%", ...animation.springs }}
      defaultValue={initialValue}
      onChange={change}
      onFocus={focus}
      onBlur={blur}
    >
      {data.map((element, index) => (
        <option key={index} value={index}>
          {element}
        </option>
      ))}
    </animated.select>
  );
}

const CustomSelect = memo(CustomSelectComponent);

export default CustomSelect;
