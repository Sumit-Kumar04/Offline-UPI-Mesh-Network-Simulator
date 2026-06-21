import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";
import { formatCurrency } from "../../utils/meshHelpers";
import styles from "./AccountBalances.module.css";

const AVATARS = { Alice: "👩", Bob: "👨", Charlie: "🧑", David: "👤" };
const ACCOUNT_ORDER = ["Alice", "Bob", "Charlie", "David"];

function AccountBalances({ accounts }) {
  const prevBalances = useRef({});

  const sorted = [...accounts].sort(
    (a, b) => ACCOUNT_ORDER.indexOf(a.name) - ACCOUNT_ORDER.indexOf(b.name)
  );

  const cards = sorted.map((acc) => {
    const prev = prevBalances.current[acc.name];
    const delta = prev !== undefined ? acc.balance - prev : null;
    const trend =
      delta === null || delta === 0
        ? "neutral"
        : delta > 0
        ? "up"
        : "down";

    return { ...acc, delta, trend };
  });

  useEffect(() => {
    sorted.forEach((acc) => {
      prevBalances.current[acc.name] = acc.balance;
    });
  }, [accounts]);

  return (
    <GlassCard title="Account Balances" subtitle="Live Wallet Status" icon="💳">
      <div className={styles.grid}>
        {cards.map((acc, i) => (
          <motion.div
            key={acc._id ?? acc.name}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={styles.top}>
              <div className={styles.avatar}>
                {AVATARS[acc.name] ?? "👤"}
              </div>
              {acc.trend !== "neutral" && acc.delta !== null && (
                <span
                  className={`${styles.trend} ${
                    acc.trend === "up" ? styles.trendUp : styles.trendDown
                  }`}
                >
                  {acc.trend === "up" ? "↑" : "↓"} {Math.abs(acc.delta)}
                </span>
              )}
            </div>
            <div className={styles.name}>{acc.name}</div>
            <motion.div
              className={`${styles.balance} ${
                acc.trend === "up"
                  ? styles.balanceUp
                  : acc.trend === "down"
                  ? styles.balanceDown
                  : ""
              }`}
              key={acc.balance}
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              {formatCurrency(acc.balance)}
            </motion.div>
            <div className={styles.label}>Available Balance</div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

export default AccountBalances;
