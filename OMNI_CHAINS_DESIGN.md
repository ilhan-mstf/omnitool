# Omni-Chains: Technical Design Document

**Status:** Draft | **Author:** Principal Software Engineer | **Date:** Feb 13, 2026

## 1. Concept Overview
**Omni-Chains** allows users to pipe the output of one tool directly into the input of another, creating a linear transformation pipeline. This eliminates manual copy-pasting and enables complex workflows (e.g., `Base64 Decode -> JSON Format -> Extract Field`).

## 2. User Experience (UX)
### 2.1 Visualizing the Chain
Instead of a single "Input/Output" pane, the workspace becomes a vertical list of **Step Cards**.
*   **Step 1:** Initial Input (e.g., Paste raw text).
*   **Step 2:** Tool A (e.g., Base64 Decoder). Shows its output.
*   **Step 3:** Tool B (e.g., JSON Formatter). Takes Output of Step 2 as Input.

### 2.2 Adding a Step
At the bottom of every tool output, there is a small `+ Add Step` button. Clicking it opens a mini-Command Palette to select the next tool.

### 2.3 Error Handling
If Step 2 fails (e.g., "Invalid Base64"), the chain halts at Step 2. Step 3 becomes disabled/greyed out with a message: *"Waiting for valid input from previous step."*

## 3. Technical Architecture

### 3.1 Data Structure (React State)
We will move from `selectedTool: string` to `activeChain: ChainStep[]`.

```typescript
interface ChainStep {
  id: string;          // Unique UUID for this step instance
  toolId: string;      // "base64", "json_formatter", etc.
  params: any;         // Tool-specific options (e.g., { indent: 2 })
  output: string;      // The result of this step (cached)
  error: string | null;
}
```

### 3.2 The Execution Engine (Frontend vs Backend)
**Decision:** We will execute the chain **step-by-step in the Frontend** initially.
*   **Why?** It's easier to implement responsive UI updates. If Step 1 changes, we re-run Step 1, then pass its output to Step 2.
*   **Future Optimization:** Move the entire chain execution to Rust for massive files (avoiding JS string copying).

### 3.3 Backend Changes
None required immediately. The existing `execute_tool` command is stateless and can be called multiple times.

## 4. Implementation Plan

### Phase 1: The Chain Component
Create a `ChainWorkspace` component that manages the list of steps.
*   It holds the `initialInput` state.
*   It renders a list of `ToolStep` components.
*   It handles the `addStep` and `removeStep` logic.

### Phase 2: Refactoring Tools
Refactor `Base64Tool` and `JsonTool` to be **"Step Components"**.
*   They must accept `input` as a prop (from the previous step).
*   They must emit `onOutputChange` to update the chain state.
*   They must *hide* their own "Input" textarea when part of a chain (only showing Output/Options).

### Phase 3: The "Add Step" UI
Reuse the `CommandPalette` logic to allow selecting the next tool.

## 5. Risks & Mitigations
*   **Risk:** Infinite loops or massive memory usage with large strings.
    *   **Mitigation:** Limit chain depth to 10 steps.
*   **Risk:** UI complexity (too much scrolling).
    *   **Mitigation:** Collapsible steps. "Auto-scroll to bottom" when adding a step.

## 6. Success Criteria
*   User can create a `Base64 Decode -> JSON Format` chain.
*   Changing the initial input updates the final JSON automatically.
*   Removing a step re-calculates the chain instantly.
