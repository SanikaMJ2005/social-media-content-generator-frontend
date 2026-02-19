import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { GeneratorForm } from './components/GeneratorForm'
import { ContentCard } from './components/ContentCard'
import { generateContent } from './lib/mockApi'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function App() {
    const [content, setContent] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = async (platform, prompt, type) => {
        setIsLoading(true)
        setContent(null)
        try {
            const result = await generateContent(platform, prompt, type)
            setContent(result)
        } catch (error) {
            console.error('Failed to generate content:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="text-center space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-primary"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Content Creation</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-7xl font-extrabold tracking-tight"
                    >
                        Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Viral</span> Content <br /> in Seconds.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xl max-w-2xl mx-auto"
                    >
                        The ultimate social media engine for creators. Generate professional posts,
                        premium images, and engaging videos for every platform.
                    </motion.p>
                </div>

                <div className="space-y-20">
                    <section>
                        <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
                    </section>

                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 space-y-4"
                            >
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-slate-400 font-medium animate-pulse">Our AI is crafting your masterpiece...</p>
                            </motion.div>
                        )}

                        {content && !isLoading && (
                            <ContentCard key={content.id} content={content} />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm">
                <p>&copy; 2024 SocialSpark AI. Multi-platform content simplified.</p>
            </footer>
        </div>
    )
}

export default App
