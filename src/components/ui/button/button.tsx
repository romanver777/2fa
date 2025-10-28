import styles from "./button.module.css";

type TButton = {
  id?: string;
  text: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  classname?: string;
  disabled?: boolean;
};

export const Button = ({
  id,
  text,
  onClick,
  type = "button",
  classname,
  disabled = false,
}: TButton) => {
  return (
    <button
      id={id}
      onClick={onClick && onClick}
      type={type}
      disabled={disabled}
      className={`${styles.button} ${classname ? styles[classname] : ""}`}
    >
      {text}
    </button>
  );
};
