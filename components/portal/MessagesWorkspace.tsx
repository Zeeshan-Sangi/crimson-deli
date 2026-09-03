"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ActionMenu from "./ActionMenu";
import { formatPhone } from "@/lib/format/phone";
import type { ContactMessage } from "@/lib/messages/types";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesWorkspace({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"open" | "handled" | "all">("open");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (view === "open" && m.handledAt) return false;
      if (view === "handled" && !m.handledAt) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q)
      );
    });
  }, [messages, query, view]);

  async function send(method: "PATCH" | "DELETE", body: Record<string, unknown>, key: string) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not update the message.");
        return false;
      }
      setConfirming(null);
      router.refresh();
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  const unhandled = messages.filter((m) => !m.handledAt).length;

  return (
    <>
      {error && <p className="portal-note">{error}</p>}

      <div className="portal-stats">
        <div className="crm-stat">
          <div className="crm-stat__label">Needs a reply</div>
          <div className="crm-stat__value">{unhandled}</div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Total received</div>
          <div className="crm-stat__value">{messages.length}</div>
        </div>
      </div>

      <div className="crm-toolbar">
        <input
          type="search"
          placeholder="Search name, email, subject or wording…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search messages"
        />
        <select
          value={view}
          onChange={(e) => setView(e.target.value as "open" | "handled" | "all")}
          aria-label="Filter messages"
        >
          <option value="open">Needs a reply</option>
          <option value="handled">Handled</option>
          <option value="all">All messages</option>
        </select>
        <span className="portal-muted" style={{ fontSize: 13 }}>
          {filtered.length} of {messages.length}
        </span>
      </div>

      <section className="crm-card">
        <div className="crm-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>When</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="crm-empty">
                    {messages.length === 0
                      ? "No messages yet. Anything sent from the contact form lands here."
                      : "Nothing matches that filter."}
                  </td>
                </tr>
              )}

              {filtered.map((m) => (
                <tr key={m.id}>
                  <td data-label="From">
                    <strong>{m.name}</strong>
                    <span className="portal-muted d-block" style={{ fontSize: 13 }}>
                      {m.email}
                      {m.phone ? ` · ${formatPhone(m.phone)}` : ""}
                    </span>
                  </td>
                  <td data-label="Subject">
                    <strong>{m.subject}</strong>
                    <span className="portal-muted d-block" style={{ fontSize: 13 }}>
                      {open === m.id ? m.body : `${m.body.slice(0, 90)}${m.body.length > 90 ? "…" : ""}`}
                    </span>
                  </td>
                  <td data-label="When" style={{ whiteSpace: "nowrap" }}>{when(m.createdAt)}</td>
                  <td data-label="Status">
                    <span
                      className={`portal-badge ${m.handledAt ? "portal-badge-packed" : "portal-badge-new"}`}
                    >
                      {m.handledAt ? "Handled" : "Open"}
                    </span>
                  </td>
                  <td data-cell="actions" style={{ textAlign: "right" }}>
                    {confirming === m.id ? (
                      <div className="crm-actions crm-actions--confirm">
                        <span className="portal-muted" style={{ fontSize: 13 }}>
                          Delete this message?
                        </span>
                        <button
                          type="button"
                          className="portal-btn portal-btn-danger"
                          disabled={busy === m.id}
                          onClick={() => send("DELETE", { id: m.id }, m.id)}
                        >
                          {busy === m.id ? "Deleting…" : "Yes, delete"}
                        </button>
                        <button
                          type="button"
                          className="portal-btn"
                          onClick={() => setConfirming(null)}
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <ActionMenu
                        label={`Actions for message from ${m.name}`}
                        actions={[
                          {
                            label: open === m.id ? "Collapse" : "Read full message",
                            onSelect: () => setOpen(open === m.id ? null : m.id),
                          },
                          {
                            label: "Reply by email",
                            onSelect: () => {
                              window.location.href = `mailto:${m.email}?subject=${encodeURIComponent(
                                `Re: ${m.subject}`,
                              )}`;
                            },
                          },
                          {
                            label: m.handledAt ? "Mark as open" : "Mark handled",
                            disabled: busy === m.id,
                            onSelect: () =>
                              send("PATCH", { id: m.id, handled: !m.handledAt }, m.id),
                          },
                          {
                            label: "Delete",
                            danger: true,
                            onSelect: () => setConfirming(m.id),
                          },
                        ]}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
