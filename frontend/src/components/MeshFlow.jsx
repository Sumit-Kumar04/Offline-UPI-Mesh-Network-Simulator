import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import NodeCard from "./NodeCard";

function MeshFlow({ mesh = [] }) {

  const getPackets = (id) => {

    const device =
      mesh.find(
        d => d.id === id
      );

    return device
      ? device.packets.length
      : 0;

  };

  const nodes = [

    {
      id: "alice",
      position: {
        x: 100,
        y: 100
      },
      data: {
        label:
          <NodeCard
            name="Alice"
            packets={
              getPackets(
                "phone-alice"
              )
            }
          />
      }
    },

    {
      id: "bob",
      position: {
        x: 550,
        y: 100
      },
      data: {
        label:
          <NodeCard
            name="Bob"
            packets={
              getPackets(
                "phone-bob"
              )
            }
          />
      }
    },

    {
      id: "charlie",
      position: {
        x: 100,
        y: 350
      },
      data: {
        label:
          <NodeCard
            name="Charlie"
            packets={
              getPackets(
                "phone-charlie"
              )
            }
          />
      }
    },

    {
      id: "david",
      position: {
        x: 550,
        y: 350
      },
      data: {
        label:
          <NodeCard
            name="David"
            packets={
              getPackets(
                "phone-david"
              )
            }
          />
      }
    },

    {
      id: "bridge",
      position: {
        x: 330,
        y: 620
      },
      data: {
        label:
          <NodeCard
            name="Gateway"
            gateway
            packets={
              getPackets(
                "phone-bridge"
              )
            }
          />
      }
    }

  ];

  const edges = [

    {
      id: "e1",
      source: "alice",
      target: "bob",
      animated: true,
      label: "Bluetooth"
    },

    {
      id: "e2",
      source: "alice",
      target: "charlie",
      animated: true,
      label: "Bluetooth"
    },

    {
      id: "e3",
      source: "bob",
      target: "david",
      animated: true,
      label: "Bluetooth"
    },

    {
      id: "e4",
      source: "charlie",
      target: "bridge",
      animated: true,
      label: "Bluetooth"
    },

    {
      id: "e5",
      source: "david",
      target: "bridge",
      animated: true,
      label: "Bluetooth"
    }

  ];

  return (

    <div
      style={{
        width: "100%",
        height: "850px",
        background: "#111827",
        borderRadius: "20px"
      }}
    >

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />

    </div>

  );

}

export default MeshFlow;