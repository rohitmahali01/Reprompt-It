/* global chrome */
import { OPENAI_MODELS, GEMINI_MODELS } from "./models.js";

const keyInput     = document.getElementById("key");
const gKeyInput    = document.getElementById("gkey");
const providerSel  = document.getElementById("provider");
const openaiSel    = document.getElementById("openaiModel");
const geminiSel    = document.getElementById("geminiModel");
const status       = document.getElementById("status");

/* populate model dropdowns */
OPENAI_MODELS.forEach(m => openaiSel.add(new Option(m.label, m.id)));
GEMINI_MODELS.forEach(m => geminiSel.add(new Option(m.label, m.id)));

/* load stored prefs */
chrome.storage.sync.get(
  ["OPENAI_KEY","GOOGLE_KEY","PROVIDER","OPENAI_MODEL","GEMINI_MODEL"],
  res => {
    if (res.OPENAI_KEY)   keyInput.value  = res.OPENAI_KEY;
    if (res.GOOGLE_KEY)   gKeyInput.value = res.GOOGLE_KEY;
    if (res.PROVIDER)     providerSel.value = res.PROVIDER;
    if (res.OPENAI_MODEL) openaiSel.value = res.OPENAI_MODEL;
    if (res.GEMINI_MODEL) geminiSel.value = res.GEMINI_MODEL;
  }
);

/* save handler */
document.getElementById("save").onclick = () => {
  chrome.storage.sync.set({
    OPENAI_KEY:   keyInput.value.trim(),
    GOOGLE_KEY:   gKeyInput.value.trim(),
    PROVIDER:     providerSel.value,
    OPENAI_MODEL: openaiSel.value,
    GEMINI_MODEL: geminiSel.value
  }, () => {
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
  });
};

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    switch(key) {
      case 'PROVIDER':
        document.getElementById('provider').value = newValue;
        break;
      case 'OPENAI_MODEL':
        document.getElementById('openaiModel').value = newValue;
        break;
      case 'OPENAI_KEY':
        document.getElementById('key').value = newValue;
        break;
      case 'GEMINI_MODEL':
        document.getElementById('geminiModel').value = newValue;
        break;
      case 'GOOGLE_KEY':
        document.getElementById('gkey').value = newValue;
        break;
    }
  }
});
