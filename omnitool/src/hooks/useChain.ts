import { useState, useEffect, useCallback } from 'react';
import { executeChain, StepResult } from '../lib/chainEngine';
import { getToolById } from '../lib/toolRegistry';

export interface ChainStepInstance {
  toolId: string;
  options: any;
}

export function useChain(initialInput: string = '') {
  const [input, setInput] = useState(initialInput);
  const [steps, setSteps] = useState<ChainStepInstance[]>([]);
  const [results, setResults] = useState<StepResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const runChain = useCallback(async () => {
    if (steps.length === 0) {
      setResults([]);
      return;
    }
    setIsProcessing(true);
    const res = await executeChain(input, steps);
    setResults(res);
    setIsProcessing(false);
  }, [input, steps]);

  useEffect(() => {
    const timer = setTimeout(runChain, 150);
    return () => clearTimeout(timer);
  }, [runChain]);

  const addStep = (toolId: string) => {
    const tool = getToolById(toolId);
    if (!tool) return;
    setSteps(prev => [...prev, { toolId, options: { ...tool.defaultOptions } }]);
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const updateStepOptions = (index: number, options: any) => {
    setSteps(prev => {
      const next = [...prev];
      next[index] = { ...next[index], options: { ...next[index].options, ...options } };
      return next;
    });
  };

  return {
    input,
    setInput,
    steps,
    results,
    isProcessing,
    addStep,
    removeStep,
    updateStepOptions
  };
}
