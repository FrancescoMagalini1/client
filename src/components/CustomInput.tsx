import { ChangeEvent, useEffect, useRef, memo } from "react";
import "../assets/styles/custom-input.css";
import { animated, useSpringRef, Controller } from "@react-spring/web";

type inputProps = {
  type?: string;
  name?: string;
  id?: string;
  initialValue?: string;
  maxLength?: number;
  changeFunction?: (e: ChangeEvent<HTMLInputElement>) => void;
};

function CustomInputComponent({
  type = "text",
  name = "",
  id = "",
  initialValue = "",
  maxLength,
  changeFunction,
}: inputProps) {
  let api = useSpringRef();
  let inputRef = useRef<HTMLInputElement>(null);
  let animation = new Controller({
    ref: api,
    backgroundPositionX: "100%",
  });

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = initialValue;
  }, []);

  function focus() {
    animation.start({ backgroundPositionX: "0%" });
  }

  function blur() {
    animation.start({ backgroundPositionX: "100%" });
  }

  function change(e: ChangeEvent<HTMLInputElement>) {
    if (inputRef.current) inputRef.current.value = e.target.value;
    if (changeFunction) changeFunction(e);
  }

  return (
    <animated.input
      ref={inputRef}
      className="custom-input"
      style={{ backgroundPositionY: "100%", ...animation.springs }}
      type={type}
      name={name}
      id={id}
      maxLength={maxLength}
      autoComplete="off"
      onFocus={() => focus()}
      onBlur={() => blur()}
      onChange={change}
    />
  );
}

const CustomInput = memo(CustomInputComponent);

export default CustomInput;
