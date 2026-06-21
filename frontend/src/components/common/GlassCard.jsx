import styles from "./GlassCard.module.css";

function GlassCard({
  children,
  title,
  subtitle,
  icon,
  className = "",
  padding = "default",
  glow = false,
}) {
  return (
    <div
      className={`${styles.card} ${styles[padding]} ${glow ? styles.glow : ""} ${className}`}
    >
      {(title || subtitle || icon) && (
        <div className={styles.header}>
          <div>
            {title && <div className={styles.title}>{title}</div>}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export default GlassCard;
