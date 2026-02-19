import { Copy, Check, Download, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { postDirectly } from '../lib/mockApi'
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

    const handleConnect = () => {
        const authUrls = {
            LINKEDIN: "http://localhost:5000/auth/linkedin",
            FACEBOOK: "http://localhost:5000/auth/facebook",
            YOUTUBE: "http://localhost:5000/auth/google",
        }
        window.location.href = authUrls[content.platform] || "#"
    }

    const handlePostDirectly = async () => {
        setIsPublishing(true)
        try {
            await postDirectly(content.platform, content.text, content.mediaUrl)
            alert(`${platformInfo.name} post successful!`)
        } catch (error) {
            alert(`Failed to post to ${platformInfo.name}: ${error.message}`)
        } finally {
            setIsPublishing(false)
        }
    }

    const handlePublish = () => {
        // If the platform isn't connected yet, show the connection flow
        if (!content.isConnected) {
            handleConnect()
            return
        }

        // If connected, proceed with direct post
        handlePostDirectly()
    }

    // This is the fallback for platforms that don't support direct posting yet
    const handleManualPublish = () => {
        setIsPublishing(true)
        const encodedText = encodeURIComponent(content.text)

        const urls = {
            LINKEDIN: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`,
            INSTAGRAM: "https://www.instagram.com/",
            FACEBOOK: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}&u=https://socialspark.ai`,
            YOUTUBE: "https://studio.youtube.com/channel/content/videos",
        }

        handleCopy()

        const win = window.open(urls[content.platform] || "https://google.com", "_blank")

        if (!win) {
            alert("Popup was blocked! Please allow popups for this site.")
            setIsPublishing(false)
            return
        }

        setTimeout(() => {
            setIsPublishing(false)
        }, 3000)
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

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className={cn("w-1.5 h-1.5 rounded-full", content.isConnected ? "bg-green-500" : "bg-yellow-500")} />
                    <span>{content.isConnected ? "Profile Connected" : "Profile Not Connected"}</span>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Only show manual publish if it's not connected or doesn't support direct post */}
                    <button
                        onClick={handleManualPublish}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-all text-sm border border-white/10"
                    >
                        Share Manually
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={cn(
                            "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all relative overflow-hidden flex-1",
                            isPublishing
                                ? "bg-green-500 text-white"
                                : content.isConnected
                                    ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:scale-105"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
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
                                    <span>Posting...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    {content.isConnected ? (
                                        <>
                                            <span>Post Directly to {platformInfo.name}</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Connect {platformInfo.name} Account</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Platform Guide Overlay */}
            {isPublishing && (content.platform === 'INSTAGRAM' || content.platform === 'YOUTUBE') && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-primary/10 border-t border-primary/20 text-center"
                >
                    <p className="text-xs font-semibold text-primary">
                        Note: {platformInfo.name} requires manual paste. Just press Ctrl+V in the post box!
                    </p>
                </motion.div>
            )}
        </motion.div>
    )
}
