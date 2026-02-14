# Architectural Trade-off Analysis: Omnitool

This document outlines the alternatives considered and the justification for the final technical stack.

---

## 1. Application Framework: Tauri vs. Electron vs. Native

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **Electron** | Fast dev cycle, massive ecosystem, easy hiring. | **Bloat:** 100MB+ footprint, high RAM usage (Chromium). | **Rejected** |
| **Native (Swift/Kotlin)** | Best performance, OS-specific features (Menu bar). | **Fragmentation:** 3x development effort for cross-platform parity. | **Rejected** |
| **Tauri** | Tiny binaries (~5MB), Rust performance, native webview. | Newer ecosystem, requires Rust expertise. | **Selected** |

**Justification:** For a "Toolbox" that developers keep running in the background 24/7, **Electron is a non-starter** due to memory bloat. Tauri provides the "Native-lite" experience with a single codebase.

---

## 2. Plugin Runtime: WASM vs. JavaScript (Deno/QuickJS)

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **WebAssembly (WASM)** | Language agnostic, near-native speed, extreme security. | High friction for plugin authors (complex string/memory passing). | **Future Roadmap** |
| **JS (Deno/QuickJS)** | 99% of devs know JS/TS. Excellent for string manipulation. | Slower than WASM, requires embedding a runtime. | **Selected** |

**Justification:** Most developer utilities are **string transformations** (JSON, Base64, Regex). JS is the most ergonomic language for this. We will use `deno_core` for the sandbox because it provides a modern, secure, and fast V8 environment.

---

## 3. Storage Engine: SQLite vs. JSON vs. Sled (Key-Value)

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **Plain JSON** | Easy to debug, no dependencies. | Poor performance for large history, no ACID compliance. | **Config Only** |
| **Sled (Rust KV)** | Pure Rust, extreme speed, zero-copy. | Difficult to query/report on history. | **Rejected** |
| **SQLite** | Industry standard, robust, relational queries for history. | Requires C-linkage (usually), slight binary size increase. | **Selected** |

**Justification:** We need to store tool history and allow users to search/filter it. **SQLite** is the most reliable way to handle structured history with ACID guarantees without over-engineering.

---

## 4. UI Library: React vs. Svelte

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **Svelte** | Tiny bundle, no Virtual DOM, high performance. | Smaller ecosystem for specialized dev-components. | **Rejected** |
| **React** | **Rich Ecosystem:** Monaco Editor, React-Diff-Viewer, Radix UI. | Larger bundle size, Virtual DOM overhead. | **Selected** |

**Justification:** The primary UI complexity of Omnitool is rendering **Code Editors and Diff Viewers**. The React ecosystem has mature, high-performance components for these (e.g., `monaco-editor`) that would take months to rebuild or port to Svelte.

---

## 5. Local AI: Built-in vs. Agnostic Client (Ollama)

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **Built-in (Llama.cpp)** | Seamless "out of the box" experience. | **Massive binary size (+500MB)**, high CPU/GPU maintenance. | **Rejected** |
| **Agnostic (Ollama)** | App remains tiny, leverages existing user setup. | Requires user to install Ollama separately. | **Selected** |

**Justification:** We do not want to become an AI company. We want to be the **UI for the local AI ecosystem**. By connecting to Ollama, we keep the app size under 10MB while providing full AI power to users who already have the infrastructure.

---

## Summary of Technical Risks
1.  **The "Rust Gap":** If we can't find/train devs in Rust, the backend becomes a bottleneck.
    *   *Mitigation:* Keep the Rust core thin; move most tool logic into the WASM/JS plugin system.
2.  **Native Webview Inconsistencies:** Tauri uses the OS's native webview (WebKit on Mac, WebView2 on Windows).
    *   *Mitigation:* Strict CSS resetting and automated cross-platform UI testing in CI.
