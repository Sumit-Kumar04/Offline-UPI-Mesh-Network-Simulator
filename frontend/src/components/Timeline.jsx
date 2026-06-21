function Timeline({ events }) {

  return (

    <div
      style={{
        width: "320px",
        background: "#111827",
        borderRadius: "20px",
        padding: "20px",
        color: "white",
        height: "850px",
        overflowY: "auto"
      }}
    >

      <h2>
        Network Timeline
      </h2>

      {
        events.map(
          (event, index) => (

            <div
              key={index}
              style={{
                background: "#1e293b",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "10px"
              }}
            >
              {event}
            </div>

          )
        )
      }

    </div>

  );

}

export default Timeline;