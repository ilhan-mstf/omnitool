# PRD: Project Omnitool
**Status:** Draft | **Author:** Principal PM | **Date:** Feb 13, 2026

## 1. Executive Summary
**Omnitool** is a high-performance, cross-platform, privacy-first developer utility hub. Unlike existing solutions (DevUtils, He3) which are either platform-locked or resource-heavy (Electron), Omnitool is built on **Tauri/Rust** to provide native-level speed on Windows, macOS, and Linux. It integrates **local-first LLMs** to move beyond simple formatting into intelligent data transformation and explanation.

## 2. Target Personas
1.  **The Privacy-Conscious Dev:** Works in regulated industries (FinTech/Health). Refuses to use web-based formatters.
2.  **The Cross-Platform Power User:** Switches between a Linux workstation and a MacBook. Needs tool parity and synced configurations.
3.  **The Team Lead:** Wants to standardize custom scripts and security checks across their engineering org.

## 3. Problem Statement
*   **Privacy Risks:** Developers frequently paste sensitive data (JWTs, JSON logs) into untrusted web formatters.
*   **Platform Fragmentation:** Native tools are often macOS-only; Windows/Linux alternatives are usually clunky web-wrappers.
*   **Static Logic:** Current tools only handle known formats. They can't "explain" a complex regex or "summarize" a stack trace without sending data to the cloud.

## 4. Goals & Success Metrics (KPIs)
*   **Performance:** App launch to "Ready for Input" in < 400ms.
*   **Efficiency:** RAM usage < 150MB during idle state.
*   **Engagement:** At least 5 "Tool Chains" created per power user in the first 30 days.
*   **Privacy:** Zero outbound network calls by default (Opt-in only).

## 5. Functional Requirements

### 5.1 Core Utility Engine (MVP)
*   **Smart Detection:** Real-time clipboard monitoring with automatic tool suggestion (regex-based).
*   **Standard Suite:** 50+ basic tools (JSON, Base64, JWT, SQL, Cron, etc.).
*   **Offline First:** All core transformations must happen locally on-device.

### 5.2 The "Omni-Chain" (Differentiator)
*   Users can "pipe" tools together.
*   *Example:* `Paste -> Strip Backslashes -> Format JSON -> Extract 'access_token' -> JWT Decode`.
*   Chains can be saved, named, and triggered via a global shortcut.

### 5.3 Local AI Integration (The "X" Factor)
*   **Local LLM Interface:** Integration with `Ollama` or `LlamaEdge`.
*   **Natural Language Transformation:** "Convert this list of CSV emails into a JSON array of objects with a 'verified' flag set to false."
*   **Code Explanation:** "Explain why this regex is causing a ReDoS vulnerability."

### 5.4 Plugin Architecture (Extensibility)
*   **WASM/JS Sandbox:** Developers can write custom tools in TS/JS or Rust (via WASM).
*   **Hot-Loading:** Drop a script into a folder; it appears in the UI instantly.
*   **Marketplace Ready:** Architecture must support a future central repository for community tools.

## 6. Non-Functional Requirements
*   **Platform:** Windows (x64/ARM), macOS (Intel/Silicon), Linux (AppImage/Flatpak).
*   **Security:** Sandboxed execution for community plugins.
*   **UX:** "Spotlight-style" global overlay (Cmd+Shift+K) for instant access.

## 7. The Roadmap

### Phase 1: Foundation (MVP)
*   Tauri core with 20 essential tools.
*   Smart clipboard detection.
*   macOS and Windows builds.

### Phase 2: Intelligence & Chains
*   "Omni-Chain" builder UI.
*   Local LLM connector (Ollama support).
*   Linux support.

### Phase 3: Enterprise & Ecosystem
*   Team-sync (encrypted cloud sync for shared scripts).
*   Plugin Marketplace.
*   CLI companion (`omni format json < file.json`).

## 8. Business Value & Monetization
1.  **Personal Tier:** Free/Open-Core (Essential tools).
2.  **Pro Tier:** One-time purchase ($29) for AI features, Tool Chains, and Cloud Sync.
3.  **Enterprise Tier:** Per-seat subscription for "Shared Toolbox," custom security-scanning plugins, and SSO.

## 9. Risks & Mitigations
*   **Risk:** Local LLMs are resource-heavy.
*   **Mitigation:** App must remain functional without AI; LLM features are "bring-your-own-runtime" or modular downloads.
*   **Risk:** Competition from Raycast/Alfred.
*   **Mitigation:** Focus on deep, specialized developer utilities that Raycast's general-purpose plugins lack (e.g., complex diffing, multi-step chains).
