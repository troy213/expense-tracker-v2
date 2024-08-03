import React from "react";
import styles from "./Dashboard.module.scss"

const Empty: React.FC = () => {
  return (
    <div className={styles.emptyPage}>
      There is no transactions
    </div>
  );
};

export default Empty
