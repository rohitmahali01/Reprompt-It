# Rephrase-It Chrome Extension

<div align="center">

![Rephrase-It Logo](https://via.placeholder.com/150x150?text=Rephrase-It)

**Intelligent text rephrasing powered by OpenAI GPT and Google Gemini**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-0.5.1-green)](https://github.com/yourusername/rephrase-it)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Security](https://img.shields.io/badge/security-audited-green)](SECURITY_FIXES.md)

*Transform your writing with AI-powered rephrasing directly in your browser*

</div>

## Features

### Multi-AI Provider Support
- **OpenAI Integration**: GPT-4.1, GPT-4.1 Mini, and GPT-4.1 Nano models
- **Google Gemini**: 2.0 and 2.5 series models with multiple performance tiers
- **Seamless Switching**: Toggle between providers with `Ctrl+M`

### Smart Text Processing
- **Three Writing Styles**:
  - **Detailed**: Expand and elaborate on content
  - **Concise**: Summarize and compress text
  - **Professional**: Enhance tone and formality

### Universal Compatibility
- Standard web pages and forms
- Monaco Editor (VS Code online, CodePen, etc.)
- Text areas and input fields
- Rich text editors
- Content-editable elements

### Security & Privacy
- Secure local storage for API keys
- No data persistence or logging
- Input validation and sanitization
- XSS protection and response validation
- Minimal permissions principle

## Table of Contents

- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Supported Models](#-supported-models)
- [Security](#-security)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## Installation

### Option 1: From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) *(Coming Soon)*
2. Click "Add to Chrome"
3. Confirm the installation

### Option 2: Developer Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/rephrase-it.git
   cd rephrase-it
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `rephrase-it` directory

3. **Verify Installation**
   - Look for the Rephrase-It icon in your extensions toolbar
   - Right-click on any text to see the context menu options

## Configuration

### 1. API Key Setup

#### OpenAI Configuration
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

#### Google Gemini Configuration
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key (starts with `AIza`)

### 2. Extension Setup
1. **Access Settings**: Click the extension icon or right-click → "Options"
2. **Configure Provider**: Choose your default AI provider
3. **Add API Keys**: Paste your API keys in the respective fields
4. **Select Models**: Choose your preferred models for each provider
5. **Save Settings**: Click "Save" to store your configuration

### 3. Keyboard Shortcuts
- `Ctrl+Shift+R`: Open extension popup
- `Ctrl+M`: Toggle between OpenAI and Gemini providers

## Usage

### Basic Usage
1. **Select Text**: Highlight any text on a webpage
2. **Right-Click**: Open the context menu
3. **Choose Style**: Select "Rephrase → [Detailed/Concise/Professional]"
4. **Wait**: The text will be replaced with the rephrased version
5. **Success**: A notification will confirm the operation

### Advanced Usage

#### Monaco Editor Support
Works seamlessly with:
- VS Code for the Web
- CodePen
- JSFiddle
- GitHub Codespaces
- Any Monaco-based editor

#### Content-Editable Support
Compatible with:
- Gmail compose
- Notion
- Google Docs
- Medium editor
- WordPress editor

### Example Transformations

**Original**: "The cat is on the mat"

**Detailed**: "The domestic feline is currently positioned and resting comfortably on the woven floor covering"

**Concise**: "Cat on mat"

**Professional**: "The cat is positioned on the mat"

## Supported Models

### OpenAI Models
| Model | Description | Use Case |
|-------|-------------|----------|
| GPT-4.1 | Latest flagship model | Complex rephrasing, high quality |
| GPT-4.1 Mini | Balanced performance | General use, cost-effective |
| GPT-4.1 Nano | Fast responses | Quick rephrasing, simple tasks |

### Google Gemini Models
| Model | Description | Use Case |
|-------|-------------|----------|
| Gemini 2.5 Pro | Most capable model | Advanced rephrasing, complex text |
| Gemini 2.5 Flash | Fast and efficient | Balanced performance |
| Gemini 2.5 Flash-Lite | Lightweight version | Quick responses |
| Gemini 2.0 Flash | Previous generation | Reliable performance |
| Gemini 2.0 Flash-Lite | Lightweight legacy | Basic rephrasing |

## Security

This extension implements comprehensive security measures:

### Data Protection
- **Local Storage**: API keys stored locally, never synced
- **Input Validation**: All inputs sanitized and validated
- **Response Filtering**: AI responses checked for malicious content
- **Timeout Protection**: 30-second timeouts prevent hanging requests

### Privacy Guarantees
- **No Data Collection**: We don't store or log your text
- **No Analytics**: No tracking or usage analytics
- **No Third-Party Services**: Direct API communication only
- **Your Keys, Your Control**: You own and control your API keys

### Security Audit
See [SECURITY_FIXES.md](SECURITY_FIXES.md) for detailed security improvements and audit results.

## Development

### Prerequisites
- Node.js 16+ (for development tools)
- Chrome/Chromium browser
- Text editor or IDE

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/rephrase-it.git
cd rephrase-it

# Install development dependencies (optional)
npm install

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this directory
```

### Project Structure
```
rephrase-it/
├── manifest.json          # Extension manifest
├── background.js          # Service worker (main logic)
├── content.js            # Content script (UI notifications)
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── options.html          # Options page interface
├── options.js            # Options page functionality
├── models.js             # AI model definitions
├── README.md             # This file
├── SECURITY_FIXES.md     # Security documentation
└── LICENSE               # License file
```

### Building for Production
```bash
# Create a zip file for Chrome Web Store
zip -r rephrase-it-v0.5.1.zip . -x "*.git*" "node_modules/*" "*.md"
```

### Testing
1. **Manual Testing**: Load the extension and test with various text selections
2. **API Testing**: Verify with both OpenAI and Gemini APIs
3. **Security Testing**: Test input validation and error handling
4. **Browser Testing**: Test across different websites and editors

## Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed
- Follow security best practices

### Reporting Issues
- Use the [GitHub Issues](https://github.com/yourusername/rephrase-it/issues) page
- Include browser version, OS, and extension version
- Provide steps to reproduce the issue
- Include error messages if any

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Get Help
- **Email**: rohit.mahali633@gmail.com
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/rephrase-it/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/rephrase-it/discussions)

### FAQ

**Q: Is this extension free?**
A: The extension is free, but you need your own OpenAI or Google API keys, which have usage costs.

**Q: Are my API keys secure?**
A: Yes, keys are stored locally in your browser and never transmitted to our servers.

**Q: Can I use both OpenAI and Gemini?**
A: Yes, you can configure both and switch between them using `Ctrl+M`.

**Q: Does this work offline?**
A: No, an internet connection is required to communicate with AI APIs.

**Q: What data do you collect?**
A: We don't collect any data. All processing happens locally or directly with AI providers.

### System Requirements
- Chrome 88+ or Chromium-based browser
- Active internet connection
- Valid OpenAI or Google API key

---

<div align="center">

**Made with care for better writing**

[Star this repo](https://github.com/yourusername/rephrase-it) if you find it helpful!

</div>
