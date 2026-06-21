import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";
import { PHASES, USER_NAMES } from "../../constants/meshConfig";
import styles from "./ControlCenter.module.css";

function ControlCenter({
  sender,
  receiver,
  amount,
  phase,
  loading,
  onSenderChange,
  onReceiverChange,
  onAmountChange,
  onInject,
  onGossip,
  onFlush,
  onReset,
}) {
  return (
    <GlassCard title="Control Center" subtitle="Simulation Controls" icon="⚡" glow>
      <div className={styles.panel}>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="sender">Sender</label>
            <select
              id="sender"
              className={styles.select}
              value={sender}
              onChange={(e) => onSenderChange(e.target.value)}
            >
              {USER_NAMES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="receiver">Receiver</label>
            <select
              id="receiver"
              className={styles.select}
              value={receiver}
              onChange={(e) => onReceiverChange(e.target.value)}
            >
              {USER_NAMES.filter((n) => n !== sender).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              className={styles.input}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              min="1"
              placeholder="500"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <motion.button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onInject}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Inject Packet
          </motion.button>
          <motion.button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={onGossip}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Run Gossip Round
          </motion.button>
          <motion.button
            className={`${styles.btn} ${styles.btnAccent}`}
            onClick={onFlush}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Flush Gateway
          </motion.button>
          <motion.button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={onReset}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Network
          </motion.button>
        </div>

        <div className={styles.tracker}>
          <div className={styles.trackerLabel}>Current Phase</div>
          <div className={styles.steps}>
            {PHASES.map((step, index) => (
              <div key={step.id} className={styles.stepGroup}>
                <div
                  className={`${styles.step} ${
                    index === phase ? styles.stepActive : ""
                  } ${index < phase ? styles.stepComplete : ""}`}
                >
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
                {index < PHASES.length - 1 && (
                  <div className={styles.connector}>
                    <div
                      className={`${styles.connectorFill} ${
                        index < phase ? styles.connectorFull : ""
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default ControlCenter;
