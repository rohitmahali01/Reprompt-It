/* popup.js */
const $ = id => document.getElementById(id);

document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    chrome.storage.sync.get([
        'PROVIDER',
        'OPENAI_MODEL',
        'OPENAI_KEY',
        'GEMINI_MODEL',
        'GOOGLE_KEY'
    ], function(data) {
        if (data.PROVIDER) document.getElementById('default-provider').value = data.PROVIDER;
        if (data.OPENAI_MODEL) document.getElementById('openai-model').value = data.OPENAI_MODEL;
        if (data.OPENAI_KEY) document.getElementById('openai-key').value = data.OPENAI_KEY;
        if (data.GEMINI_MODEL) document.getElementById('gemini-model').value = data.GEMINI_MODEL;
        if (data.GOOGLE_KEY) document.getElementById('gemini-key').value = data.GOOGLE_KEY;
    });

    // Save settings
    document.getElementById('save').addEventListener('click', function() {
        const settings = {
            PROVIDER: document.getElementById('default-provider').value,
            OPENAI_MODEL: document.getElementById('openai-model').value,
            OPENAI_KEY: document.getElementById('openai-key').value,
            GEMINI_MODEL: document.getElementById('gemini-model').value,
            GOOGLE_KEY: document.getElementById('gemini-key').value
        };

        chrome.storage.sync.set(settings, function() {
            const ok = document.getElementById('ok');
            ok.textContent = 'Saved!';
            setTimeout(() => ok.textContent = '', 2000);
        });
    });
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    switch(key) {
      case 'PROVIDER':
        document.getElementById('default-provider').value = newValue;
        break;
      case 'OPENAI_MODEL':
        document.getElementById('openai-model').value = newValue;
        break;
      case 'OPENAI_KEY':
        document.getElementById('openai-key').value = newValue;
        break;
      case 'GEMINI_MODEL':
        document.getElementById('gemini-model').value = newValue;
        break;
      case 'GOOGLE_KEY':
        document.getElementById('gemini-key').value = newValue;
        break;
    }
  }
});
