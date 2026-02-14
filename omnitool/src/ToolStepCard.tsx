import { Trash2, AlertCircle, Copy } from 'lucide-react';
import { getToolById } from './lib/toolRegistry';
import { StepResult } from './lib/chainEngine';

interface ToolStepCardProps {
  index: number;
  toolId: string;
  options: any;
  result: StepResult;
  onRemove: () => void;
  onUpdateOptions: (options: any) => void;
  renderOptions: (options: any, setOptions: (o: any) => void) => React.ReactNode;
}

export default function ToolStepCard({ 
  index, 
  toolId, 
  options, 
  result, 
  onRemove, 
  onUpdateOptions,
  renderOptions 
}: ToolStepCardProps) {
  const metadata = getToolById(toolId);
  if (!metadata) return null;

  const Icon = metadata.icon;

  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Icon size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide">STEP {index + 1}: {metadata.name}</h4>
          </div>
        </div>
        <button 
          onClick={onRemove}
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Tool Specific Options */}
        <div className="flex flex-wrap gap-4 pb-4 border-b border-white/5">
          {renderOptions(options, onUpdateOptions)}
        </div>

        {/* Output Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Output</span>
            <button 
              onClick={() => navigator.clipboard.writeText(result?.output || '')}
              className="text-zinc-500 hover:text-accent transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
          
          <div className={`min-h-[100px] p-4 rounded-xl bg-black/40 font-mono text-sm border ${result?.error ? 'border-red-500/30' : 'border-white/5'}`}>
            {result?.error ? (
              <div className="text-red-400 flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span className="break-all">{result.error}</span>
              </div>
            ) : (
              <pre className="text-zinc-300 whitespace-pre-wrap break-all">
                {result?.output || 'Waiting for previous step...'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
