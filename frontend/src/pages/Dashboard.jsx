import HeroHeader from "../components/dashboard/HeroHeader";
import ControlCenter from "../components/dashboard/ControlCenter";
import MeshVisualization from "../components/mesh/MeshVisualization";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AccountBalances from "../components/dashboard/AccountBalances";
import DevicePanel from "../components/dashboard/DevicePanel";
import TransactionLedger from "../components/dashboard/TransactionLedger";
import SecurityDashboard from "../components/dashboard/SecurityDashboard";
import NetworkAnalytics from "../components/dashboard/NetworkAnalytics";
import SimulationStats from "../components/dashboard/SimulationStats";
import SettlementModal from "../components/dashboard/SettlementModal";
import AckFlow from "../components/dashboard/AckFlow";
import GlassCard from "../components/common/GlassCard";
import { useDashboard } from "../hooks/useDashboard";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const {
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
  } = useDashboard();

  return (
    <div className={styles.dashboard}>
      <HeroHeader stats={heroStats} />

      <section className={styles.section}>
        <ControlCenter
          sender={sender}
          receiver={receiver}
          amount={amount}
          phase={phase}
          loading={loading}
          onSenderChange={setSender}
          onReceiverChange={setReceiver}
          onAmountChange={setAmount}
          onInject={injectPacket}
          onGossip={runGossip}
          onFlush={flushGateway}
          onReset={resetNetwork}
        />
      </section>

      <section className={`${styles.section} ${styles.meshSection}`}>
        <GlassCard
          title="Mesh Network Visualization"
          subtitle="Interactive Bluetooth Mesh Topology"
          icon="🔗"
          glow
          className={styles.meshCard}
        >
          <div className={styles.meshInner}>
            <MeshVisualization
              mesh={mesh}
              activeRipples={activeRipples}
              packetAnimations={packetAnimations}
              onAnimationComplete={removePacketAnimation}
              gatewayUploading={phase === 2}
            />
          </div>
        </GlassCard>
      </section>

      <div className={styles.mainGrid}>
        <ActivityFeed events={events} />
        <div className={styles.sideStack}>
          <AccountBalances accounts={accounts} />
          <SimulationStats
            stats={stats}
            successRate={successRate}
            avgHopCount={avgHopCount}
          />
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <DevicePanel devices={deviceMonitoring} />
        <SecurityDashboard security={security} />
      </div>

      <section className={styles.section}>
        <NetworkAnalytics chartHistory={chartHistory} />
      </section>

      <section className={styles.section}>
        <TransactionLedger ledger={ledger} />
      </section>

      <footer className={styles.footer}>
        <strong>Offline UPI Mesh Network Simulator</strong>
        {" · "}
        Encrypted mesh-routed deferred settlement demo
      </footer>

      <SettlementModal
        data={settlementModal}
        onClose={() => setSettlementModal(null)}
      />
      <AckFlow ackFlow={ackFlow} />
    </div>
  );
}

export default Dashboard;
