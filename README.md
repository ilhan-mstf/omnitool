# 🛠️ Omnitool

**The high-performance, native, and privacy-first developer powerhouse.**

[![Release](https://img.shields.io/github/v/tag/ilhan-mstf/omnitool?label=version&color=3b82f6)](https://github.com/ilhan-mstf/omnitool/releases)
[![License](https://img.shields.io/badge/license-Non--Commercial-orange)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-white)](https://github.com/ilhan-mstf/omnitool/releases)

Stop pasting sensitive data into untrusted websites. **Omnitool** is a native desktop application built with **Rust (Tauri)** and **React** that brings all your essential developer utilities into a single, offline-first workflow engine.

[**🌐 Visit Website**](https://ilhan-mstf.github.io/omnitool/) | [**📥 Download Latest**](https://github.com/ilhan-mstf/omnitool/releases)

---

## ✨ The "Killer" Features

### 🔗 Omni-Chains™
Don't just use one tool—build a workflow. Omni-Chains allow you to **pipe** the output of one utility directly into the next. 
*   *Example:* `Base64 Decode ➔ JSON Format ➔ URL Encode`
*   No more manual copy-pasting between separate websites or tabs.

### 🧠 Smart Detection
Omnitool watches your clipboard (100% locally). When you copy a JWT, a JSON string, or a Base64 blob, the app automatically badges the correct tool and provides a **"Magic Open"** suggestion to handle the data instantly.

### ⚡ Command Palette (⌘ + K)
Navigate the entire app without leaving your keyboard. Hit `⌘+K` (or `Ctrl+K`) to fuzzy-search through tools, recent activity, and smart suggestions.

### 🔒 Privacy by Design
*   **100% Offline:** All transformations happen on your machine.
*   **Zero Telemetry:** We don't track what you format or decode.
*   **Native Speed:** Built with Rust for a tiny memory footprint and instant startup.

---

## 🛠️ Current Toolbox

| Category | Tools |
| :--- | :--- |
| **Encoders** | Base64, URL Encoder/Decoder |
| **Formatters** | JSON Formatter & Validator |
| **Converters** | *More coming soon (JWT, Unix Timestamp)* |
| **Generators** | *More coming soon (UUID, Lorem Ipsum)* |

---

## 🚀 Getting Started

1.  **Download** the binary for your OS from the [Releases](https://github.com/ilhan-mstf/omnitool/releases) page.
2.  **Install** and launch.
3.  **macOS Note:** As this is a Beta build, you may see a security warning. To open: **Right-click** the app icon, select **Open**, and click **Open** again in the dialog. (Alternatively, go to System Settings > Privacy & Security and click "Open Anyway").
4.  **Use ⌘+K** to find your first tool.
4.  **Copy** some JSON and watch the **Smart Suggestion** appear!

---

## 🏗️ Development

Omnitool is built with the **Tauri v2** stack.

```bash
# Clone the repo
git clone https://github.com/ilhan-mstf/omnitool.git

# Enter app directory
cd omnitool/omnitool

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Testing
We take stability seriously.
```bash
# Run Backend (Rust) tests
cd src-tauri && cargo test

# Run Frontend (Vitest) tests
npm run test
```

---

## 🗺️ Roadmap
- [ ] **Local AI Integration:** Use Ollama/LlamaEdge for local code explanation.
- [ ] **JWT Debugger:** Deep inspection of header, payload, and signature.
- [ ] **Shared Workflows:** Export and import custom Omni-Chains.
- [ ] **Extension System:** Create your own tools using JavaScript/WASM.

---

## 🤝 Contributing
Feedback and contributions are welcome! If you find a bug or have a tool suggestion, please [open an issue](https://github.com/ilhan-mstf/omnitool/issues) or [send feedback](mailto:feedback@omnitool.app).

---

## 📄 License
Source Available - Non-Commercial License.
Commercial use or redistribution is strictly prohibited for anyone other than Mustafa Ilhan.
See [LICENSE](LICENSE) for full details.
