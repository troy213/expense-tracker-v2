import React from "react";
import styles from "./Dashboard.module.scss";
import { Item } from "@/constants";


const EntryCard: React.FC<Item> = ({ category, description, amount}) => {
  return (
          <div className={styles.entryCard}>
            <div className={styles.entryContent}>
              <div className={styles.category}>{category}</div>
              <div className={styles.description}>{description}</div>
              <div className={styles.amount}>{amount}</div>
            </div>
          </div>
        )
}

export default EntryCard;
