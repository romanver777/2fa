import styles from "./button.module.css";

type TButton = {
  text: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  classname?: string;
  disabled?: boolean;
};

export const Button = ({
  text,
  onClick,
  type = "button",
  classname,
  disabled = false,
}: TButton) => {
  return (
    <button
      onClick={onClick && onClick}
      type={type}
      disabled={disabled}
      className={`${styles.button} ${classname && styles[classname]}`}
    >
      {text}
    </button>
  );
};
