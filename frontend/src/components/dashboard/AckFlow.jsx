import { motion, AnimatePresence } from "framer-motion";
import styles from "./AckFlow.module.css";

function AckFlow({ ackFlow }) {
  return (
    <AnimatePresence>
      {ackFlow && (
        <motion.div
          className={styles.banner}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <span className={styles.icon}>📩</span>
          <div>
            <div className={styles.path}>
              <span>Gateway</span>
              <span className={styles.arrow}>→</span>
              <span>Mesh</span>
              <span className={styles.arrow}>→</span>
              <span>{ackFlow.sender}</span>
            </div>
            <div className={styles.message}>
              Sender received settlement acknowledgement
            </div>
          </div>
          <span className={styles.pulse} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AckFlow;
