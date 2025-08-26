/*  Rephrase-It  —  background.js  (v0.3.1)
    Adds plain-text insertion (execCommand) + silences the
    “Receiving end does not exist” warning by wrapping the two
    chrome.tabs.sendMessage() calls in try/catch. */

const TONES = ["Detailed", "Concise", "Professional"];

/*──────── context-menu ────────*/
chrome.runtime.onInstalled.addListener(() => {
  TONES.forEach(tone =>
    chrome.contextMenus.create({
      id: tone,
      title: `Rephrase → ${tone}`,
      contexts: ["selection"]
    })
  );
});

/*──────── Monaco helpers ──────*/
function getMonacoEditorInstance(el) {
  while (el && !el.classList?.contains("monaco-editor")) el = el.parentElement;
  return el?.__monacoEditor || el?.__vue_monaco_editor__ || null;
}

/*──────── main handler ────────*/
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const tone = info.menuItemId;

  /* 1️⃣  grab highlighted text */
  const [{ result: selected }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const domSel = window.getSelection();
      if (domSel && domSel.toString()) return domSel.toString();

      const mSel = (() => {
        let el = document.activeElement;
        while (el && !el.classList?.contains("monaco-editor"))
          el = el.parentElement;
        const editor = el?.__monacoEditor || el?.__vue_monaco_editor__;
        if (!editor) return "";
        const model = editor.getModel?.();
        const sel   = editor.getSelection?.();
        return model && sel ? model.getValueInRange(sel) : "";
      })();
      if (mSel) return mSel;

      const el = document.activeElement;
      if (el && typeof el.value === "string" && el.selectionStart !== undefined)
        return el.value.slice(el.selectionStart, el.selectionEnd);

      return "";
    }
  });
  if (!selected) return;

  /* 2️⃣  API key */
  const { OPENAI_KEY } = await chrome.storage.sync.get("OPENAI_KEY");
  if (!OPENAI_KEY) {
    try {
      chrome.tabs.sendMessage(tab.id, { error: "NO_KEY" });
    } catch { /* no listener on this page – ignore */ }
    return;
  }

  /* 3️⃣  call OpenAI */
  const raw = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content:
            `Rewrite the following text in a ${tone} style. ` +
            `Return ONLY the rewritten text—no quotes or extra lines.`
        },
        { role: "user", content: selected }
      ],
      max_tokens: Math.round(selected.length * 1.4),
      temperature: 0.7
    })
  }).then(r => r.json());

  const rewritten = (raw.choices?.[0]?.message?.content || "").trim();
  if (!rewritten) return;

  /* 4️⃣  replace the selection */
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [rewritten],
    func: text => {
      /* a) plain-text insertion (Perplexity) */
      const el = document.activeElement;
      if (el && (el.isContentEditable || el.tagName === "TEXTAREA")) {
        el.focus();
        try {
          if (document.execCommand("insertText", false, text)) return;
        } catch { /* fall through */ }
      }

      /* b) Monaco editor (AI-Studio) */
      const tryMonaco = () => {
        let node = document.activeElement;
        while (node && !node.classList?.contains("monaco-editor"))
          node = node.parentElement;
        const editor = node?.__monacoEditor || node?.__vue_monaco_editor__;
        if (!editor) return false;

        const sel = editor.getSelection();
        if (!sel) return false;

        let range = sel;
        if (sel.endColumn === 1) {
          const prev = sel.endLineNumber - 1;
          range = sel.setEndPosition(
            prev,
            editor.getModel().getLineMaxColumn(prev)
          );
        }
        editor.executeEdits("rephrase-it", [
          { range, text: text.trimEnd(), forceMoveMarkers: true }
        ]);
        return true;
      };
      if (tryMonaco()) return;

      /* c) DOM range */
      const domSel = window.getSelection();
      if (domSel && domSel.rangeCount && domSel.toString()) {
        const range = domSel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        domSel.collapseToEnd();
        return;
      }

      /* d) textarea / input */
      if (el && typeof el.value === "string" && el.selectionStart !== undefined) {
        const { selectionStart: s, selectionEnd: e, value } = el;
        el.value = value.slice(0, s) + text + value.slice(e);
        el.selectionStart = el.selectionEnd = s + text.length;
      }
    }
  });

  /* 5️⃣  toast */
  try {
    chrome.tabs.sendMessage(tab.id, { toast: `Rephrased as ${tone}.` });
  } catch { /* no listener on this page – ignore */ }
});
