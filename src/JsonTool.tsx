import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Copy, Trash2, AlertCircle } from 'lucide-react';

interface ToolOutput {
  result: string;
  error: string | null;
}

interface JsonToolProps {
  initialValue?: string;
  initialIndent?: number;
}

export default function JsonTool({ initialValue = '', initialIndent = 2 }: JsonToolProps) {
  const [input, setInput] = useState(initialValue);
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(initialIndent);
  const [minify, setMinify] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async (val: string, currentIndent: number, isMinify: boolean) => {
    if (!val) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const res: ToolOutput = await invoke('execute_tool', {
        id: 'json_formatter',
        input: {
          value: val,
          options: { indent: currentIndent, minify: isMinify }
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
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleExecute(input, indent, minify);
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [input, indent, minify]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">JSON Formatter & Validator</h2>
          <p className="text-zinc-400">Prettify, minify, and validate JSON data.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5">
            {[2, 4].map(size => (
              <button 
                key={size}
                onClick={() => { setIndent(size); setMinify(false); }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${indent === size && !minify ? 'bg-accent text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
              >
                {size} Spaces
              </button>
            ))}
            <button 
              onClick={() => setMinify(true)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${minify ? 'bg-accent text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
              Minify
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Input</span>
            <button onClick={() => setInput('')} className="p-1 hover:text-red-400 text-zinc-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-card border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none font-mono text-sm leading-relaxed"
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Output</span>
            <button 
              onClick={() => navigator.clipboard.writeText(output)}
              className="p-1 hover:text-accent text-zinc-500 transition-colors"
              disabled={!output}
            >
              <Copy size={16} />
            </button>
          </div>
          <div className={`flex-1 bg-card border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed relative overflow-auto ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}>
            {error ? (
              <div className="flex items-start gap-2 text-red-400">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="text-xs whitespace-pre-wrap">{error}</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-all text-zinc-300">{output || 'Waiting for valid JSON...'}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
