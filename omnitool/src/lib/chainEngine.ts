import { invoke } from '@tauri-apps/api/core';

export interface ChainStep {
  toolId: string;
  options: any;
}

export interface StepResult {
  output: string;
  error: string | null;
}

export async function executeChain(initialInput: string, steps: ChainStep[]): Promise<StepResult[]> {
  const results: StepResult[] = [];
  let currentInput = initialInput;

  for (const step of steps) {
    if (results.length > 0 && results[results.length - 1].error) {
      // Previous step failed, skip remaining steps
      results.push({ output: '', error: null });
      continue;
    }

    try {
      const res: any = await invoke('execute_tool', {
        id: step.toolId,
        input: {
          value: currentInput,
          options: step.options
        }
      });

      results.push({
        output: res.result,
        error: res.error
      });

      currentInput = res.result;
    } catch (err) {
      results.push({
        output: '',
        error: String(err)
      });
      break;
    }
  }

  return results;
}
