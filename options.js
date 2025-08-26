/* global chrome */
const keyInput = document.getElementById("key");
const status = document.getElementById("status");

chrome.storage.sync.get("OPENAI_KEY").then(({ OPENAI_KEY }) => {
  if (OPENAI_KEY) keyInput.value = OPENAI_KEY;
});

document.getElementById("save").onclick = () => {
  const key = keyInput.value.trim();
  chrome.storage.sync.set({ OPENAI_KEY: key }).then(() => {
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
  });
};
