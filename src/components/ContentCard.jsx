import { Copy, Check, Download, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { PlatformIcon } from './PlatformIcon'
import { PLATFORMS } from '../lib/mockApi'
import { motion, AnimatePresence } from 'framer-motion'

export function ContentCard({ content }) {
    const [copied, setCopied] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const platformInfo = PLATFORMS[content.platform]

    const handleCopy = () => {
        navigator.clipboard.writeText(content.text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([content.text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${content.platform}_post.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const handlePublish = () => {
        setIsPublishing(true)
        const urls = {
            LINKEDIN: "https://www.linkedin.com/sharing/share-offsite/",
            INSTAGRAM: "https://www.instagram.com/",
            FACEBOOK: "https://www.facebook.com/sharer/sharer.php?u=https://socialspark.ai",
            YOUTUBE: "https://studio.youtube.com/",
        }

        // Copy text first to ensure it's in clipboard
        handleCopy()

        // Wait a moment for the animation before opening
        setTimeout(() => {
            window.open(urls[content.platform] || "https://google.com", "_blank")
            setIsPublishing(false)
        }, 1500)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto glass-card overflow-hidden"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${platformInfo.color}20`, color: platformInfo.color }}
                    >
                        <PlatformIcon platform={content.platform} className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold">{platformInfo.name} Post</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">{content.type}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Text'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-slate-400"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="relative group">
                    <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-lg italic">
                        "{content.text}"
                    </pre>
                </div>

                {content.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={content.mediaUrl} alt="Generated Content" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                )}

                {content.videoUrl && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                        <video controls className="w-full h-auto">
                            <source src={content.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all relative overflow-hidden",
                        isPublishing
                            ? "bg-green-500 text-white"
                            : "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:scale-105"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isPublishing ? (
                            <motion.div
                                key="publishing"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                <span>Copied! Opening {platformInfo.name}...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <span>Publish to {platformInfo.name}</span>
                                <ExternalLink className="w-4 h-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    )
}
