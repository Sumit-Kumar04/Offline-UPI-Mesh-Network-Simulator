import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";
import { formatTime } from "../../utils/meshHelpers";
import styles from "./DevicePanel.module.css";

function DevicePanel({ devices }) {
  return (
    <GlassCard title="Device Monitoring" subtitle="Virtual Mesh Nodes" icon="📡">
      <div className={styles.header}>
        <span>Device</span>
        <span>Status</span>
        <span>Bluetooth</span>
        <span>Internet</span>
        <span>Packets</span>
        <span>Last Activity</span>
      </div>
      <div className={styles.list}>
        {devices.map((device, i) => (
          <motion.div
            key={device.id}
            className={`${styles.device} ${device.isGateway ? styles.gateway : ""}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className={styles.name}>
              <span className={styles.icon}>
                {device.isGateway ? "🌐" : "📱"}
              </span>
              {device.name}
            </span>
            <span
              className={
                device.status === "ACTIVE"
                  ? styles.statusActive
                  : styles.statusIdle
              }
            >
              {device.status}
            </span>
            <span className={styles.boolYes}>
              {device.bluetoothConnected ? "Connected" : "Disconnected"}
            </span>
            <span className={device.internetAvailable ? styles.boolYes : styles.boolNo}>
              {device.internetAvailable ? "Available" : "Offline"}
            </span>
            <span className={styles.packets}>{device.packetsHeld}</span>
            <span className={styles.time}>
              {device.lastActivity ? formatTime(device.lastActivity) : "—"}
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

export default DevicePanel;
