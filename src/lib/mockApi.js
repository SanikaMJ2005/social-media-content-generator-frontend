export const PLATFORMS = {
    LINKEDIN: {
        name: 'LinkedIn',
        color: '#0a66c2',
        icon: 'Linkedin',
        maxLength: 3000,
        hasImage: true,
    },
    INSTAGRAM: {
        name: 'Instagram',
        color: '#e4405f',
        icon: 'Instagram',
        maxLength: 2200,
        hasImage: true,
        hasVideo: true,
    },
    FACEBOOK: {
        name: 'Facebook',
        color: '#1877f2',
        icon: 'Facebook',
        maxLength: 63206,
        hasImage: true,
        hasVideo: true,
    },
    YOUTUBE: {
        name: 'YouTube',
        color: '#ff0000',
        icon: 'Youtube',
        maxLength: 5000,
        hasVideo: true,
    },
};

export const generateContent = async (platform, prompt, type) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const content = {
        id: Math.random().toString(36).substr(2, 9),
        platform,
        type,
        text: `Here is a custom generated post for ${PLATFORMS[platform].name} based on your prompt: "${prompt}".\n\nThis content is optimized for engagement and follows the platform's best practices. #AI #SocialMedia #Marketing`,
        mediaUrl: type === 'IMAGE' ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000' : null,
        videoUrl: type === 'VIDEO' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : null,
    };

    return content;
};
