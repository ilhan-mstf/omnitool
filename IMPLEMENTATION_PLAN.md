# Implementation Plan: Omnitool

**Status:** Draft | **Author:** Principal Software Engineer | **Date:** Feb 13, 2026

## Phase 1: Foundation & "Hello World" (Week 1-2)
**Goal:** A running Tauri app that can execute one native Rust function from the UI.

1.  **Repository Setup:**
    *   Initialize `cargo` workspace.
    *   Initialize `npm` project (Vite + React + TS).
    *   Configure `tauri.conf.json`.
2.  **Core Architecture (Rust):**
    *   Define the `Tool` trait in `src-tauri/src/tools/mod.rs`.
    *   Implement the `Base64` tool (Encoder/Decoder) as the first proof-of-concept.
    *   Create a `CommandDispatcher` struct to route frontend requests.
3.  **Frontend Skeleton:**
    *   Set up the main layout (Sidebar, Main Area).
    *   Create a `CommandPalette` component (Command+K style).
    *   Wire up the `invoke('execute_tool')` call.

## Phase 2: The Tool Registry & Smart Paste (Week 3-4)
**Goal:** 20+ basic tools and automatic detection.

1.  **Tool Implementation:**
    *   **Formatters:** JSON, SQL, XML, YAML.
    *   **Generators:** UUID (v4/v7), Lorem Ipsum, Random Password.
    *   **Converters:** Unix Timestamp <-> Date, Hex <-> RGB.
2.  **Smart Detection Logic:**
    *   Create a `Detector` module in Rust.
    *   Implement regex-based scoring:
        *   `^\{.*\}$` -> High confidence JSON.
        *   `^[0-9]{10}$` -> High confidence Unix Timestamp.
    *   Expose `detect_content(clipboard_text)` to the frontend.
3.  **UI Polish:**
    *   "Smart Paste" button in the search bar.
    *   Keyboard navigation (Up/Down/Enter).

## Phase 3: The "Omni-Chain" Engine (Week 5-6)
**Goal:** Piping output from Tool A to Tool B.

1.  **Pipeline Structs:**
    *   Define `Pipeline` and `PipelineStep` structs in Rust.
    *   Implement `Pipeline::execute(initial_input) -> Result<FinalOutput>`.
2.  **Chain UI:**
    *   Drag-and-drop interface for building chains.
    *   "Add Step" button next to tool results.
3.  **Serialization:**
    *   Save/Load chains from `chains.json`.

## Phase 4: Plugin System (The Hard Part) (Week 7-8)
**Goal:** Running user-provided JavaScript safely.

1.  **Runtime Integration:**
    *   Add `deno_core` or `boa_engine` to `Cargo.toml`.
    *   Create a `JsRuntime` struct that initializes the V8 Isolate.
2.  **API Bridge:**
    *   Expose `omni` global object to the JS context.
    *   Implement `omni.readInput()` and `omni.writeOutput()`.
3.  **Plugin Loader:**
    *   Scan `~/.omnitool/plugins/*.js`.
    *   Register found scripts as `Tool` implementations dynamically.

## Phase 5: Local AI Integration (Week 9)
**Goal:** "Explain this code" using Ollama.

1.  **Ollama Client:**
    *   Implement a simple HTTP client in Rust to talk to `http://localhost:11434`.
    *   Create an `AiTool` struct that wraps the prompt generation.
2.  **Prompt Templates:**
    *   "Explain Code", "Refactor", "Find Bug", "Convert to JSON".
3.  **Streaming UI:**
    *   Handle streaming responses from the LLM in the frontend.

## Phase 6: Release Engineering (Week 10)
**Goal:** Alpha Release.

1.  **CI/CD:** GitHub Actions to build binaries for macOS (.dmg), Windows (.msi), Linux (.AppImage).
2.  **Code Signing:** Set up Apple Developer ID signing.
3.  **Documentation:** Write `CONTRIBUTING.md` for plugin developers.

---

## Technical Risks & Spikes

*   **Risk:** `deno_core` adds 20MB+ to the binary size.
    *   *Mitigation:* Evaluate `quickjs-rs` or `boa` for smaller footprint if full Deno compatibility isn't required.
*   **Risk:** Tauri IPC overhead for large files (10MB+ JSON).
    *   *Mitigation:* Use sidecar commands or shared memory mapping for large payloads, avoiding JSON serialization over IPC.
