import React from "react";
import styles from "./Dashboard.module.scss";
import { EntryGroup } from "@/constants";
import EntryCard from "./EntryCard";

const DashboardSection: React.FC<EntryGroup> = ({date, items}) => {
  return (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>{date}</div>
            {items.map((item, key) => {
              return (
                <EntryCard key={key} category={item.category} description={item.description} amount={item.amount}/>
              )
            })}
          </div>
        )
}

export default DashboardSection
