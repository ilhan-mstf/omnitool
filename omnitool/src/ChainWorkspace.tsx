import { Plus, Trash2 } from 'lucide-react';
import { useChain } from './hooks/useChain';
import ToolStepCard from './ToolStepCard';
import { getAllTools } from './lib/toolRegistry';
import { useState } from 'react';

// Tool-specific option renderers
const OPTION_RENDERERS: Record<string, any> = {
  base64: (options: any, setOptions: any) => (
    <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5">
      {['encode', 'decode'].map(action => (
        <button
          key={action}
          onClick={() => setOptions({ action })}
          className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${options.action === action ? 'bg-accent text-white' : 'text-zinc-500'}`}
        >
          {action}
        </button>
      ))}
    </div>
  ),
  url_encoder: (options: any, setOptions: any) => (
    <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5">
      {['encode', 'decode'].map(action => (
        <button
          key={action}
          onClick={() => setOptions({ action })}
          className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${options.action === action ? 'bg-accent text-white' : 'text-zinc-500'}`}
        >
          {action}
        </button>
      ))}
    </div>
  ),
  jwt_debugger: () => (
    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
      Inspect Mode
    </div>
  ),
  json_formatter: (options: any, setOptions: any) => (
    <div className="flex gap-4 items-center">
       <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5">
          {[2, 4].map(size => (
            <button
              key={size}
              onClick={() => setOptions({ indent: size, minify: false })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${options.indent === size && !options.minify ? 'bg-accent text-white' : 'text-zinc-500'}`}
            >
              {size} Spaces
            </button>
          ))}
          <button
            onClick={() => setOptions({ minify: true })}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${options.minify ? 'bg-accent text-white' : 'text-zinc-500'}`}
          >
            Minify
          </button>
       </div>
    </div>
  )
};

export default function ChainWorkspace({ initialToolId, initialValue = '', initialOptions = {} }: any) {
  const { 
    input, 
    setInput, 
    steps, 
    results, 
    addStep, 
    removeStep, 
    updateStepOptions 
  } = useChain(initialValue);

  // Auto-add the initial tool if steps are empty
  useState(() => {
    if (initialToolId && steps.length === 0) {
      addStep(initialToolId);
      // If we have initial options (like from smart suggestion), apply them
      if (Object.keys(initialOptions).length > 0) {
        setTimeout(() => updateStepOptions(0, initialOptions), 0);
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Input Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Initial Input</label>
          <button onClick={() => setInput('')} className="text-zinc-600 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type data to start the chain..."
          className="w-full h-32 bg-card border border-white/10 rounded-2xl p-6 font-mono text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all shadow-inner"
        />
      </section>

      {/* Steps Section */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="space-y-4">
             <div className="flex justify-center">
                <div className="h-8 w-px bg-gradient-to-b from-accent/50 to-transparent" />
             </div>
             <ToolStepCard 
                index={index}
                toolId={step.toolId}
                options={step.options}
                result={results[index]}
                onRemove={() => removeStep(index)}
                onUpdateOptions={(o) => updateStepOptions(index, o)}
                renderOptions={OPTION_RENDERERS[step.toolId]}
             />
          </div>
        ))}
      </div>

      {/* Add Step Action */}
      <div className="flex flex-col items-center pt-8">
        <div className="h-12 w-px bg-zinc-800" />
        <div className="relative group">
          <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-full hover:border-accent/50 hover:bg-zinc-800 transition-all text-sm font-bold text-zinc-400 hover:text-white">
            <Plus size={18} className="text-accent" />
            <span>Add Workflow Step</span>
          </button>
          
          {/* Quick Menu */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            {getAllTools().map(tool => (
              <button
                key={tool.id}
                onClick={() => addStep(tool.id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                  <tool.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{tool.name}</p>
                  <p className="text-[10px] text-zinc-500">{tool.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
