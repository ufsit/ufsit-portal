import React from "react";
import module_styles from "./Card.module.css";

interface CardButton {
  name: string;
  onClick: Function;
}

interface CardOptions {
  title: string;
  description: string;
  iconSrc: string;
  buttons: CardButton[];
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}

function Card(props: CardOptions) {
  return (
    <div
      className={`${module_styles["card-style"]} ${
        typeof props.className !== "undefined" ? props.className : ""
      }`}
      style={props.style}
    >
      <div className={module_styles["card-top-container"]}>
        <div className={module_styles["card-icon-title-container"]}>
          <img
            src={props.iconSrc}
            alt=""
            className={module_styles["card-icon"]}
          />
          <h1 className={module_styles["card-title"]}>{props.title}</h1>
        </div>
        <h3 className={module_styles["card-description"]}>
          {props.description}
        </h3>
      </div>
      <div className={module_styles["card-buttons-container"]}>
        {props.buttons.map((elem, index) => (
          <div
            className={module_styles["card-button"]}
            onClick={() => elem.onClick()}
            key={`card-button-${index}`}
          >
            {elem.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
