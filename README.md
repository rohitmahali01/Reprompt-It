# ✨ Rephrase-It — Inline AI Rewriting for Chrome

Select any text on the web, right-click → **Rephrase → Detailed / Concise / Professional** and the extension rewrites the selection *in-place* using either **OpenAI ChatGPT** or **Google Gemini**—you choose.

Works in normal textareas, rich-text editors, **Monaco-based editors (e.g. AI Studio)**, and even sidesteps Perplexity’s *paste.txt* quirk.

---

## 💡 Features
* **Two providers** — OpenAI (GPT-4.1.x) *or* Google Gemini 2.x.  
  Switch in Options or hit **Ctrl + Shift + M** to flip instantly.
* **Model pickers** — choose any exposed GPT/Gemini version; defaults are stored per provider.
* **Three tones** out-of-the-box: *Detailed, Concise, Professional*  
  (add more by extending `TONES` in `background.js`).
* **Context-menu & keyboard shortcut** (`Ctrl + Shift + R`) for one-click rewrites.
* **Cross-editor support**  
  • Standard DOM selections  
  • `contenteditable` regions  
  • Monaco / VS Code Web instances  
  • Plain-text injection fallback for Perplexity.
* **Undo-safe** — uses native selection APIs or `executeEdits`, so **Ctrl + Z** just works.
* **Lightweight** — < 8 KB JS, zero external libs.
* **Privacy-first** — the only outbound request is the one you initiate to the chosen AI API.

---

## 📸 Preview
| Original | After **Rephrase → Concise** |
|----------|------------------------------|
| Despite the myriad challenges presented by unprecedented global circumstances, ... | Despite numerous unprecedented global challenges... |

*(Add your own screenshots/GIFs in the `screens/` folder and link them here.)*

---

## 🚀 Installation (Unpacked)
1. Clone / download this repo  
   ```
   git clone https://github.com/your-user/rephrase-it.git
   ```
2. Visit `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** → select the project folder.
4. Click the puzzle-icon → *Rephrase-It → Options* →  

   • Paste your **OpenAI API key** (starts with `sk-`)  
   • Paste your **Google API key** (starts with `AIza…`) *optional*  
   • Pick the **Provider** and default **model** you want.
5. Highlight text anywhere → right-click → **Rephrase**.

---

## 🗝️ API Keys & Storage
Keys and preferences live in `chrome.storage.sync` (encrypted at rest and synced across Chrome).  
Nothing is transmitted anywhere except directly to the OpenAI / Google endpoints you invoke.

---

## 🎛️ Options
| Setting         | Description                                                     |
|-----------------|-----------------------------------------------------------------|
| Provider        | `OpenAI (ChatGPT)` or `Gemini`                                  |
| OpenAI model    | Any GPT-4.1.x alias you whitelisted in `models.js`              |
| Gemini model    | Any Gemini 2.x alias you whitelisted in `models.js`             |
| Keys            | Store both API keys simultaneously; the selected provider is used |

Keyboard toggles:  
* **Ctrl + Shift + R** — show Rephrase menu (Chrome command)  
* **Ctrl + Shift + M** — flip Provider (OpenAI ↔ Gemini) and show a toast

---

## 🛠️ Development
```
npm i   # (placeholder — no deps yet)
```
Hot-reload workflow:
1. Edit any file (most commonly `background.js` or `models.js`).
2. Click **⟳ Reload** next to *Rephrase-It* in `chrome://extensions`.
3. Refresh your target tab and test.

### File structure
```
rephrase-it/
├─ background.js    # service-worker: context-menu, provider calls, text replacement
├─ content.js       # toast / key-missing UI in page context
├─ models.js        # centralized model lists
├─ options.html     # preferences UI
├─ options.js
├─ manifest.json
└─ icons/
```

---

## 🔒 Permissions
| Permission      | Why it’s needed                                   |
|-----------------|---------------------------------------------------|
| `contextMenus`  | Add “Rephrase → …” to the right-click menu.       |
| `commands`      | Listen for keyboard shortcuts.                    |
| `scripting`     | Inject replacement code into the active tab.      |
| `activeTab`     | Access the user-selected tab for scripting.       |
| `storage`       | Persist API keys and preferences.                 |

No host permissions (`<all_urls>`) are requested; scripts run only in the tab you trigger.

---

## 📅 Roadmap
- [ ] Custom tone presets + temperature slider  
- [ ] Local LLM fallback (WebGPU / WebML)  
- [ ] Firefox Manifest V3 port  
- [ ] i18n for non-English rewrites

---

## 🤝 Contributing
1. Fork the repo.  
2. Create your feature branch → `git checkout -b feat/my-awesome-idea`.  
3. Commit your changes → `git commit -m 'feat: add my awesome idea'`.  
4. Push to the branch → `git push origin feat/my-awesome-idea`.  
5. Open a Pull Request.

---

Made with ❤️ by *Rohit Mahali* — happy prompting!
