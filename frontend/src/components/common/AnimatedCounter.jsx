import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import styles from "./AnimatedCounter.module.css";

function AnimatedCounter({ value, size = "medium", duration = 0.8 }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on("change", (v) => setShown(v));
  }, [display]);

  return (
    <motion.span
      className={`${styles.counter} ${styles[size]}`}
      key={value}
    >
      {shown.toLocaleString()}
    </motion.span>
  );
}

export default AnimatedCounter;
