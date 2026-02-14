# High-Level Design (HLD): Omnitool Architecture

**Author:** Principal Software Engineer | **Date:** Feb 13, 2026 | **Version:** 1.0

## 1. Architectural Overview

**Omnitool** follows a **hybrid native architecture** using **Tauri**. This provides the performance and system access of a native Rust backend with the flexibility and rapid UI development of a web-based frontend (React/TypeScript).

### Key Design Principles:
1.  **Rust for Logic:** All heavy lifting (parsing, huge file processing, crypto, plugin execution) happens in the Rust backend to ensure the UI remains responsive (60fps).
2.  **Sandboxed Plugins:** Community plugins run in an isolated JavaScript runtime (Deno Core or QuickJS) embedded within the Rust process, *not* in the UI thread.
3.  **Stateless Chains:** The "Tool Chain" engine is a functional pipeline. `Output(Tool A) -> Input(Tool B)`.
4.  **Local-First AI:** The AI module is an agnostic client that connects to local inference servers (Ollama, LocalAI), treating them as "just another tool."

---

## 2. System Architecture Diagram

```mermaid
graph TD
    User[User Interaction] -->|Events| UI[Frontend (React/TS)]
    
    subgraph "Tauri Bridge (IPC)"
        UI <-->|Invoke/Events| Core[Rust Backend Main Loop]
    end

    subgraph "Rust Core Services"
        Core --> Dispatcher[Command Dispatcher]
        
        Dispatcher --> NativeTools[Native Tool Registry]
        Dispatcher --> ChainEngine[Pipeline Execution Engine]
        Dispatcher --> PluginSys[Plugin System]
        Dispatcher --> AI[AI Gateway]
        
        NativeTools -- "Impl: Tool Trait" --> BuiltIn[Built-in Tools (JSON, JWT, etc.)]
        
        ChainEngine -- "Orchestrates" --> NativeTools
        ChainEngine -- "Orchestrates" --> PluginSys
        
        PluginSys -->|Embedded| JSRuntime[Deno Core / QuickJS Runtime]
    end

    subgraph "Data & I/O"
        Core -->|Read/Write| ConfigStore[Settings & History (SQLite/sled)]
        Core -->|OS API| Clipboard[System Clipboard]
        Core -->|FS| FileSys[Local File System]
    end

    subgraph "External Integrations"
        AI -->|HTTP/REST| Ollama[Local LLM (Ollama/LlamaEdge)]
        JSRuntime -.->|Sandboxed| UserScripts[User/Community Plugins]
    end
```

---

## 3. Module Details

### 3.1 The Frontend (View Layer)
*   **Tech:** React, TailwindCSS, Zustand (State), Radix UI (Primitives).
*   **Responsibility:** Rendering the UI, capturing user input, and displaying results. **No business logic.**
*   **Communication:** Sends standardized JSON commands to Rust via `tauri::invoke`.
    *   *Example:* `invoke('execute_tool', { tool_id: 'json_fmt', input: '...' })`

### 3.2 The Rust Core (Controller Layer)
*   **Tech:** Rust, Tauri, Serde.
*   **Responsibility:** App lifecycle, window management, global shortcuts, and routing commands.

### 3.3 The Tool Registry & Trait System
To standardize "Native" and "Plugin" tools, we define a strict Rust Trait:

```rust
trait Tool {
    fn id(&self) -> &str;
    fn name(&self) -> &str;
    fn category(&self) -> ToolCategory;
    fn input_type(&self) -> DataType; // e.g., String, Number, JSON, Blob
    fn output_type(&self) -> DataType;
    
    // The core execution logic
    fn execute(&self, input: ToolInput, context: &Context) -> Result<ToolOutput, ToolError>;
}
```

### 3.4 The Chain Engine (Pipeline)
The "Killer Feature." It treats tools as nodes in a directed graph.
*   **Logic:**
    1.  Receive `Input`.
    2.  Iterate through `ChainStep[]`.
    3.  Pass `Result(Step N)` as `Input(Step N+1)`.
    4.  Stop on `Error`.
*   **Concurrency:** If a chain splits (e.g., "Generate 3 variants of this UUID"), use Rust's `Rayon` for parallel execution.

### 3.5 The Plugin System (Extensibility)
We cannot rely on `eval()` in the WebView (security risk + main thread blocking).
*   **Engine:** **deno_core** (Rust crate).
*   **Mechanism:**
    1.  Load user `.js` / `.ts` file.
    2.  Instantiate a fresh V8 Isolate.
    3.  Inject a restricted API ( `omni.readClipboard()`, `omni.log()`). **Network access is blocked by default.**
    4.  Execute the transformation.
    5.  Return the string/object.

### 3.6 Local AI Gateway
*   **Design:** A standardized interface for "Smart" operations.
*   **Adapter Pattern:**
    *   `OllamaAdapter`
    *   `OpenAIAdapter` (for users who want to use API keys)
*   **Privacy:** The gateway strips PII (if configured) before sending to the model (even local ones, as a best practice).

---

## 4. Data Storage
*   **Preferences:** `settings.json` (Theme, Default Keybindings).
*   **Tool Chains:** `chains.json` (Saved pipeline configurations).
*   **History:** `history.db` (SQLite) - Encrypted. Stores the last 50 inputs/outputs for "Undo" functionality.

## 5. Security Considerations
1.  **Plugin Sandbox:** Plugins have **no** FS access and **no** Network access unless explicitly granted via a manifest file (`plugin.json` permissions).
2.  **Clipboard Monitoring:** Only active when the app is focused or when "Global Auto-Paste" is explicitly enabled by the user.
3.  **Update Mechanism:** Signed binaries via Tauri's Updater.

