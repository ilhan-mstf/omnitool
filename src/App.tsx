import { useState } from 'react';
import { 
  Search, 
  Settings, 
  Hash, 
  Code, 
  Zap, 
  ShieldCheck, 
  History,
  LayoutGrid,
  ChevronLeft
} from 'lucide-react';
import Base64Tool from './Base64Tool';

const CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: LayoutGrid },
  { id: 'encoders', name: 'Encoders', icon: ShieldCheck },
  { id: 'formatters', name: 'Formatters', icon: Code },
  { id: 'generators', name: 'Generators', icon: Zap },
  { id: 'converters', name: 'Converters', icon: Hash },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/50 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
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

        <div className="p-4 border-t border-white/10">
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center px-8 justify-between shrink-0">
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
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {selectedTool === 'base64' ? (
            <Base64Tool />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Explore Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  onClick={() => setSelectedTool('base64')}
                  className="p-6 bg-card border border-white/10 rounded-xl hover:border-accent/50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Base64 Encoder</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Securely encode or decode text and images into Base64 format locally.
                  </p>
                </div>

                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-6 bg-card border border-zinc-800 rounded-xl opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 mb-4" />
                    <div className="h-6 w-24 bg-zinc-800 rounded mb-2" />
                    <div className="h-4 w-full bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
