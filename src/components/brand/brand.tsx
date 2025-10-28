import { LogoIcon } from "../ui";
import styles from "./brand.module.css";

export const Brand = () => {
  return (
    <div className={styles.brand}>
      <LogoIcon />
      <div className={styles.name}>Company</div>
    </div>
  );
};
