const STATUS_LABEL = { done: "Hoàn thành", waiting: "Đang chờ", progress: "Đang làm" };
const CAT_LABEL = {
  setup: "Thiết lập", shopify: "Shopify", payments: "Thanh toán",
  website: "Website", other: "Khác"
};

let allEntries = [];
let agents = [];
let activeAgent = "all";
let activeStatus = "all";
let query = "";

async function load() {
  try {
    const idx = await (await fetch("data/index.json")).json();
    agents = idx.agents || [];
    if (idx.store && idx.store.name) {
      document.getElementById("storeName").textContent = idx.store.name;
    }
    const files = await Promise.all(
      agents.map(a => fetch(a.file).then(r => r.json()).catch(() => null))
    );
    allEntries = [];
    files.forEach((data, i) => {
      if (!data || !Array.isArray(data.entries)) return;
      const agent = agents[i];
      data.entries.forEach(e => allEntries.push({ ...e, _agent: agent }));
      if (data.updated) {
        const el = document.getElementById("updated");
        if (el.textContent === "—" || data.updated > el.dataset.v) {
          el.dataset.v = data.updated;
          el.textContent = formatDateTime(data.updated);
        }
      }
    });
    allEntries.sort((a, b) => (b.date + (b.time || "")).localeCompare(a.date + (a.time || "")));
    renderChips();
    render();
  } catch (err) {
    document.getElementById("timeline").innerHTML =
      `<div class="card"><p>Không tải được dữ liệu. Hãy kiểm tra thư mục <code>data/</code>.</p></div>`;
  }
}

function formatDateTime(s) {
  try {
    const d = new Date(s);
    return d.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
  } catch { return s; }
}

function renderChips() {
  const ac = document.getElementById("agentChips");
  ac.innerHTML = "";
  const mk = (id, label, color) => {
    const b = document.createElement("button");
    b.className = "chip" + (activeAgent === id ? " active" : "");
    b.textContent = label;
    if (color && activeAgent !== id) b.style.borderColor = color;
    b.onclick = () => { activeAgent = id; renderChips(); render(); };
    ac.appendChild(b);
  };
  mk("all", "Tất cả");
  agents.forEach(a => mk(a.id, a.name, a.color));

  const sc = document.getElementById("statusChips");
  sc.innerHTML = "";
  const ms = (id, label) => {
    const b = document.createElement("button");
    b.className = "chip" + (activeStatus === id ? " active" : "");
    b.textContent = label;
    b.onclick = () => { activeStatus = id; renderChips(); render(); };
    sc.appendChild(b);
  };
  ms("all", "Mọi trạng thái");
  Object.entries(STATUS_LABEL).forEach(([k, v]) => ms(k, v));
}

function filtered() {
  return allEntries.filter(e => {
    if (activeAgent !== "all" && e._agent.id !== activeAgent) return false;
    if (activeStatus !== "all" && e.status !== activeStatus) return false;
    if (query) {
      const hay = [e.title, e.summary, (e.details || []).join(" "), (e.pending || []).join(" ")]
        .join(" ").toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function render() {
  const list = filtered();
  const tl = document.getElementById("timeline");
  document.getElementById("empty").hidden = list.length > 0;
  tl.innerHTML = list.map(e => {
    const st = STATUS_LABEL[e.status] || e.status;
    const cat = CAT_LABEL[e.category] || e.category || "";
    const details = (e.details || []).map(d => `<li>${escapeHtml(d)}</li>`).join("");
    const pend = (e.pending || []).map(p => `<li>${escapeHtml(p)}</li>`).join("");
    return `<article class="card">
      <div class="card-head">
        <h2>${escapeHtml(e.title)}</h2>
        <span class="badge ${e.status}">${escapeHtml(st)}</span>
      </div>
      <div class="meta">
        <span class="agent-tag" style="background:${e._agent.color || "#6366f1"}">${escapeHtml(e._agent.name)}</span>
        <span>📅 ${escapeHtml(e.date)}${e.time ? " · " + escapeHtml(e.time) : ""}</span>
        ${cat ? `<span class="cat">${escapeHtml(cat)}</span>` : ""}
      </div>
      <p class="summary">${escapeHtml(e.summary)}</p>
      ${details ? `<ul>${details}</ul>` : ""}
      ${pend ? `<div class="pending-box"><strong>⏳ Còn lại:</strong><ul>${pend}</ul></div>` : ""}
    </article>`;
  }).join("");

  const done = allEntries.filter(e => e.status === "done").length;
  const waiting = allEntries.filter(e => e.status === "waiting").length;
  document.getElementById("stats").innerHTML = `
    <div class="stat"><b>${allEntries.length}</b>đầu việc</div>
    <div class="stat"><b>${done}</b>hoàn thành</div>
    <div class="stat"><b>${waiting}</b>đang chờ</div>
    <div class="stat"><b>${agents.length}</b>AI tham gia</div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

document.getElementById("search").addEventListener("input", e => {
  query = e.target.value.trim().toLowerCase();
  render();
});

load();
