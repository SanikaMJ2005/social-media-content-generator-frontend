import { useState, useEffect } from 'react'
import { PLATFORMS } from '../lib/mockApi'
import { PlatformIcon } from './PlatformIcon'
import { Send, Image as ImageIcon, Video as VideoIcon, Type } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function GeneratorForm({ onGenerate, isLoading, initialPrompt }) {
    const [platform, setPlatform] = useState('LINKEDIN')
    const [type, setType] = useState('TEXT')
    const [prompt, setPrompt] = useState('')

    useEffect(() => {
        if (initialPrompt) {
            setPrompt(initialPrompt)
        }
    }, [initialPrompt])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!prompt.trim()) return
        onGenerate(platform, prompt, type)
    }

    const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl mx-auto">
            {/* Platform Selection */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-400 ml-1">Select Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(PLATFORMS).map(([id, info]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setPlatform(id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300",
                                platform === id
                                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.07]"
                            )}
                        >
                            <PlatformIcon platform={id} className="w-6 h-6" />
                            <span className="text-xs font-semibold">{info.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Type Selection */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-400 ml-1">Generation Type</label>
                <div className="flex gap-4">
                    {[
                        { id: 'TEXT', label: 'Post Text', icon: Type },
                        { id: 'IMAGE', label: 'With Image', icon: ImageIcon },
                        { id: 'VIDEO', label: 'Short Video', icon: VideoIcon },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setType(item.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                                type === item.id
                                    ? "bg-white text-background border-white"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-400 ml-1">What's the topic?</label>
                <div className="relative group">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="E.g. Write a professional post about the benefits of AI in 2024 for small businesses..."
                        className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-slate-600"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="absolute bottom-4 right-4 p-4 bg-primary hover:bg-primary-hover disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg hover:shadow-primary/20"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="text-[10px] text-slate-600 ml-1 uppercase tracking-widest font-bold">
                    Press <kbd className="bg-white/5 px-1 rounded">Ctrl</kbd> + <kbd className="bg-white/5 px-1 rounded">Enter</kbd> to generate
                </p>
            </div>
        </form>
    )
}
