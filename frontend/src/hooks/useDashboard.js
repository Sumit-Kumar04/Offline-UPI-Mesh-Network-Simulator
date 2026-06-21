import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import { DEVICES, EVENT_TYPES, MESH_EDGES, USER_NAMES } from "../constants/meshConfig";
import {
  countActivePackets,
  createEvent,
  deviceIdToName,
  mapDbTransactionToLedger,
  mapFlushResultToLedgerEntry,
  nameToNodeId,
} from "../utils/meshHelpers";

const INITIAL_STATS = {
  packetsCreated: 0,
  packetsDelivered: 0,
  duplicateDropped: 0,
  settlements: 0,
  gossipRounds: 0,
  gatewayUploads: 0,
  hopCounts: [],
};

const INITIAL_SECURITY = {
  encryption: true,
  hashVerification: true,
  idempotency: true,
  replay: true,
  gatewayValidation: true,
};

export function useDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [mesh, setMesh] = useState([]);
  const [events, setEvents] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [security, setSecurity] = useState(INITIAL_SECURITY);
  const [phase, setPhase] = useState(0);
  const [sender, setSender] = useState("Alice");
  const [receiver, setReceiver] = useState("Bob");
  const [amount, setAmount] = useState("500");
  const [loading, setLoading] = useState(false);
  const [settlementModal, setSettlementModal] = useState(null);
  const [ackFlow, setAckFlow] = useState(null);
  const [activeRipples, setActiveRipples] = useState([]);
  const [packetAnimations, setPacketAnimations] = useState([]);
  const [gatewayStatus, setGatewayStatus] = useState("offline");
  const [chartHistory, setChartHistory] = useState({
    gossipRounds: [0],
    packetsPropagated: [0],
    settlements: [0],
    duplicates: [0],
    activeDevices: [5],
  });

  const addEvent = useCallback((type, message, meta = {}) => {
    setEvents((prev) => [createEvent(type, message, meta), ...prev].slice(0, 100));
  }, []);

  const triggerRipple = useCallback((nodeId) => {
    const id = `${nodeId}-${Date.now()}`;
    setActiveRipples((prev) => [...prev, { id, nodeId }]);
    setTimeout(() => {
      setActiveRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  }, []);

  const animatePackets = useCallback((paths, delay = 0) => {
    setTimeout(() => {
      const anims = paths.map((path, i) => ({
        id: `pkt-${Date.now()}-${i}`,
        ...path,
      }));
      setPacketAnimations((prev) => [...prev, ...anims]);
    }, delay);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [accountsRes, meshRes, txRes] = await Promise.all([
        API.get("/accounts"),
        API.get("/mesh/state"),
        API.get("/transactions").catch(() => ({ data: [] })),
      ]);
      setAccounts(accountsRes.data);
      setMesh(meshRes.data);
      const dbLedger = txRes.data.map(mapDbTransactionToLedger);
      setLedger((prev) => {
        const ids = new Set(dbLedger.map((t) => t.id));
        const sessionOnly = prev.filter((t) => !ids.has(t.id));
        return [...sessionOnly, ...dbLedger];
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (sender === receiver) {
      const other = USER_NAMES.find((n) => n !== sender);
      if (other) setReceiver(other);
    }
  }, [sender, receiver]);

  useEffect(() => {
    socket.on("packetInjected", () => {
      addEvent(EVENT_TYPES.PACKET_CREATED, "Packet injected into mesh network");
      loadData();
    });

    socket.on("gossipStarted", () => {
      addEvent(EVENT_TYPES.GOSSIP, "Gossip round initiated across mesh");
    });

    socket.on("packetSettled", (results) => {
      if (Array.isArray(results)) {
        results.forEach((item) => {
          if (item.outcome === "SETTLED") {
            addEvent(EVENT_TYPES.SETTLED, "Settlement successful via gateway");
          } else if (item.outcome === "DUPLICATE_DROPPED") {
            addEvent(EVENT_TYPES.DUPLICATE, "Duplicate packet dropped by idempotency guard");
          }
        });
      }
      loadData();
    });

    return () => {
      socket.off("packetInjected");
      socket.off("gossipStarted");
      socket.off("packetSettled");
    };
  }, [addEvent, loadData]);

  const injectPacket = async () => {
    if (!sender || !receiver || !amount) return;
    setLoading(true);
    try {
      const res = await API.post("/payments/send", {
        sender,
        receiver,
        amount: Number(amount),
      });

      setStats((s) => ({
        ...s,
        packetsCreated: s.packetsCreated + 1,
      }));

      setPhase(0);
      addEvent(
        EVENT_TYPES.PACKET_CREATED,
        `Packet created: ${sender} → ${receiver} ₹${amount}`,
        { sender, receiver, amount: Number(amount) }
      );

      const senderNode = nameToNodeId(sender);
      triggerRipple(senderNode);

      setChartHistory((h) => ({
        ...h,
        packetsPropagated: [...h.packetsPropagated.slice(-9), stats.packetsCreated + 1],
      }));

      await loadData();
      return res.data?.packet;
    } catch (err) {
      addEvent(EVENT_TYPES.INVALID, err.response?.data?.message ?? "Failed to inject packet");
      setSecurity((s) => ({ ...s, encryption: false }));
      setTimeout(() => setSecurity(INITIAL_SECURITY), 3000);
    } finally {
      setLoading(false);
    }
  };

  const runGossip = async () => {
    setLoading(true);
    setPhase(1);
    addEvent(EVENT_TYPES.GOSSIP, "Running gossip round — replicating packets via Bluetooth mesh");

    try {
      const prevMesh = [...mesh];
      const res = await API.post("/mesh/gossip");
      const newMesh = res.data;

    setStats((s) => ({
      ...s,
      gossipRounds: s.gossipRounds + 1,
    }));

    const propagationPaths = [];
    DEVICES.forEach((device) => {
      const prev = prevMesh.find((d) => d.id === device.id);
      const curr = newMesh.find((d) => d.id === device.id);
      const prevCount = prev?.packets?.length ?? 0;
      const currCount = curr?.packets?.length ?? 0;

      if (currCount > prevCount && device.nodeId !== nameToNodeId(sender)) {
        addEvent(
          EVENT_TYPES.RECEIVED,
          `${device.name} received packet via mesh`,
          { device: device.name }
        );
        triggerRipple(device.nodeId);

        const sourceNode = nameToNodeId(sender) ?? "alice";
        propagationPaths.push({
          edgeId: MESH_EDGES.find(
            (e) =>
              (e.source === sourceNode && e.target === device.nodeId) ||
              (e.target === sourceNode && e.source === device.nodeId)
          )?.id ?? "e1",
          sourceNode,
          targetNode: device.nodeId,
        });
      }
    });

    if (propagationPaths.length === 0) {
      MESH_EDGES.slice(0, 3).forEach((edge, i) => {
        animatePackets([{ edgeId: edge.id, sourceNode: edge.source, targetNode: edge.target }], i * 200);
      });
    } else {
      propagationPaths.forEach((path, i) => {
        animatePackets([path], i * 300);
      });
    }

    const totalPropagated = countActivePackets(newMesh);
    setStats((s) => ({ ...s, packetsDelivered: totalPropagated }));

    setChartHistory((h) => ({
      ...h,
      gossipRounds: [...h.gossipRounds.slice(-9), stats.gossipRounds + 1],
      packetsPropagated: [...h.packetsPropagated.slice(-9), totalPropagated],
      activeDevices: [
        ...h.activeDevices.slice(-9),
        newMesh.filter((d) => d.packets?.length > 0).length || 1,
      ],
    }));

      setMesh(newMesh);
    } catch (err) {
      addEvent(EVENT_TYPES.INVALID, err.response?.data?.message ?? "Gossip round failed");
    } finally {
      setLoading(false);
    }
  };

  const flushGateway = async () => {
    setLoading(true);
    setPhase(2);
    setGatewayStatus("connecting");
    addEvent(EVENT_TYPES.UPLOAD, "Gateway connecting — establishing uplink to backend");

    animatePackets(
      [{ edgeId: "e4", sourceNode: "charlie", targetNode: "bridge" },
       { edgeId: "e5", sourceNode: "david", targetNode: "bridge" }],
      0
    );

    triggerRipple("bridge");

    try {
      const res = await API.post("/mesh/flush");
      const results = res.data;

      if (!Array.isArray(results)) {
        addEvent(EVENT_TYPES.INVALID, results?.message ?? "No packets at gateway to upload");
        setGatewayStatus("offline");
        return;
      }

      setStats((s) => ({
        ...s,
        gatewayUploads: s.gatewayUploads + 1,
      }));

      let settledTx = null;

      results.forEach((item, index) => {
        const entry = mapFlushResultToLedgerEntry(item, index);
        setLedger((prev) => [entry, ...prev]);

        if (item.outcome === "SETTLED" && item.transaction) {
          settledTx = item.transaction;
          setPhase(3);
          setStats((s) => ({
            ...s,
            settlements: s.settlements + 1,
            hopCounts: [...s.hopCounts, entry.hopCount],
          }));

          addEvent(
            EVENT_TYPES.SETTLED,
            `Settlement successful: ${item.transaction.sender} → ${item.transaction.receiver} ₹${item.transaction.amount}`,
            { transaction: item.transaction }
          );

          setSettlementModal({
            amount: item.transaction.amount,
            sender: item.transaction.sender,
            receiver: item.transaction.receiver,
            transactionId: entry.transactionId,
            settlementTime: item.transaction.createdAt ?? new Date(),
            packetHash: item.transaction.packetHash,
          });

          setChartHistory((h) => ({
            ...h,
            settlements: [...h.settlements.slice(-9), stats.settlements + 1],
          }));
        } else if (item.outcome === "DUPLICATE_DROPPED") {
          setStats((s) => ({
            ...s,
            duplicateDropped: s.duplicateDropped + 1,
          }));
          addEvent(EVENT_TYPES.DUPLICATE, "Duplicate packet dropped — idempotency protection active");
          setChartHistory((h) => ({
            ...h,
            duplicates: [...h.duplicates.slice(-9), stats.duplicateDropped + 1],
          }));
        } else if (item.error) {
          addEvent(EVENT_TYPES.INVALID, `Invalid packet: ${item.error}`);
          setSecurity((s) => ({ ...s, gatewayValidation: false }));
          setTimeout(() => setSecurity(INITIAL_SECURITY), 4000);
        }
      });

      if (settledTx) {
        setTimeout(() => {
          setPhase(4);
          setAckFlow({
            sender: settledTx.sender,
            transactionId: settledTx._id?.slice(-8)?.toUpperCase(),
          });
          addEvent(
            EVENT_TYPES.ACK,
            `ACK sent to ${settledTx.sender} — settlement acknowledgement delivered`,
            { sender: settledTx.sender }
          );
          animatePackets(
            [{ edgeId: "e4", sourceNode: "bridge", targetNode: "charlie", reverse: true },
             { edgeId: "e2", sourceNode: "charlie", targetNode: "alice", reverse: true }],
            0
          );
          triggerRipple(nameToNodeId(settledTx.sender));
        }, 2000);

        setTimeout(() => setAckFlow(null), 6000);
        setTimeout(() => setSettlementModal(null), 8000);
      }

      await loadData();
      setGatewayStatus("online");
    } catch (err) {
      addEvent(EVENT_TYPES.INVALID, err.response?.data?.message ?? "Gateway flush failed");
      setGatewayStatus("offline");
    } finally {
      setLoading(false);
    }
  };

  const resetNetwork = async () => {
    setLoading(true);
    try {
      await API.post("/mesh/reset");
      setPhase(0);
      setGatewayStatus("offline");
      setStats(INITIAL_STATS);
      setEvents([]);
      setSettlementModal(null);
      setAckFlow(null);
      setPacketAnimations([]);
      setChartHistory({
        gossipRounds: [0],
        packetsPropagated: [0],
        settlements: [0],
        duplicates: [0],
        activeDevices: [5],
      });
      addEvent(EVENT_TYPES.RESET, "Network reset — all packets cleared, mesh state restored");
      const txRes = await API.get("/transactions").catch(() => ({ data: [] }));
      setLedger(txRes.data.map(mapDbTransactionToLedger));
      await loadData();
    } catch (err) {
      addEvent(EVENT_TYPES.INVALID, "Failed to reset network");
    } finally {
      setLoading(false);
    }
  };

  const removePacketAnimation = useCallback((id) => {
    setPacketAnimations((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const heroStats = useMemo(
    () => ({
      totalDevices: DEVICES.length,
      activePackets: countActivePackets(mesh),
      settledTransactions: stats.settlements,
      gatewayStatus,
    }),
    [mesh, stats.settlements, gatewayStatus]
  );

  const avgHopCount = useMemo(() => {
    if (stats.hopCounts.length === 0) return 0;
    return (
      stats.hopCounts.reduce((a, b) => a + b, 0) / stats.hopCounts.length
    ).toFixed(1);
  }, [stats.hopCounts]);

  const successRate = useMemo(() => {
    const total = stats.packetsCreated || 1;
    return Math.round((stats.settlements / total) * 100);
  }, [stats.packetsCreated, stats.settlements]);

  const deviceMonitoring = useMemo(() => {
    return DEVICES.map((device) => {
      const meshDevice = mesh.find((d) => d.id === device.id);
      const packetCount = meshDevice?.packets?.length ?? 0;
      const lastEvent = events.find(
        (e) =>
          e.message?.includes(device.name) ||
          e.meta?.device === device.name
      );

      return {
        ...device,
        status: packetCount > 0 ? "ACTIVE" : "IDLE",
        bluetoothConnected: true,
        internetAvailable: device.isGateway
          ? gatewayStatus === "online" || gatewayStatus === "connecting"
          : false,
        packetsHeld: packetCount,
        lastActivity: lastEvent?.timestamp ?? null,
      };
    });
  }, [mesh, events, gatewayStatus]);

  return {
    accounts,
    mesh,
    events,
    ledger,
    stats,
    security,
    phase,
    sender,
    receiver,
    amount,
    loading,
    settlementModal,
    ackFlow,
    activeRipples,
    packetAnimations,
    chartHistory,
    heroStats,
    avgHopCount,
    successRate,
    deviceMonitoring,
    setSender,
    setReceiver,
    setAmount,
    injectPacket,
    runGossip,
    flushGateway,
    resetNetwork,
    removePacketAnimation,
    setSettlementModal,
    deviceIdToName,
  };
}
