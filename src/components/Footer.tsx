import React from "react";
import styles from "./Footer.module.scss";
import PieChart from "../assets/icons/pie-chart.svg?react"
import Plus from "../assets/icons/plus.svg?react"
import Settings from "../assets/icons/settings.svg?react"
// import { EntryGroup } froms "@/constants";
// import EntryCard from "./EntryCard";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.flex}>
        <PieChart />
      </div>
      <div className={styles.flex}>
        <div className={styles.circle}>
          <Plus fill="white"/>
        </div>
      </div>
      <div className={styles.flex}>
        <Settings />
      </div>
    </div>
  );
};

export default Footer;
