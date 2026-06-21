import { memo } from "react";
import { BaseEdge, getBezierPath } from "reactflow";
import styles from "./AnimatedEdge.module.css";

function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const active = data?.active;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={active ? styles.edgeActive : styles.edge}
      />
      {active && (
        <circle r="4" className={styles.particle}>
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
}

export default memo(AnimatedEdge);
