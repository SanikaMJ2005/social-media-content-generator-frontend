import { Copy, Check, Download, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { PlatformIcon } from './PlatformIcon'
import { PLATFORMS } from '../lib/mockApi'
import { motion, AnimatePresence } from 'framer-motion'

export function ContentCard({ content }) {
    const [copied, setCopied] = useState(false)
    const platformInfo = PLATFORMS[content.platform]

    const handleCopy = () => {
        navigator.clipboard.writeText(content.text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-slate-400">
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
                <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full font-medium transition-all">
                    <span>Publish to {platformInfo.name}</span>
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    )
}
