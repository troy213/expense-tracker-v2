import React from "react";
import styles from "./Dashboard.module.scss";
import DashboardSection from "./DashboardSection";
import { EntryGroup } from "@/constants";
import Empty from "./Empty";


const entries: EntryGroup[] = [
  // {
  //   date: "Today",
  //   items: [
  //     {
  //       category: "Salary",
  //       description: "Salary April 2024",
  //       amount: 123456789,
  //     },
  //     {
  //       category: "Food & Beverages",
  //       description: "Pizza Hut",
  //       amount: -100000,
  //     },
  //     {
  //       category: "Transportation",
  //       description: "Gas",
  //       amount: -50000
  //     },
  //   ],
  // },
  // {
  //   date: "26 April 2024",
  //   items: [
  //     {
  //       category: "Food & Beverages",
  //       description: "Gado-gado",
  //       amount: -15000,
  //     },
  //     {
  //       category: "Others",
  //       description: "Parking",
  //       amount: -2000,
  //     },
  //   ],
  // },
];
const num: number = 1
console.log({entries, num})

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>

        <h2 className={styles.balance}>Total Balance</h2>
        <h3 className={styles.balance}>Rp1.234.567</h3>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.title}>
              Total Income
              <span className={styles.icon}>↑</span>
            </div>
            <div className={styles.amount}>Rp1.234.567</div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.title}>
              Total Outcome
              <span className={styles.icon} style={{ color: "#dc3545" }}>
                ↓
              </span>
            </div>
            <div className={styles.amount}>Rp1.234.567</div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.title}>Total Remaining Budget</div>
          <div className={styles.amount}>Rp1.234.567</div>
          <div className={styles.date}>1 Apr 2024 - 30 Apr 2024</div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <div className={styles.progressText}>95%</div>
          </div>
        </div>
      </div>
      <div className={styles.txContainer}>
        {entries.length === 0 ? (
          <Empty />
        ) : (
          entries.map((entry, index) => {
            return (
              <DashboardSection
                date={entry.date}
                items={entry.items}
                key={entry.date + index}
              />
            );
          })
        )}
      </div>

      {/* {entries.map((entry, index) => {
        return (
          <DashboardSection
            date={entry.date}
            items={entry.items}
            key={entry.date + index}
          />
        );
      })} */}
    </div>
  );
};

export default Dashboard;
