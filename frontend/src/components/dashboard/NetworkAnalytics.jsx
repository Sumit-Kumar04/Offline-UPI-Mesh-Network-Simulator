import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import GlassCard from "../common/GlassCard";
import styles from "./NetworkAnalytics.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      borderColor: "rgba(148, 163, 184, 0.2)",
      borderWidth: 1,
      titleColor: "#f1f5f9",
      bodyColor: "#94a3b8",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(148, 163, 184, 0.06)" },
      ticks: { color: "#64748b", font: { size: 10 } },
    },
    y: {
      grid: { color: "rgba(148, 163, 184, 0.06)" },
      ticks: { color: "#64748b", font: { size: 10 } },
      beginAtZero: true,
    },
  },
};

function makeLabels(len) {
  return Array.from({ length: len }, (_, i) => `R${i + 1}`);
}

function NetworkAnalytics({ chartHistory }) {
  const len = Math.max(
    chartHistory.gossipRounds.length,
    chartHistory.packetsPropagated.length,
    5
  );
  const labels = makeLabels(len);

  const gossipData = {
    labels,
    datasets: [
      {
        label: "Gossip Rounds",
        data: chartHistory.gossipRounds,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  const propagationData = {
    labels,
    datasets: [
      {
        label: "Packets Propagated",
        data: chartHistory.packetsPropagated,
        backgroundColor: "rgba(139, 92, 246, 0.6)",
        borderColor: "#8b5cf6",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const settlementData = {
    labels,
    datasets: [
      {
        label: "Settlements",
        data: chartHistory.settlements,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: "Duplicates",
        data: chartHistory.duplicates,
        borderColor: "#eab308",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const devicesData = {
    labels,
    datasets: [
      {
        label: "Active Devices",
        data: chartHistory.activeDevices,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  return (
    <GlassCard title="Network Analytics" subtitle="Simulation Metrics" icon="📈">
      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Gossip Rounds</div>
          <div className={styles.chartContainer}>
            <Line data={gossipData} options={CHART_DEFAULTS} />
          </div>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Packets Propagated</div>
          <div className={styles.chartContainer}>
            <Bar data={propagationData} options={CHART_DEFAULTS} />
          </div>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Settlements vs Duplicates</div>
          <div className={styles.chartContainer}>
            <Line
              data={settlementData}
              options={{
                ...CHART_DEFAULTS,
                plugins: {
                  ...CHART_DEFAULTS.plugins,
                  legend: {
                    display: true,
                    labels: { color: "#94a3b8", boxWidth: 12, font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Active Devices</div>
          <div className={styles.chartContainer}>
            <Line data={devicesData} options={CHART_DEFAULTS} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default NetworkAnalytics;
