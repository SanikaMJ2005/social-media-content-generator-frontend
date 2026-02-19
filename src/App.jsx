import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { GeneratorForm } from './components/GeneratorForm'
import { ContentCard } from './components/ContentCard'
import { HistorySidebar } from './components/HistorySidebar'
import { TemplateSelector } from './components/TemplateSelector'
import { generateContent } from './lib/mockApi'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock } from 'lucide-react'

function App() {
    const [content, setContent] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [history, setHistory] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [passedPrompt, setPassedPrompt] = useState('')

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('spark_history')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem('spark_history', JSON.stringify(history))
    }, [history])

    const handleGenerate = async (platform, prompt, type) => {
        setIsLoading(true)
        setContent(null)
        setError(null)
        setPassedPrompt('') // Reset template trigger
        try {
            const result = await generateContent(platform, prompt, type)
            setContent(result)
            setHistory(prev => [result, ...prev].slice(0, 50)) // Keep last 50
        } catch (error) {
            console.error('Failed to generate content:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteHistory = (id) => {
        setHistory(prev => prev.filter(item => item.id !== id))
        if (content?.id === id) setContent(null)
    }

    const handleSelectHistory = (item) => {
        setContent(item)
        setIsSidebarOpen(false)
        window.scrollTo({ top: document.querySelector('#content-display')?.offsetTop - 100, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            {/* History Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed bottom-8 right-8 z-40 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
            >
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">View History</span>
                {history.length > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-primary text-[10px] text-white rounded-full">
                        {history.length}
                    </span>
                )}
            </button>

            <HistorySidebar
                history={history}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onDelete={handleDeleteHistory}
                onSelect={handleSelectHistory}
            />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-32 relative z-10">
                <div className="text-center space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-primary shadow-sm shadow-primary/10"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Content Creation</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
                    >
                        Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Viral</span> Content <br /> in Seconds.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xl max-w-2xl mx-auto font-medium"
                    >
                        The ultimate social media engine for creators. Generate professional posts,
                        premium images, and engaging videos for every platform.
                    </motion.p>
                </div>

                <div className="space-y-12">
                    <TemplateSelector onSelect={(p) => setPassedPrompt(p)} />

                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">
                        <GeneratorForm
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                            initialPrompt={passedPrompt}
                        />
                    </section>

                    <div id="content-display">
                        <AnimatePresence mode="wait">
                            {isLoading && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20 space-y-6"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">Crafting your masterpiece...</p>
                                        <p className="text-slate-500 text-sm">Optimizing for platform engagement and reach</p>
                                    </div>
                                </motion.div>
                            )}

                            {error && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-3 max-w-xl mx-auto"
                                >
                                    <p className="text-red-400 font-bold text-lg">AI Generation Failed</p>
                                    <p className="text-red-300 text-sm italic whitespace-pre-wrap">"{error}"</p>
                                    <p className="text-slate-500 text-xs">Note: If you just added your API key, make sure the backend server was restarted.</p>
                                </motion.div>
                            )}

                            {content && !isLoading && (
                                <ContentCard key={content.id} content={content} />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                    <div className="p-1 bg-primary rounded">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">SocialSpark AI</span>
                </div>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Multi-platform content simplified. Join 10,000+ creators building their audience with AI.
                </p>
                <div className="pt-8 text-xs text-slate-700 font-mono">
                    &copy; 2024 SocialSpark • Built with ❤️ for Creators
                </div>
            </footer>
        </div>
    )
}

export default App
