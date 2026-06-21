import { useMemo, useState } from "react";
import GlassCard from "../common/GlassCard";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatTime, truncateHash } from "../../utils/meshHelpers";
import styles from "./TransactionLedger.module.css";

const PAGE_SIZE = 5;
const COLUMNS = [
  { key: "transactionId", label: "Transaction ID" },
  { key: "sender", label: "Sender" },
  { key: "receiver", label: "Receiver" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "packetHash", label: "Packet Hash" },
  { key: "settlementTime", label: "Settlement Time" },
  { key: "hopCount", label: "Hop Count" },
  { key: "gatewayDevice", label: "Gateway" },
];

function TransactionLedger({ ledger }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("settlementTime");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = [...ledger];

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.transactionId?.toLowerCase().includes(q) ||
          r.sender?.toLowerCase().includes(q) ||
          r.receiver?.toLowerCase().includes(q) ||
          r.packetHash?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      rows = rows.filter((r) => r.status === statusFilter);
    }

    rows.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [ledger, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <GlassCard title="Transaction Ledger" subtitle="Settlement Records" icon="📊">
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search by ID, sender, receiver, hash…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
        <select
          className={styles.filter}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
        >
          <option value="ALL">All Status</option>
          <option value="SETTLED">Settled</option>
          <option value="DUPLICATE_DROPPED">Duplicate Dropped</option>
          <option value="INVALID">Invalid</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key && (
                    <span className={styles.sortIcon}>
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.empty}>
                  No transactions recorded yet
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr key={row.id}>
                  <td>{row.transactionId}</td>
                  <td>{row.sender}</td>
                  <td>{row.receiver}</td>
                  <td className={styles.amount}>
                    {row.amount ? formatCurrency(row.amount) : "—"}
                  </td>
                  <td><StatusBadge status={row.status} /></td>
                  <td className={styles.hash}>{truncateHash(row.packetHash, 16)}</td>
                  <td>{formatTime(row.settlementTime)}</td>
                  <td>{row.hopCount}</td>
                  <td>{row.gatewayDevice}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>
          Showing {paged.length} of {filtered.length} records
        </span>
        <div className={styles.pageBtns}>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export default TransactionLedger;
