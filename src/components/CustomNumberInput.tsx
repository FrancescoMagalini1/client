import { ChangeEvent, useEffect, useRef, memo } from "react";
import "../assets/styles/custom-input.css";
import { animated, useSpringRef, Controller } from "@react-spring/web";

type inputProps = {
  name?: string;
  id?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  changeFunction?: (e: ChangeEvent<HTMLInputElement>) => void;
};

function CustomInputComponent({
  name = "",
  id = "",
  initialValue = 1,
  min = 1,
  max = 31,
  changeFunction,
}: inputProps) {
  let api = useSpringRef();
  let inputRef = useRef<HTMLInputElement>(null);
  let previousValue = useRef("");
  let animation = new Controller({
    ref: api,
    backgroundPositionX: "100%",
  });

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = initialValue.toString();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      let previousValue = Number(inputRef.current.value);
      let nextValue = Math.min(previousValue, max);
      nextValue = Math.max(nextValue, min);
      inputRef.current.value = nextValue.toString();
    }
  }, [min, max]);

  function focus() {
    animation.start({ backgroundPositionX: "0%" });
  }

  function blur() {
    animation.start({ backgroundPositionX: "100%" });
  }

  function change(e: ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.value;
    let check = true;
    if (inputRef.current) {
      if (
        !/\D/.test(nextValue) &&
        Number(nextValue) >= min &&
        Number(nextValue) <= max
      ) {
        inputRef.current.value = nextValue;
        previousValue.current = nextValue;
      } else {
        inputRef.current.value = previousValue.current;
        check = false;
      }
    }
    if (changeFunction && check) changeFunction(e);
  }

  return (
    <animated.input
      ref={inputRef}
      className="custom-input"
      style={{ backgroundPositionY: "100%", ...animation.springs }}
      type="number"
      name={name}
      id={id}
      autoComplete="off"
      onFocus={() => focus()}
      onBlur={() => blur()}
      onChange={change}
    />
  );
}

const CustomNumberInput = memo(CustomInputComponent);

export default CustomNumberInput;
