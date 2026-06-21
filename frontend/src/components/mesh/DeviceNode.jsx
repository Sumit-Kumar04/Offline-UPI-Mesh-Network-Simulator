import { memo } from "react";
import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DeviceNode.module.css";

function DeviceNode({ data }) {
  const { name, packets, gateway, rippling } = data;

  return (
    <div
      className={`${styles.node} ${gateway ? styles.gateway : ""} ${
        packets > 0 ? styles.hasPackets : ""
      } ${packets > 0 ? styles.pulsing : ""}`}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />

      <AnimatePresence>
        {rippling && (
          <motion.div
            className={styles.ripple}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div className={styles.header}>
        <div className={styles.iconWrap}>{gateway ? "🌐" : "📱"}</div>
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.role}>{gateway ? "Gateway Node" : "Mesh Device"}</div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.packetCount}>
          <span className={styles.count}>{packets}</span>
          <span className={styles.label}>Packets</span>
        </div>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: Math.min(packets, 6) }).map((_, i) => (
          <motion.span
            key={i}
            className={styles.dot}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(DeviceNode);
