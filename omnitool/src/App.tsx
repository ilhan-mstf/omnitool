import { useState, useEffect } from 'react';
import { 
  Search, 
  History,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { openUrl } from '@tauri-apps/plugin-opener';
import CommandPalette from './CommandPalette';
import ChainWorkspace from './ChainWorkspace';
import { getAllTools } from './lib/toolRegistry';

interface DetectionResult {
  tool_id: string;
  confidence: number;
  initial_options: any;
}

interface ActiveSuggestion {
  result: DetectionResult;
  text: string;
}

export default function App() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [suggestion, setSuggestion] = useState<ActiveSuggestion | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  const checkUpdates = async () => {
    try {
      const version: string | null = await invoke('check_for_updates');
      setNewVersion(version);
    } catch (err) {
      console.error("Update Check Error:", err);
    }
  };

  const checkClipboard = async () => {
    try {
      const text = await readText();
      if (text && text.length > 0) {
        const result: DetectionResult | null = await invoke('detect_clipboard', { text });
        if (result) {
          setSuggestion({ result, text });
        } else {
          setSuggestion(null);
        }
      }
    } catch (err) {
      console.error("Clipboard Error:", err);
    }
  };

  useEffect(() => {
    checkUpdates();
    checkClipboard();
    const handleEvents = () => checkClipboard();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };

    window.addEventListener('focus', handleEvents);
    window.addEventListener('mousedown', handleEvents);
    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      if (document.hasFocus()) checkClipboard();
    }, 3000);

    return () => {
      window.removeEventListener('focus', handleEvents);
      window.removeEventListener('mousedown', handleEvents);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const toolsToDisplay = activeCategory === 'all' 
    ? getAllTools() 
    : getAllTools().filter(t => t.category.toLowerCase() === activeCategory);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        onSelect={setSelectedTool}
        suggestionId={suggestion?.result.tool_id || null}
      />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/50 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Omnitool</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {['all', 'encoders', 'formatters', 'generators', 'converters'].map((id) => {
            const isSelected = activeCategory === id && !selectedTool;
            return (
              <button
                key={id}
                onClick={() => { setActiveCategory(id); setSelectedTool(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 capitalize ${
                  isSelected ? 'bg-accent/10 text-accent' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="font-medium">{id}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button 
            onClick={() => openUrl('https://github.com/ilhan-mstf/omnitool/issues')}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            <History size={18} />
            <span className="font-medium">Send Feedback</span>
          </button>
          <div className="pt-4 px-3 flex justify-between items-center">
             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Version 0.1.1-beta</p>
             <button onClick={() => openUrl('https://github.com/ilhan-mstf/omnitool/releases')} className="text-[10px] text-accent hover:underline">Updates?</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-white/10 flex items-center px-8 justify-between shrink-0 bg-background/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4 flex-1">
            {selectedTool ? (
              <button onClick={() => setSelectedTool(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Gallery</span>
              </button>
            ) : (
              <div onClick={() => setIsPaletteOpen(true)} className="relative flex-1 max-w-xl cursor-pointer">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <div className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-zinc-500 flex justify-between items-center hover:bg-white/10 transition-all">
                  <span>Search tools or type a command...</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold">
                    <span className="text-zinc-500">⌘</span>
                    <span className="text-zinc-500">K</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {newVersion && (
            <button 
              onClick={() => openUrl('https://github.com/ilhan-mstf/omnitool/releases')}
              className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg text-accent text-xs font-bold animate-pulse hover:bg-accent/20 transition-all"
            >
              <Zap size={14} className="fill-current" />
              Update Available: {newVersion}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {selectedTool ? (
            <ChainWorkspace 
              initialToolId={selectedTool}
              initialValue={suggestion?.result.tool_id === selectedTool ? suggestion.text : ''}
              initialOptions={suggestion?.result.tool_id === selectedTool ? suggestion.result.initial_options : {}}
            />
          ) : (
            <div className="max-w-6xl mx-auto">
              {suggestion && (
                <div 
                  onClick={() => setSelectedTool(suggestion.result.tool_id)}
                  className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-accent/20 transition-all shadow-lg shadow-accent/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                      <Zap size={24} className="fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-accent text-lg leading-tight">Smart Detection</p>
                      <p className="text-zinc-400">
                        {suggestion.result.tool_id === 'base64' ? 'Base64 string' : 'JSON data'} found. Start a workflow now.
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-accent text-white rounded-xl font-bold transition-all group-hover:scale-105 active:scale-95">
                    Magic Start
                  </button>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-8">All Utilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolsToDisplay.map(tool => (
                  <ToolCard 
                    key={tool.id}
                    title={tool.name}
                    desc={tool.description}
                    icon={<tool.icon size={28} />}
                    isSuggested={suggestion?.result.tool_id === tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ToolCard({ title, desc, icon, onClick, isSuggested }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 bg-card border rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
        isSuggested ? 'border-accent shadow-2xl shadow-accent/10' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
        isSuggested ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-zinc-800 text-zinc-400 group-hover:bg-accent/10 group-hover:text-accent'
      }`}>
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
      {isSuggested && (
        <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-accent text-white px-2 py-1 rounded">
          Suggested
        </div>
      )}
    </div>
  );
}
