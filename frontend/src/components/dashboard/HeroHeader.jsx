import { motion } from "framer-motion";
import AnimatedCounter from "../common/AnimatedCounter";
import styles from "./HeroHeader.module.css";

const STATUS_CONFIG = {
  offline: {
    label: "OFFLINE",
    dotClass: styles.offline,
    textClass: styles.statusOffline,
  },
  connecting: {
    label: "CONNECTING",
    dotClass: styles.connecting,
    textClass: styles.statusConnecting,
  },
  online: {
    label: "ONLINE",
    dotClass: styles.online,
    textClass: styles.statusOnline,
  },
};

function HeroHeader({ stats }) {
  const gateway = STATUS_CONFIG[stats.gatewayStatus] ?? STATUS_CONFIG.offline;

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          OFFLINE UPI MESH NETWORK
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Encrypted mesh-routed deferred settlement simulation
        </motion.p>

        <motion.div
          className={styles.badges}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>Total Devices</span>
            <AnimatedCounter value={stats.totalDevices} size="small" />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>Active Packets</span>
            <AnimatedCounter value={stats.activePackets} size="small" />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>Settled Transactions</span>
            <AnimatedCounter value={stats.settledTransactions} size="small" />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>Gateway Status</span>
            <div className={styles.badgeValue}>
              <span className={`${styles.statusDot} ${gateway.dotClass}`} />
              <span className={gateway.textClass}>{gateway.label}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export default HeroHeader;
