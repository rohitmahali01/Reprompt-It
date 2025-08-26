/* global chrome */
(function () {
  // Listen for messages from background to show toast or errors
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.error === "NO_KEY") {
      alert("Rephrase-It ➜ Please set your OpenAI API key in the extension’s Options page.");
    } else if (msg.toast) {
      const div = Object.assign(document.createElement("div"), {
        textContent: msg.toast,
        style: `
          position:fixed;bottom:20px;right:20px;
          background:#323232;color:#fff;padding:8px 14px;
          border-radius:4px;font-size:13px;z-index:2147483647;
          opacity:0;transition:opacity .3s
        `
      });
      document.body.appendChild(div);
      requestAnimationFrame(() => (div.style.opacity = "1"));
      setTimeout(() => {
        div.style.opacity = "0";
        setTimeout(() => div.remove(), 300);
      }, 2200);
    }
  });
})();
