function NodeCard({
  name,
  packets,
  gateway = false
}) {

  return (
    <div
      style={{
        width: "180px",
        padding: "15px",
        borderRadius: "16px",
        background: gateway
          ? "#14532d"
          : "#1e293b",

        color: "white",

        border:
          packets > 0
            ? "2px solid #facc15"
            : "1px solid #475569",

        boxShadow:
          packets > 0
            ? "0 0 20px rgba(250,204,21,.7)"
            : "none"
      }}
    >
      <h3
        style={{
          marginBottom: "10px"
        }}
      >
        {gateway
          ? "🌐 "
          : "📱 "}
        {name}
      </h3>

      <div>
        Packets:
        {" "}
        {packets}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "20px"
        }}
      >
        {
          Array.from({
            length: Math.min(
              packets,
              5
            )
          }).map(
            (_, i) => (
              <span key={i}>
                🟡
              </span>
            )
          )
        }
      </div>

    </div>
  );
}

export default NodeCard;