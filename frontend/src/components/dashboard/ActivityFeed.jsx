import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../common/GlassCard";
import { formatTime } from "../../utils/meshHelpers";
import styles from "./ActivityFeed.module.css";

const EVENT_ICONS = {
  packet_created: "📤",
  gossip: "📡",
  received: "📡",
  gateway: "🌐",
  upload: "🌐",
  duplicate: "⚠️",
  invalid: "❌",
  settled: "✅",
  ack: "📩",
  reset: "🔄",
};

function ActivityFeed({ events }) {
  return (
    <GlassCard title="Activity Feed" subtitle="Real-time Event Stream" icon="📋">
      <div className={styles.feed}>
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className={styles.empty}>
              No events yet. Inject a packet to begin simulation.
            </div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                className={`${styles.event} ${styles[event.type] ?? ""}`}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.icon}>
                  {EVENT_ICONS[event.type] ?? "•"}
                </span>
                <div className={styles.body}>
                  <div className={styles.message}>{event.message}</div>
                  <div className={styles.time}>{formatTime(event.timestamp)}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}

export default ActivityFeed;
