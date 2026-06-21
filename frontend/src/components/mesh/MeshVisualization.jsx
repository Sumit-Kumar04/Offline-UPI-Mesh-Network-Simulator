import { useMemo, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import DeviceNode from "./DeviceNode";
import AnimatedEdge from "./AnimatedEdge";
import PacketParticle from "./PacketParticle";
import { DEVICES, MESH_EDGES } from "../../constants/meshConfig";
import styles from "./MeshVisualization.module.css";

const nodeTypes = { deviceNode: DeviceNode };
const edgeTypes = { animated: AnimatedEdge };

const NODE_POSITIONS = {
  alice: { x: 80, y: 60 },
  bob: { x: 480, y: 60 },
  charlie: { x: 80, y: 280 },
  david: { x: 480, y: 280 },
  bridge: { x: 280, y: 480 },
};

function MeshVisualizationInner({
  mesh = [],
  activeRipples = [],
  packetAnimations = [],
  onAnimationComplete,
  gatewayUploading = false,
}) {
  const getPackets = useCallback(
    (id) => {
      const device = mesh.find((d) => d.id === id);
      return device ? device.packets.length : 0;
    },
    [mesh]
  );

  const ripplingNodes = useMemo(
    () => new Set(activeRipples.map((r) => r.nodeId)),
    [activeRipples]
  );

  const activeEdges = useMemo(
    () => new Set(packetAnimations.map((p) => p.edgeId)),
    [packetAnimations]
  );

  const nodes = useMemo(
    () =>
      DEVICES.map((device) => ({
        id: device.nodeId,
        type: "deviceNode",
        position: NODE_POSITIONS[device.nodeId],
        data: {
          name: device.name,
          packets: getPackets(device.id),
          gateway: device.isGateway,
          rippling: ripplingNodes.has(device.nodeId),
        },
      })),
    [getPackets, ripplingNodes]
  );

  const edges = useMemo(
    () =>
      MESH_EDGES.map((edge) => ({
        ...edge,
        type: "animated",
        label: "Bluetooth",
        labelStyle: { fill: "#64748b", fontSize: 10 },
        labelBgStyle: { fill: "transparent" },
        data: { active: activeEdges.has(edge.id) },
      })),
    [activeEdges]
  );

  return (
    <div className={styles.container}>
      {gatewayUploading && (
        <div className={styles.uploadIndicator}>
          <span className={styles.uploadPulse} />
          Uploading to backend…
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        className={styles.flow}
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => (n.data?.gateway ? "#22c55e" : "#3b82f6")}
          maskColor="rgba(3, 7, 18, 0.8)"
          style={{ background: "rgba(15, 23, 42, 0.8)" }}
        />
      </ReactFlow>

      {packetAnimations.map((anim) => (
        <PacketParticle
          key={anim.id}
          sourceNode={anim.sourceNode}
          targetNode={anim.targetNode}
          reverse={anim.reverse}
          onComplete={() => onAnimationComplete(anim.id)}
        />
      ))}

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.bluetooth}`} />
          Bluetooth Mesh
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.gatewayDot}`} />
          Gateway
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.packetDot}`} />
          Active Packet
        </div>
      </div>
    </div>
  );
}

function MeshVisualization(props) {
  return (
    <ReactFlowProvider>
      <MeshVisualizationInner {...props} />
    </ReactFlowProvider>
  );
}

export default MeshVisualization;
