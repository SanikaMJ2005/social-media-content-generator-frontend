import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react'

export function PlatformIcon({ platform, className }) {
    const icons = {
        LINKEDIN: Linkedin,
        INSTAGRAM: Instagram,
        FACEBOOK: Facebook,
        YOUTUBE: Youtube,
    }

    const Icon = icons[platform] || Sparkles
    return <Icon className={className} />
}
