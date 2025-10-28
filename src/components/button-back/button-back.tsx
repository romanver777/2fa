import { ArrowIcon } from "../ui";
import styles from "./button-back.module.css";

export const ButtonBack = ({
  classname,
  onClick,
}: {
  classname?: string;
  onClick?: () => void;
}) => {
  const handleClick = () => window.history.back;

  return (
    <button
      onClick={onClick || handleClick}
      className={`${styles.buttonBack} ${classname && styles[classname]}`}
    >
      <ArrowIcon />
    </button>
  );
};
