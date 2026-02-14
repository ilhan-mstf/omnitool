import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChain } from './useChain';

// Mock the engine
vi.mock('../lib/chainEngine', () => ({
  executeChain: vi.fn().mockResolvedValue([
    { output: 'result-1', error: null },
    { output: 'result-2', error: null }
  ]),
}));

describe('useChain Hook', () => {
  it('starts with an initial input and no steps', () => {
    const { result } = renderHook(() => useChain());
    expect(result.current.steps.length).toBe(0);
  });

  it('can add a step', () => {
    const { result } = renderHook(() => useChain());
    act(() => {
      result.current.addStep('base64');
    });
    expect(result.current.steps.length).toBe(1);
    expect(result.current.steps[0].toolId).toBe('base64');
  });

  it('can remove a step', () => {
    const { result } = renderHook(() => useChain());
    act(() => {
      result.current.addStep('base64');
      result.current.addStep('json_formatter');
    });
    expect(result.current.steps.length).toBe(2);
    
    act(() => {
      result.current.removeStep(0);
    });
    expect(result.current.steps.length).toBe(1);
    expect(result.current.steps[0].toolId).toBe('json_formatter');
  });

  it('updates options for a specific step', () => {
    const { result } = renderHook(() => useChain());
    act(() => {
      result.current.addStep('base64');
    });
    act(() => {
      result.current.updateStepOptions(0, { action: 'decode' });
    });
    expect(result.current.steps[0].options.action).toBe('decode');
  });
});
