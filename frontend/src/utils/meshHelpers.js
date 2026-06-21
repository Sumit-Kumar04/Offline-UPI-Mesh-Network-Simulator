import { DEVICES } from "../constants/meshConfig";

export function deviceIdToName(id) {
  const device = DEVICES.find((d) => d.id === id);
  return device ? device.name : id;
}

export function nameToDeviceId(name) {
  const device = DEVICES.find(
    (d) => d.name.toLowerCase() === name?.toLowerCase()
  );
  return device?.id ?? null;
}

export function nameToNodeId(name) {
  const device = DEVICES.find(
    (d) => d.name.toLowerCase() === name?.toLowerCase()
  );
  return device?.nodeId ?? null;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function truncateHash(hash, len = 12) {
  if (!hash) return "—";
  if (hash.length <= len) return hash;
  return `${hash.slice(0, len)}…`;
}

export function countActivePackets(mesh) {
  return mesh.reduce((sum, d) => sum + (d.packets?.length ?? 0), 0);
}

export function getGatewayOnline(mesh) {
  const gateway = mesh.find((d) => d.hasInternet);
  return !!gateway;
}

export function computeHopCount(senderName) {
  const hops = { Alice: 3, Bob: 2, Charlie: 1, David: 1 };
  return hops[senderName] ?? 2;
}

export function createEvent(type, message, meta = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    timestamp: new Date(),
    ...meta,
  };
}

export function mapFlushResultToLedgerEntry(item, index) {
  if (item.outcome === "SETTLED" && item.transaction) {
    const tx = item.transaction;
    return {
      id: tx._id ?? `tx-${index}`,
      transactionId: tx._id?.slice(-8)?.toUpperCase() ?? `TXN-${index}`,
      sender: tx.sender,
      receiver: tx.receiver,
      amount: tx.amount,
      status: "SETTLED",
      packetHash: tx.packetHash,
      settlementTime: tx.createdAt ?? new Date(),
      hopCount: computeHopCount(tx.sender),
      gatewayDevice: "Gateway",
    };
  }

  if (item.outcome === "DUPLICATE_DROPPED") {
    return {
      id: `dup-${Date.now()}-${index}`,
      transactionId: "—",
      sender: "—",
      receiver: "—",
      amount: 0,
      status: "DUPLICATE_DROPPED",
      packetHash: item.packetHash ?? "—",
      settlementTime: new Date(),
      hopCount: 0,
      gatewayDevice: "Gateway",
    };
  }

  return {
    id: `inv-${Date.now()}-${index}`,
    transactionId: "—",
    sender: "—",
    receiver: "—",
    amount: 0,
    status: "INVALID",
    packetHash: "—",
    settlementTime: new Date(),
    hopCount: 0,
    gatewayDevice: "Gateway",
    error: item.error,
  };
}

export function mapDbTransactionToLedger(tx) {
  return {
    id: tx._id,
    transactionId: tx._id?.slice(-8)?.toUpperCase() ?? "—",
    sender: tx.sender,
    receiver: tx.receiver,
    amount: tx.amount,
    status: "SETTLED",
    packetHash: tx.packetHash,
    settlementTime: tx.createdAt,
    hopCount: computeHopCount(tx.sender),
    gatewayDevice: "Gateway",
  };
}
