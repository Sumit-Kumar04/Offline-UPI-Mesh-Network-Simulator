import { motion } from "framer-motion";
import styles from "./PacketParticle.module.css";

const NODE_COORDS = {
  alice: { x: 180, y: 120 },
  bob: { x: 580, y: 120 },
  charlie: { x: 180, y: 340 },
  david: { x: 580, y: 340 },
  bridge: { x: 380, y: 540 },
};

function PacketParticle({ sourceNode, targetNode, reverse, onComplete }) {
  const src = NODE_COORDS[reverse ? targetNode : sourceNode];
  const tgt = NODE_COORDS[reverse ? sourceNode : targetNode];

  if (!src || !tgt) return null;

  return (
    <motion.div
      className={styles.particle}
      initial={{ left: src.x, top: src.y, opacity: 0, scale: 0.5 }}
      animate={{
        left: tgt.x,
        top: tgt.y,
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1.2, 0.8],
      }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <span className={styles.glow} />
      <span className={styles.icon}>{reverse ? "📩" : "🟡"}</span>
    </motion.div>
  );
}

export default PacketParticle;
