import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";
import { SECURITY_FEATURES } from "../../constants/meshConfig";
import styles from "./SecurityDashboard.module.css";

function SecurityDashboard({ security }) {
  const allActive = Object.values(security).every(Boolean);

  return (
    <GlassCard title="Security Dashboard" subtitle="Encryption & Protection" icon="🔒">
      <div className={styles.header}>
        <span className={styles.headerIcon}>🛡️</span>
        <span className={styles.headerText}>
          {allActive
            ? "All security layers active — end-to-end encrypted mesh routing"
            : "Security alert — one or more protections triggered"}
        </span>
      </div>
      <div className={styles.grid}>
        {SECURITY_FEATURES.map((feature, i) => {
          const active = security[feature.key];
          return (
            <motion.div
              key={feature.id}
              className={`${styles.item} ${
                active ? styles.itemActive : styles.itemFailed
              }`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div>
                <div className={styles.label}>{feature.label}</div>
                <div className={styles.sublabel}>
                  {feature.id === "encryption" && "AES-256-GCM"}
                  {feature.id === "hash" && "SHA-256 packet integrity"}
                  {feature.id === "idempotency" && "Duplicate detection cache"}
                  {feature.id === "replay" && "Nonce + timestamp validation"}
                  {feature.id === "gateway" && "Bridge node verification"}
                </div>
              </div>
              <div className={styles.indicator}>
                <span
                  className={`${styles.dot} ${
                    active ? styles.active : styles.failed
                  }`}
                />
                <span className={active ? styles.activeText : styles.failedText}>
                  {active ? "Active" : "Failed"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

export default SecurityDashboard;
