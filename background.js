/* Rephrase-It — background.js (v0.5.0) */

import { OPENAI_MODELS, GEMINI_MODELS } from "./models.js";

const TONES = ["Detailed", "Concise", "Professional","Human"];

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

/*──────── keyboard toggle ─────*/
chrome.commands.onCommand.addListener(async cmd => {
  if (cmd !== "toggle_provider") return;

  const { PROVIDER } = await chrome.storage.sync.get("PROVIDER");
  const next = PROVIDER === "gemini" ? "openai" : "gemini";
  await chrome.storage.sync.set({ PROVIDER: next });
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon128.png",
    title: "Rephrase-It",
    message: `Provider switched to ${next.toUpperCase()}`
  });
});

/*──────── main handler ────────*/
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const tone = info.menuItemId;

  /* 1️⃣ grab highlighted text */
  const [{ result: selected }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      /* DOM-range → Monaco → textarea fallbacks */
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

  /* 2️⃣ credentials & prefs */
  const {
    OPENAI_KEY, GOOGLE_KEY, PROVIDER = "openai",
    OPENAI_MODEL, GEMINI_MODEL
  } = await chrome.storage.sync.get([
    "OPENAI_KEY", "GOOGLE_KEY", "PROVIDER",
    "OPENAI_MODEL", "GEMINI_MODEL"
  ]);

  const useGemini = PROVIDER === "gemini";

  /* guardrails */
  if (useGemini && !GOOGLE_KEY) {
    alert("Rephrase-It ➜ Google API key is missing.");
    return;
  }
  if (!useGemini && !OPENAI_KEY) {
    alert("Rephrase-It ➜ OpenAI key is missing.");
    return;
  }

  const modelId = useGemini
    ? (GEMINI_MODEL || GEMINI_MODELS[0].id)
    : (OPENAI_MODEL || OPENAI_MODELS[0].id);

  /* 3️⃣ call provider */
  let rewritten = "";
  if (useGemini) {
    rewritten = await callGemini(GOOGLE_KEY, modelId, tone, selected);
  } else {
    rewritten = await callOpenAI(OPENAI_KEY, modelId, tone, selected);
  }
  if (!rewritten) return;

  /* 4️⃣ replace the selection */
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [rewritten],
    func: text => {
      /* plain-text insertion → Monaco → DOM-range → textarea */
      const el = document.activeElement;

      if (el && (el.isContentEditable || el.tagName === "TEXTAREA")) {
        el.focus();
        if (document.execCommand("insertText", false, text)) return;
      }

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

      const domSel = window.getSelection();
      if (domSel && domSel.rangeCount && domSel.toString()) {
        const range = domSel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        domSel.collapseToEnd();
        return;
      }

      if (el && typeof el.value === "string" && el.selectionStart !== undefined) {
        const { selectionStart: s, selectionEnd: e, value } = el;
        el.value = value.slice(0, s) + text + value.slice(e);
        el.selectionStart = el.selectionEnd = s + text.length;
      }
    }
  });

  /* 5️⃣ toast */
  try {
    chrome.tabs.sendMessage(tab.id, {
      toast: `Rephrased (${modelId}) as ${tone}.`
    });
  } catch {}
});

/*──────── helper functions ──────*/
async function callOpenAI(key, model, tone, prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            `Rewrite the following text in a ${tone} style. ` +
            `Return ONLY the rewritten text.`
        },
        { role: "user", content: prompt }
      ],
      max_tokens: Math.round(prompt.length * 1.4),
      temperature: 0.7
    })
  }).then(r => r.json());
  return res.choices?.[0]?.message?.content?.trim() || "";
}

async function callGemini(key, model, tone, prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `Rewrite the following text in a ${tone} style and Return ONLY the rewritten text:\n\n${prompt}` }
            ]
          }
        ],
        generationConfig: { temperature: 0.7 }
      })
    }
  ).then(r => r.json());
  return res.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}
