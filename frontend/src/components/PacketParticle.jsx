import { motion } from "framer-motion";

function PacketParticle({
  startX,
  startY,
  endX,
  endY,
  onComplete
}) {

  return (

    <motion.div
      initial={{
        x: startX,
        y: startY,
        opacity: 1,
        scale: 1
      }}

      animate={{
        x: endX,
        y: endY,
        opacity: 1,
        scale: 1.2
      }}

      transition={{
        duration: 1.5,
        ease: "linear"
      }}

      onAnimationComplete={
        onComplete
      }

      style={{
        position: "absolute",
        zIndex: 9999,
        fontSize: "28px",
        pointerEvents: "none"
      }}
    >
      🟡
    </motion.div>

  );

}

export default PacketParticle;