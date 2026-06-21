import styles from "./StatusBadge.module.css";

const VARIANT_MAP = {
  SETTLED: "settled",
  DUPLICATE_DROPPED: "duplicate",
  INVALID: "invalid",
  ONLINE: "online",
  OFFLINE: "offline",
  ACTIVE: "active",
};

function StatusBadge({ status, showDot = true }) {
  const variant = VARIANT_MAP[status] ?? "active";

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {showDot && <span className={styles.dot} />}
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export default StatusBadge;
