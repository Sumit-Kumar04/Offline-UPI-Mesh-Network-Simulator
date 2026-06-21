import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";
import AnimatedCounter from "../common/AnimatedCounter";
import styles from "./SimulationStats.module.css";

const STAT_ITEMS = [
  { key: "packetsCreated", label: "Total Packets Created", icon: "📤" },
  { key: "packetsDelivered", label: "Total Packets Delivered", icon: "📡" },
  { key: "duplicateDropped", label: "Duplicate Packets Dropped", icon: "⚠️" },
  { key: "successRate", label: "Settlement Success Rate", icon: "✅", suffix: "%" },
  { key: "avgHopCount", label: "Average Hop Count", icon: "🔗" },
  { key: "gatewayUploads", label: "Gateway Upload Count", icon: "🌐" },
];

function SimulationStats({ stats, successRate, avgHopCount }) {
  const values = {
    ...stats,
    successRate: Number(successRate),
    avgHopCount: Number(avgHopCount),
  };

  return (
    <GlassCard title="Simulation Statistics" subtitle="Session Metrics" icon="📉">
      <div className={styles.grid}>
        {STAT_ITEMS.map((item, i) => (
          <motion.div
            key={item.key}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.value}>
              <AnimatedCounter value={values[item.key] ?? 0} size="small" />
              {item.suffix && <span className={styles.unit}>{item.suffix}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

export default SimulationStats;
