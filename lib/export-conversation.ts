"use client";

interface Message {
  role: string;
  content: string;
  createdAt?: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function exportAsPDF(
  messages: Message[],
  title: string,
  userName: string
) {
  const html = `
    <html>
    <head>
      <title>${escapeHtml(title)} — Zari Conversation</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #1a1a2e; }
        h1 { font-size: 18px; color: #7c5cfc; margin-bottom: 4px; }
        .subtitle { font-size: 12px; color: #888; margin-bottom: 30px; }
        .msg { margin-bottom: 16px; padding: 12px 16px; border-radius: 12px; }
        .user { background: #f0edff; margin-left: 40px; }
        .assistant { background: #f5f5f7; margin-right: 40px; }
        .role { font-size: 11px; font-weight: 600; color: #7c5cfc; margin-bottom: 4px; }
        .role.user-role { color: #333; }
        .content { font-size: 14px; line-height: 1.6; }
        .footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <h1>Conversation with Zari</h1>
      <div class="subtitle">${escapeHtml(title)} — ${escapeHtml(userName)} — ${new Date().toLocaleDateString()}</div>
      ${messages
        .map(
          (m) => `
        <div class="msg ${m.role}">
          <div class="role ${m.role === "user" ? "user-role" : ""}">${m.role === "user" ? escapeHtml(userName) : "Zari"}</div>
          <div class="content">${escapeHtml(m.content).replace(/\n/g, "<br>")}</div>
        </div>
      `
        )
        .join("")}
      <div class="footer">Exported from Zari — zari.help</div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
