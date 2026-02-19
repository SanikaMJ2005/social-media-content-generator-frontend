import { Share2, Sparkles } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SocialSpark</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Generator</a>
                    <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Templates</a>
                    <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">History</a>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </button>
            </div>
        </nav>
    )
}
