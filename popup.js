/* popup.js */
const $ = id => document.getElementById(id);

document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    chrome.storage.sync.get([
        'defaultProvider',
        'openaiModel',
        'openaiKey',
        'geminiModel',
        'geminiKey'
    ], function(data) {
        if (data.defaultProvider) document.getElementById('default-provider').value = data.defaultProvider;
        if (data.openaiModel) document.getElementById('openai-model').value = data.openaiModel;
        if (data.openaiKey) document.getElementById('openai-key').value = data.openaiKey;
        if (data.geminiModel) document.getElementById('gemini-model').value = data.geminiModel;
        if (data.geminiKey) document.getElementById('gemini-key').value = data.geminiKey;
    });

    // Save settings
    document.getElementById('save').addEventListener('click', function() {
        const settings = {
            defaultProvider: document.getElementById('default-provider').value,
            openaiModel: document.getElementById('openai-model').value,
            openaiKey: document.getElementById('openai-key').value,
            geminiModel: document.getElementById('gemini-model').value,
            geminiKey: document.getElementById('gemini-key').value
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
      case 'defaultProvider':
        document.getElementById('default-provider').value = newValue;
        break;
      case 'openaiModel':
        document.getElementById('openai-model').value = newValue;
        break;
      case 'openaiKey':
        document.getElementById('openai-key').value = newValue;
        break;
      case 'geminiModel':
        document.getElementById('gemini-model').value = newValue;
        break;
      case 'geminiKey':
        document.getElementById('gemini-key').value = newValue;
        break;
    }
  }
});
