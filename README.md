# ✨ Rephrase-It – Inline AI Rewriting for Chrome

Select any text on the web, right–click ➜ **Rephrase → Detailed / Concise / Professional** and the extension rewrites the selection in-place using OpenAI.  
Works in normal textareas, rich-text editors, **Monaco-based editors (e.g. AI Studio)**, and even bypasses the paste-to-file quirk in Perplexity.

---

## 💡 Features
- **Three tones** out-of-the-box: *Detailed, Concise, Professional*  
  (easily add more in `background.js` – just extend the `TONES` array).
- **Context-menu & keyboard shortcut** (`Ctrl + Shift + R`) for fast access.
- **Cross-editor support**  
  • Standard DOM selections  
  • Content-editable regions  
  • Monaco/VS Code Web instances  
  • Plain-text injection fallback to dodge Perplexity’s `paste.txt`.
- **Undo-safe** – uses native selection APIs or `executeEdits`, so *Ctrl + Z* just works.
- **Lightweight**: <5 KB JS, zero external libs.
- **Privacy-first**: the only network call is the one you initiate to OpenAI; no analytics.

---

## 📸 Preview

| Original | After **Rephrase → Concise** |
|----------|-----------------------------|
| Despite the myriad challenges presented by unprecedented global circumstances, ... | Despite global challenges, our resilient workforce achieved remarkable milestones. |

*(Add your own screenshots/gif in the `screens/` folder and link them here)*

---

## 🚀 Installation (Unpacked)

1. Clone / download this repo:  
   ```
   git clone https://github.com/your-user/rephrase-it.git
   ```
2. Visit `chrome://extensions`, enable **Developer mode**.
3. Click **Load unpacked** → select the project folder.
4. Click the puzzle-icon → *Rephrase-It → Options* → paste your **OpenAI API key**.
5. Highlight text anywhere → right-click → **Rephrase**.

---

## 🗝️ Setting the OpenAI Key

The key is stored with `chrome.storage.sync` (encrypted at-rest & synced across Chrome).  
You can also export it to an environment variable and inject at build time if you automate packaging.

---

## 🛠️ Development

```
npm i  # nothing to install yet – placeholder
```

Hot-reload workflow:

1. Edit any file (most commonly `background.js`).
2. Hit **↻** next to *Service Worker* in the Extensions page.
3. Refresh your target tab and test.

---

### File structure

```
rephrase-it/
├─ background.js   # service-worker: context-menu, OpenAI call, text replacement
├─ content.js      # toast / key-missing UI in page context
├─ options.html
├─ options.js
├─ manifest.json
└─ icons/
```

---

## 🏗️ Packing & Publishing

Chrome Web Store accepts a **ZIP**, not a CRX.

```
cd rephrase-it
zip -r ../rephrase-it.zip .
```

1. Create a developer account (one-time $5).
2. Upload `rephrase-it.zip` in the Developer Dashboard.
3. Fill out listing, privacy, screenshots → **Submit for review**.

*(For manual CRX sideload builds: go to `chrome://extensions` → **Pack extension**; keep the generated `.pem` to sign future updates.)*

---

## 🔒 Permissions explained

| Permission            | Why it’s needed                               |
|-----------------------|-----------------------------------------------|
| `contextMenus`        | Add “Rephrase → …” to the right-click menu.   |
| `scripting`           | Inject replacement code into the active tab.  |
| `activeTab`           | Access the user-selected tab for scripting.   |
| `storage`             | Save the OpenAI key in `chrome.storage.sync`. |

No host-permissions (`<all_urls>`) are requested; scripts run only in the tab you trigger.

---

## 📅 Roadmap

- [ ] Options page: allow custom tone presets + temperature slider  
- [ ] Local LLM fallback (e.g., via WebGPU & WebML)  
- [ ] Firefox Manifest V3 port  
- [ ] i18n for non-English rewrites

---

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch → `git checkout -b feat/my-awesome-idea`  
3. Commit your changes → `git commit -m 'feat: add my awesome idea'`  
4. Push to the branch → `git push origin feat/my-awesome-idea`  
5. Open a Pull Request

---


[8](https://github.com/SimGus/chrome-extension-v3-starter)
[9](https://chromewebstore.google.com/detail/bolt-to-github/pikdepbilbnnpgdkdaaoeekgflljmame?hl=en)
[10](https://cloud.google.com/blog/products/serverless/extending-cloud-code-with-custom-templates)
