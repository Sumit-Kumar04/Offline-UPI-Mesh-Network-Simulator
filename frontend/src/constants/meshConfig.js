export const DEVICES = [
  { id: "phone-alice", name: "Alice", nodeId: "alice", hasInternet: false },
  { id: "phone-bob", name: "Bob", nodeId: "bob", hasInternet: false },
  { id: "phone-charlie", name: "Charlie", nodeId: "charlie", hasInternet: false },
  { id: "phone-david", name: "David", nodeId: "david", hasInternet: false },
  { id: "phone-bridge", name: "Gateway", nodeId: "bridge", hasInternet: true, isGateway: true },
];

export const USER_NAMES = DEVICES.filter((d) => !d.isGateway).map((d) => d.name);

export const PHASES = [
  { id: "created", label: "Packet Created", icon: "📤" },
  { id: "gossiping", label: "Gossiping", icon: "📡" },
  { id: "upload", label: "Gateway Upload", icon: "🌐" },
  { id: "settlement", label: "Settlement", icon: "✅" },
  { id: "ack", label: "Acknowledgement", icon: "📩" },
];

export const MESH_EDGES = [
  { id: "e1", source: "alice", target: "bob" },
  { id: "e2", source: "alice", target: "charlie" },
  { id: "e3", source: "bob", target: "david" },
  { id: "e4", source: "charlie", target: "bridge" },
  { id: "e5", source: "david", target: "bridge" },
];

export const EVENT_TYPES = {
  PACKET_CREATED: "packet_created",
  GOSSIP: "gossip",
  RECEIVED: "received",
  GATEWAY: "gateway",
  UPLOAD: "upload",
  DUPLICATE: "duplicate",
  INVALID: "invalid",
  SETTLED: "settled",
  ACK: "ack",
  RESET: "reset",
};

export const SECURITY_FEATURES = [
  { id: "encryption", label: "AES Encryption", key: "encryption" },
  { id: "hash", label: "Hash Verification", key: "hashVerification" },
  { id: "idempotency", label: "Idempotency Protection", key: "idempotency" },
  { id: "replay", label: "Replay Protection", key: "replay" },
  { id: "gateway", label: "Gateway Validation", key: "gatewayValidation" },
];
