import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatTime, truncateHash } from "../../utils/meshHelpers";
import styles from "./SettlementModal.module.css";

function SettlementModal({ data, onClose }) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className={styles.checkmark}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              ✓
            </motion.div>
            <div className={styles.title}>Settlement Successful</div>
            <div className={styles.subtitle}>
              Payment settled via gateway upload
            </div>
            <div className={styles.amount}>
              {formatCurrency(data.amount)}
            </div>
            <div className={styles.details}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Sender</span>
                <span className={styles.rowValue}>{data.sender}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Receiver</span>
                <span className={styles.rowValue}>{data.receiver}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Transaction ID</span>
                <span className={styles.rowValue}>{data.transactionId}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Settlement Time</span>
                <span className={styles.rowValue}>
                  {formatTime(data.settlementTime)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Packet Hash</span>
                <span className={`${styles.rowValue} ${styles.hash}`}>
                  {truncateHash(data.packetHash, 20)}
                </span>
              </div>
            </div>
            <button className={styles.close} onClick={onClose}>
              Dismiss
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SettlementModal;
