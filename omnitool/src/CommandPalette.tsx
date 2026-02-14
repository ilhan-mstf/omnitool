import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Command, ShieldCheck, Code } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: any;
  category: string;
}

const TOOLS: Tool[] = [
  { id: 'base64', name: 'Base64 Encoder/Decoder', icon: ShieldCheck, category: 'Encoders' },
  { id: 'json_formatter', name: 'JSON Formatter', icon: Code, category: 'Formatters' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  suggestionId: string | null;
}

export default function CommandPalette({ isOpen, onClose, onSelect, suggestionId }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) || 
    tool.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredTools.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredTools.length) % filteredTools.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelect(filteredTools[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onSelect, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-card border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="text-zinc-500" size={20} />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools or type a command..."
                className="w-full bg-transparent border-none outline-none text-lg placeholder:text-zinc-600"
              />
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 text-zinc-500 text-[10px] font-bold">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {suggestionId && !query && (
                <div className="mb-2">
                  <p className="px-3 py-1 text-[10px] font-bold text-accent uppercase tracking-widest">Suggested</p>
                  <button
                    onClick={() => { onSelect(suggestionId); onClose(); }}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                        <Zap size={20} className="fill-current" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Open {suggestionId === 'base64' ? 'Base64 Tool' : 'JSON Formatter'}</p>
                        <p className="text-xs text-zinc-500">Magic detect found matching data in clipboard</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded font-bold">ENTER</span>
                  </button>
                </div>
              )}

              <p className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tools</p>
              {filteredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => { onSelect(tool.id); onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors text-left group ${
                      index === selectedIndex ? 'bg-accent/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        index === selectedIndex ? 'bg-accent text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-white'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className={`font-bold transition-colors ${index === selectedIndex ? 'text-white' : 'text-zinc-300'}`}>
                          {tool.name}
                        </p>
                        <p className="text-xs text-zinc-500">{tool.category}</p>
                      </div>
                    </div>
                    {index === selectedIndex && (
                       <span className="text-[10px] bg-accent text-white px-2 py-1 rounded font-bold">SELECT</span>
                    )}
                  </button>
                );
              })}
              
              {filteredTools.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-zinc-500">No tools found matching "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
