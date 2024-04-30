import { ChangeEvent, memo } from "react";
import "../assets/styles/custom-textarea.css";
import { animated, useSpringRef, Controller } from "@react-spring/web";

type props = {
  id?: string;
  name?: string;
  maxLength?: number;
  initialValue?: string;
  changeFunction?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

function CustomTextAreaComponent({
  id = "",
  name = "",
  initialValue = "",
  changeFunction,
  maxLength,
}: props) {
  let api = useSpringRef();
  let animation = new Controller({
    ref: api,
    borderColor: "var(--dark-grey)",
  });

  function focus() {
    animation.start({ borderColor: "var(--black)" });
  }

  function blur() {
    animation.start({ borderColor: "var(--dark-grey)" });
  }

  function change(e: ChangeEvent<HTMLTextAreaElement>) {
    if (changeFunction) changeFunction(e);
  }

  return (
    <animated.textarea
      className="custom-textarea"
      id={id}
      name={name}
      cols={30}
      rows={10}
      maxLength={maxLength}
      defaultValue={initialValue}
      style={{ resize: "none", ...animation.springs }}
      onFocus={focus}
      onBlur={blur}
      onChange={change}
    ></animated.textarea>
  );
}

const CustomTextArea = memo(CustomTextAreaComponent);

export default CustomTextArea;
