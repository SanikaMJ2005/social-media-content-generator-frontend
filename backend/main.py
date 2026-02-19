import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "YOUR_API_KEY_HERE":
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("WARNING: GEMINI_API_KEY not set correctly. Backend will run in fallback mode.")

@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.json
    platform = data.get('platform')
    prompt = data.get('prompt')
    content_type = data.get('type')  # TEXT, IMAGE, VIDEO

    if not platform or not prompt:
        return jsonify({"error": "Missing platform or prompt"}), 400

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
        if model:
            response = model.generate_content(system_prompt)
            generated_text = response.text
        else:
            # Fallback mock logic if API key is missing
            generated_text = f"✨ SUCCESS: Your backend is working and received your prompt: \"{prompt}\"!\n\nTo enable real AI content, please add your Gemini API Key to backend/.env. Currently running on {platform} in fallback mode."

        # Mock media URLs for now
        media_url = None
        video_url = None
        
        if content_type == 'IMAGE':
            media_url = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000"
        elif content_type == 'VIDEO':
            video_url = "https://www.w3schools.com/html/mov_bbb.mp4"

        return jsonify({
            "id": os.urandom(4).hex(),
            "platform": platform,
            "type": content_type,
            "text": generated_text,
            "mediaUrl": media_url,
            "videoUrl": video_url,
            "prompt": prompt
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
