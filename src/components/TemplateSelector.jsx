import { Wand2 } from 'lucide-react'

const TEMPLATES = [
    { label: '🚀 Product Launch', prompt: 'Write an exciting product launch post for my new AI-powered gardening tool.' },
    { label: '💡 Tech Tip', prompt: 'Share a quick tech tip about how to stay productive while working from home.' },
    { label: '📅 Event Promo', prompt: 'Invite people to a digital marketing webinar happening next Friday at 10 AM EST.' },
    { label: '📈 Career Advice', prompt: 'Write a professional post giving advice on how to transition into a career in AI.' },
]

export function TemplateSelector({ onSelect }) {
    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                <Wand2 className="w-4 h-4" />
                <span>Need inspiration? Try a template:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                    <button
                        key={t.label}
                        onClick={() => onSelect(t.prompt)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium hover:bg-white/10 hover:border-white/20 transition-all text-slate-300"
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
