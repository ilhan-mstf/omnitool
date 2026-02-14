import { describe, it, expect, vi } from 'vitest';
import { executeChain } from './chainEngine';

// Mock Tauri invoke
const mockInvoke = vi.fn();
vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: any[]) => mockInvoke(...args),
}));

describe('ChainEngine', () => {
  it('executes a sequence of tools correctly', async () => {
    // Setup Mocks
    mockInvoke
      .mockResolvedValueOnce({ result: '{"a": 1}', error: null }) // Base64 Decode Result
      .mockResolvedValueOnce({ result: '{\n  "a": 1\n}', error: null }); // JSON Format Result

    const steps = [
      { toolId: 'base64', options: { action: 'decode' } },
      { toolId: 'json_formatter', options: { indent: 2 } }
    ];

    const initialInput = 'eyJhIjogMX0='; // {"a": 1} encoded
    const results = await executeChain(initialInput, steps);

    expect(results.length).toBe(2);
    expect(results[0].output).toBe('{"a": 1}');
    expect(results[1].output).toBe('{\n  "a": 1\n}');
    expect(mockInvoke).toHaveBeenCalledTimes(2);
  });

  it('halts execution if a step fails', async () => {
    mockInvoke.mockReset();
    mockInvoke.mockResolvedValueOnce({ result: '', error: 'Invalid Base64' });

    const steps = [
      { toolId: 'base64', options: { action: 'decode' } },
      { toolId: 'json_formatter', options: { indent: 2 } }
    ];

    const results = await executeChain('invalid-data', steps);

    expect(results.length).toBe(2);
    expect(results[0].error).toBe('Invalid Base64');
    expect(results[1].output).toBe(''); // Should not have executed
    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });
});
