import { useState, useEffect } from 'react';
import { 
  Search, 
  Settings, 
  Hash, 
  Code, 
  Zap, 
  ShieldCheck, 
  History,
  LayoutGrid,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import Base64Tool from './Base64Tool';

const CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: LayoutGrid },
  { id: 'encoders', name: 'Encoders', icon: ShieldCheck },
  { id: 'formatters', name: 'Formatters', icon: Code },
  { id: 'generators', name: 'Generators', icon: Zap },
  { id: 'converters', name: 'Converters', icon: Hash },
];

export default function App() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const checkClipboard = async () => {
    try {
      const text = await readText();
      if (text && text.length > 0) {
        const detectedId: string | null = await invoke('detect_clipboard', { text });
        setSuggestion(detectedId);
      }
    } catch (err) {
      console.error("Clipboard Error:", err);
    }
  };

  useEffect(() => {
    // Check on mount
    checkClipboard();

    // Check when window gets focus
    window.addEventListener('focus', checkClipboard);
    return () => window.removeEventListener('focus', checkClipboard);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/50 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Omnitool</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedTool(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  activeCategory === cat.id && !selectedTool
                    ? 'bg-accent/10 text-accent' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white transition-colors">
            <History size={18} />
            <span className="font-medium">Recent Activity</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white transition-colors">
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-white/10 flex items-center px-8 justify-between shrink-0 bg-background/50 backdrop-blur-sm z-10">
          {selectedTool ? (
            <button 
              onClick={() => setSelectedTool(null)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Gallery</span>
            </button>
          ) : (
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search tools... (Cmd + K)"
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {selectedTool === 'base64' ? (
            <Base64Tool />
          ) : (
            <div className="max-w-6xl mx-auto">
              {suggestion && (
                <div 
                  onClick={() => setSelectedTool(suggestion)}
                  className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-accent/20 transition-all animate-in slide-in-from-top-4 duration-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-accent flex items-center gap-2">
                        Smart Suggestion
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Found {suggestion === 'base64' ? 'Base64 encoded' : 'JSON'} data in your clipboard.
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-accent text-white rounded-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Tool
                  </button>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Explore Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => setSelectedTool('base64')}
                  className={`p-6 bg-card border rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                    suggestion === 'base64' ? 'border-accent shadow-2xl shadow-accent/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                    suggestion === 'base64' ? 'bg-accent text-white' : 'bg-zinc-800 text-zinc-400 group-hover:bg-accent/10 group-hover:text-accent'
                  }`}>
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Base64 Encoder</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Securely encode or decode text and images into Base64 format locally.
                  </p>
                  {suggestion === 'base64' && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-accent text-white px-2 py-1 rounded">
                      Suggested
                    </div>
                  )}
                </div>

                {/* More Tool Cards... */}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
