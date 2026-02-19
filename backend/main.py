import os
import httpx
from google import genai
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Dict, Optional

load_dotenv()

app = FastAPI(
    title="SocialSpark AI API",
    description="Backend for the Social Media Content Generator with Direct Posting",
    version="1.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration & State ---
api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key and api_key != "YOUR_API_KEY_HERE":
    try:
        client = genai.Client(api_key=api_key)
        print("Backend successfully connected to Google Gen AI SDK")
    except Exception as e:
        print(f"Error configuring Gemini: {e}")
        client = None

# In-memory token storage (In production, use a database!)
tokens: Dict[str, str] = {}

# --- Models ---
class ContentRequest(BaseModel):
    platform: str
    prompt: str
    type: str

class DirectPostRequest(BaseModel):
    platform: str
    text: str
    mediaUrl: Optional[str] = None

# --- Core AI Routes ---

@app.get("/")
async def home():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "SocialSpark AI Backend (FastAPI) with Direct Posting is running!",
        "authenticated_platforms": list(tokens.keys()),
        "endpoints": ["/docs", "/generate", "/auth/{platform}", "/post/{platform}"]
    }

@app.post("/generate")
async def generate_content(data: ContentRequest):
    """Generate social media content using AI"""
    platform = data.platform
    prompt = data.prompt
    content_type = data.type

    # ... (AI generation logic remains the same)
    system_prompt = f"You are a professional social media manager. Generate a high-quality {platform} post based on the following prompt: '{prompt}'. "
    if platform == 'LINKEDIN':
        system_prompt += "The tone should be professional and informative. Use industry-relevant hashtags."
    elif platform == 'INSTAGRAM':
        system_prompt += "The tone should be engaging and visual-focused. Include 5-10 relevant hashtags."
    elif platform == 'FACEBOOK':
        system_prompt += "The tone should be conversational and community-oriented."
    elif platform == 'YOUTUBE':
        system_prompt += "Generate a catchy video title and a detailed description with timestamps."

    try:
        if client:
            response = client.models.generate_content(model='gemini-2.0-flash', contents=system_prompt)
            generated_text = response.text
        else:
            generated_text = f"✨ SUCCESS: Your Direct-Post Backend is working! Prompt: \"{prompt}\". (Fallback Mode)"

        return {
            "id": os.urandom(4).hex(),
            "platform": platform,
            "type": content_type,
            "text": generated_text,
            "prompt": prompt,
            "isConnected": platform in tokens
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- OAuth Routes ---

@app.get("/auth/{platform}")
async def auth(platform: str):
    """Redirect to platform OAuth page"""
    if platform == "linkedin":
        client_id = os.getenv("LINKEDIN_CLIENT_ID")
        redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI")
        scope = "w_member_social"
        return RedirectResponse(
            f"https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}"
        )
    elif platform == "instagram":
        client_id = os.getenv("INSTAGRAM_CLIENT_ID")
        redirect_uri = os.getenv("INSTAGRAM_REDIRECT_URI")
        # Instagram requires Facebook login with specific scopes
        scope = "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement"
        return RedirectResponse(
            f"https://www.facebook.com/v18.0/dialog/oauth?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&response_type=code"
        )
    # Add other platforms here...
    raise HTTPException(status_code=400, detail=f"Platform {platform} not supported for direct OAuth yet.")

@app.get("/auth/linkedin/callback")
async def linkedin_callback(code: str):
    """Handle LinkedIn OAuth callback"""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI")

    async with httpx.AsyncClient() as client_http:
        response = await client_http.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
            },
        )
        token_data = response.json()
        if "access_token" in token_data:
            tokens["LINKEDIN"] = token_data["access_token"]
            return {"message": "LinkedIn connected successfully! You can now post directly."}
        return {"error": "Failed to connect LinkedIn", "details": token_data}

@app.get("/auth/instagram/callback")
async def instagram_callback(code: str):
    """Handle Instagram OAuth callback (via Facebook)"""
    client_id = os.getenv("INSTAGRAM_CLIENT_ID")
    client_secret = os.getenv("INSTAGRAM_CLIENT_SECRET")
    redirect_uri = os.getenv("INSTAGRAM_REDIRECT_URI")

    async with httpx.AsyncClient() as client_http:
        # 1. Exchange code for access token
        response = await client_http.get(
            "https://graph.facebook.com/v18.0/oauth/access_token",
            params={
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "code": code,
            },
        )
        token_data = response.json()
        if "access_token" in token_data:
            tokens["INSTAGRAM"] = token_data["access_token"]
            return {"message": "Instagram connected successfully! (Note: Further setup might be needed for specific Instagram Business IDs)"}
        return {"error": "Failed to connect Instagram", "details": token_data}

# --- Direct Posting Routes ---

@app.post("/post/{platform}")
async def post_to_platform(platform: str, data: DirectPostRequest):
    """Post content directly to the social platform"""
    platform_key = platform.upper()
    if platform_key not in tokens:
        raise HTTPException(status_code=401, detail=f"Platform {platform} not connected. Please authenticate first.")

    token = tokens[platform_key]
    
    if platform_key == "LINKEDIN":
        # Simplified LinkedIn posting logic
        # In a real app, you'd need the member ID (URN) first
        async with httpx.AsyncClient() as client_http:
            # 1. Get Member ID
            me_res = await client_http.get(
                "https://api.linkedin.com/v2/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            member_id = me_res.json().get("id")
            
            # 2. Post Share
            post_res = await client_http.post(
                "https://api.linkedin.com/v2/ugcPosts",
                headers={"Authorization": f"Bearer {token}", "X-Restli-Protocol-Version": "2.0.0"},
                json={
                    "author": f"urn:li:person:{member_id}",
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {"text": data.text},
                            "shareMediaCategory": "NONE"
                        }
                    },
                    "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
                }
            )
            return post_res.json()

    elif platform_key == "INSTAGRAM":
        # Simplified Instagram posting logic
        # 1. Need Instagram Business Account ID (usually found via /me/accounts)
        # 2. Create container -> Publish container
        async with httpx.AsyncClient() as client_http:
            # This is a simplified version; real flow involves getting the IG ID first
            return {"message": "Direct posting to Instagram requires a linked Business Account ID. This feature is partially implemented.", "status": "pending_ig_id"}

    raise HTTPException(status_code=400, detail=f"Direct posting to {platform} not fully implemented in this demo.")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
