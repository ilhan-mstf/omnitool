import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Copy, Trash2, AlertCircle } from 'lucide-react';

interface ToolOutput {
  result: string;
  error: string | null;
}

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async (val: string, currentMode: string) => {
    if (!val) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const res: ToolOutput = await invoke('execute_tool', {
        id: 'base64',
        input: {
          value: val,
          options: { action: currentMode }
        }
      });

      if (res.error) {
        setError(res.error);
        setOutput('');
      } else {
        setOutput(res.result);
        setError(null);
      }
    } catch (err) {
      setError(String(err));
      console.error("Backend Error:", err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleExecute(input, mode);
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [input, mode]);

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Base64 Encoder/Decoder</h2>
          <p className="text-zinc-400">Convert text to and from Base64 encoding.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setMode('encode')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'encode' ? 'bg-accent text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            Encode
          </button>
          <button 
            onClick={() => setMode('decode')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'decode' ? 'bg-accent text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Input Area */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Input</span>
            <button 
              onClick={() => setInput('')}
              className="p-1 hover:text-red-400 text-zinc-500 transition-colors"
              title="Clear Input"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-card border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none font-mono text-sm leading-relaxed"
            placeholder={mode === 'encode' ? "Type or paste text to encode..." : "Paste Base64 string to decode..."}
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Output</span>
            <button 
              onClick={copyToClipboard}
              className="p-1 hover:text-accent text-zinc-500 transition-colors"
              title="Copy to Clipboard"
              disabled={!output}
            >
              <Copy size={16} />
            </button>
          </div>
          <div className={`flex-1 bg-card border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed relative overflow-auto ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}>
            {error ? (
              <div className="flex items-start gap-2 text-red-400">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-all text-zinc-300">{output || 'Waiting for input...'}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
