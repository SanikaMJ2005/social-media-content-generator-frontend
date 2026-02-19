import os
from google import genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SocialSpark AI API",
    description="Backend for the Social Media Content Generator",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API using the new google-genai SDK
api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key and api_key != "YOUR_API_KEY_HERE":
    try:
        client = genai.Client(api_key=api_key)
        print("Backend successfully connected to Google Gen AI SDK")
    except Exception as e:
        print(f"Error configuring Gemini: {e}")
        client = None
else:
    print("WARNING: GEMINI_API_KEY not set correctly. Backend will run in fallback mode.")

class ContentRequest(BaseModel):
    platform: str
    prompt: str
    type: str  # TEXT, IMAGE, VIDEO

@app.get("/")
async def home():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "SocialSpark AI Backend (FastAPI) is running!",
        "endpoints": ["/docs (Swagger UI)", "/generate (POST)"]
    }

@app.post("/generate")
async def generate_content(data: ContentRequest):
    """Generate social media content using AI"""
    platform = data.platform
    prompt = data.prompt
    content_type = data.type

    if not platform or not prompt:
        raise HTTPException(status_code=400, detail="Missing platform or prompt")

    # System instruction for platform-specific optimization
    system_prompt = f"You are a professional social media manager. Generate a high-quality {platform} post based on the following prompt: '{prompt}'. "
    
    if platform == 'LINKEDIN':
        system_prompt += "The tone should be professional and informative. Use industry-relevant hashtags."
    elif platform == 'INSTAGRAM':
        system_prompt += "The tone should be engaging and visual-focused. Include 5-10 relevant hashtags."
    elif platform == 'FACEBOOK':
        system_prompt += "The tone should be conversational and community-oriented."
    elif platform == 'YOUTUBE':
        system_prompt += "Generate a catchy video title and a detailed description with timestamps."

    if content_type == 'IMAGE':
        system_prompt += " Also provide a short, descriptive prompt for an AI image generator that would pair well with this post."
    
    try:
        if client:
            # Using the new SDK generate_content method
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=system_prompt
            )
            generated_text = response.text
        else:
            # Fallback mock logic if API key is missing
            generated_text = f"✨ SUCCESS: Your FastAPI backend is working and received your prompt: \"{prompt}\"!\n\nTo enable real AI content, please add your Gemini API Key to backend/.env. Currently running on {platform} in fallback mode."

        # Mock media URLs for now
        media_url = None
        video_url = None
        
        if content_type == 'IMAGE':
            media_url = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000"
        elif content_type == 'VIDEO':
            video_url = "https://www.w3schools.com/html/mov_bbb.mp4"

        return {
            "id": os.urandom(4).hex(),
            "platform": platform,
            "type": content_type,
            "text": generated_text,
            "mediaUrl": media_url,
            "videoUrl": video_url,
            "prompt": prompt
        }

    except Exception as e:
        print(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
