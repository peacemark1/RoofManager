#!/usr/bin/env python3
"""
RoofManager Image Generation Script using HuggingFace API

Usage:
  export HF_TOKEN="your_huggingface_token"
  python scripts/generate_images.py
"""

import os
import sys
from pathlib import Path
from huggingface_hub import InferenceClient

# Configuration - Use environment variable
HF_TOKEN = os.environ.get("HF_TOKEN", "")
OUTPUT_DIR = Path("frontend/public/images")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Image prompts for generation
IMAGES_TO_GENERATE = [
    # Feature Icons (200x200 circular icons)
    {
        "filename": "feature-payments.png",
        "prompt": "Invoice document, credit card, Ghana Cedis GHS symbol, payment success checkmark, professional business style, gold green accents, circular icon format, 200x200px transparent background",
        "width": 512,
        "height": 512
    },
    {
        "filename": "feature-sms.png",
        "prompt": "Phone message UI, Hubtel style SMS notification, roofing job update text, Ghana phone format, green messaging app design, circular icon format, 200x200px transparent background",
        "width": 512,
        "height": 512
    },
    {
        "filename": "feature-analytics.png",
        "prompt": "Data analytics dashboard, charts graphs, performance metrics, revenue trends, property health scores, blue teal business data, circular icon format, 200x200px transparent background",
        "width": 512,
        "height": 512
    },
    
    # Testimonial Avatars (100x100)
    {
        "filename": "testimonial-avatar-1.png",
        "prompt": "Professional Ghanaian business man headshot portrait, corporate attire, neutral expression, soft lighting, clean background, professional headshot style, 100x100px",
        "width": 256,
        "height": 256
    },
    {
        "filename": "testimonial-avatar-2.png",
        "prompt": "Professional Ghanaian woman headshot portrait, corporate attire, friendly expression, soft lighting, clean background, professional headshot style, 100x100px",
        "width": 256,
        "height": 256
    },
    {
        "filename": "testimonial-avatar-3.png",
        "prompt": "Ghanaian construction manager headshot, professional attire, safety gear hint, confident expression, clean background, corporate style, 100x100px",
        "width": 256,
        "height": 256
    },
    {
        "filename": "testimonial-avatar-4.png",
        "prompt": "Ghanaian business owner headshot, corporate suit, confident smile, professional lighting, clean background, executive style, 100x100px",
        "width": 256,
        "height": 256
    },
    
    # Pricing Background (1920x600)
    {
        "filename": "pricing-background.png",
        "prompt": "Abstract geometric pattern SaaS pricing section, Ghana colors red gold green accents, dark navy background, modern tech gradient, seamless pattern, 1920x600px",
        "width": 1920,
        "height": 600
    },
    
    # Company Logo Placeholder
    {
        "filename": "logo-placeholder.png",
        "prompt": "Roofing company logo placeholder icon, modern tech aesthetic, shingle house icon, text YOUR LOGO below, scalable vector style, dark transparent background, professional design, 400x150px",
        "width": 400,
        "height": 150
    },
    
    # Error/Empty States
    {
        "filename": "error-404.png",
        "prompt": "404 error illustration, roof construction theme, friendly character mascot, professional design, dark theme compatible, 500x400px",
        "width": 500,
        "height": 400
    },
    {
        "filename": "empty-leads.png",
        "prompt": "Empty leads inbox illustration, folder with question mark, roof business theme, friendly professional corporate style, 300x200px",
        "width": 300,
        "height": 200
    },
    {
        "filename": "empty-jobs.png",
        "prompt": "Calendar with checkmark, no jobs scheduled illustration, clean modern design, professional business style, 300x200px",
        "width": 300,
        "height": 200
    },
    
    # Trust Badge
    {
        "filename": "trust-badge-security.png",
        "prompt": "Security shield badge with checkmark, GDPR compliant icon, ISO certification style, professional flat design, 150x150px transparent background",
        "width": 150,
        "height": 150
    }
]

def generate_image(client, prompt, width, height, filename):
    """Generate a single image using FLUX.1-schnell model."""
    print(f"[GEN] {filename}...")
    
    try:
        # Using FLUX.1-schnell for fast generation
        image = client.text_to_image(
            prompt,
            model="black-forest-labs/FLUX.1-schnell",
            width=width,
            height=height,
            num_inference_steps=4
        )
        
        output_path = OUTPUT_DIR / filename
        image.save(output_path)
        print(f"[OK] Saved: {output_path}")
        return True
        
    except Exception as e:
        print(f"[FAIL] {filename}: {e}")
        return False

def main():
    """Main function to generate all images."""
    print("[START] RoofManager image generation")
    print(f"[DIR] Output: {OUTPUT_DIR}")
    print("-" * 50)
    
    # Initialize HuggingFace client
    client = InferenceClient(token=HF_TOKEN)
    
    # Track results
    success_count = 0
    fail_count = 0
    
    for image_config in IMAGES_TO_GENERATE:
        success = generate_image(
            client,
            image_config["prompt"],
            image_config["width"],
            image_config["height"],
            image_config["filename"]
        )
        
        if success:
            success_count += 1
        else:
            fail_count += 1
        
        # Small delay between requests to avoid rate limiting
        import time
        time.sleep(2)
    
    print("-" * 50)
    print("[DONE] Generation complete!")
    print(f"[OK] Success: {success_count}")
    print(f"[FAIL] Failed: {fail_count}")
    print(f"[DIR] Location: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
