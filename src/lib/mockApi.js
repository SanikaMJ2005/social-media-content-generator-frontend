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

const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
    'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=1000',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000',
];

export const generateContent = async (platform, prompt, type) => {
    try {
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ platform, prompt, type }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate content');
        }

        const data = await response.json();
        return {
            ...data,
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to enhanced mock if backend is not running
        await new Promise(resolve => setTimeout(resolve, 2000));

        const isProfessional = prompt.toLowerCase().includes('job') || prompt.toLowerCase().includes('career') || prompt.toLowerCase().includes('work');
        const isExciting = prompt.toLowerCase().includes('launch') || prompt.toLowerCase().includes('new') || prompt.toLowerCase().includes('exciting');

        let toneText = "Here is an optimized post for your audience.";
        if (isProfessional) toneText = "This professional post is crafted to highlight your industry expertise and leadership.";
        if (isExciting) toneText = "Get ready to create some buzz! This high-energy post is designed to maximize reach and excitement.";

        return {
            id: Math.random().toString(36).substr(2, 9),
            platform,
            type,
            prompt,
            text: `${toneText}\n\n"${prompt}"\n\n${platform === 'INSTAGRAM' ? 'Enjoying the process! 📸 ✨' : 'Check this out!'} #SocialSpark #AI #ContentCreation #Trending (Note: Backend was not reachable, showing fallback mock)`,
            mediaUrl: type === 'IMAGE' ? SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)] : null,
            videoUrl: type === 'VIDEO' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : null,
            createdAt: new Date().toISOString(),
        };
    }
};
