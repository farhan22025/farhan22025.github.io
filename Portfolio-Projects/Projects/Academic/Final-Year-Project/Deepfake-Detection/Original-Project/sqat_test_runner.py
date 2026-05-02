import os
import requests
import time
import json

# Setup directories
os.makedirs('sqat_assets', exist_ok=True)

test_cases = [
    {
        "type": "image",
        "label": "Fake (GAN)",
        "url": "https://thispersondoesnotexist.com",
        "filename": "sqat_assets/fake_face.jpg",
        "desc": "Modern GAN Face"
    },
    {
        "type": "image",
        "label": "Real (Photo)",
        "url": "https://source.unsplash.com/random/500x500/?human,face",
        "filename": "sqat_assets/real_face.jpg",
        "desc": "Real Unsplash Human Face"
    },
    {
        "type": "image",
        "label": "Real (Scenery)",
        "url": "https://source.unsplash.com/random/500x500/?nature",
        "filename": "sqat_assets/real_nature.jpg",
        "desc": "Real Nature Photo"
    },
    {
        "type": "text",
        "label": "Fake (AI Text)",
        "content": "In today's fast-paced digital landscape, the synergistic paradigm of artificial intelligence represents a transformative milestone. It is crucial to leverage these cutting-edge methodologies to foster unparalleled growth. Furthermore, it goes without saying that unlocking this potential will revolutionize the industry.",
        "desc": "ChatGPT-style generated corporate speak"
    },
    {
        "type": "text",
        "label": "Real (Human Text)",
        "content": "The Constitution of the United States is the supreme law of the United States of America. It superseded the Articles of Confederation, the nation's first constitution, in 1789. Originally comprising seven articles, it delineates the national frame of government.",
        "desc": "Wikipedia excerpt of US Constitution"
    }
]

def download_image(url, filename):
    headers = {'User-Agent': 'Mozilla/5.0'}
    # unsplash source has been deprecated and redirects, let's use alternative if it fails
    if "unsplash" in url:
        url = url.replace("source.unsplash.com", "images.unsplash.com")
        # Since unsplash source is gone, use a direct image link
        if "human" in url:
            url = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80"
        else:
            url = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80"
            
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

results = []

print("=== Starting SQAT Deepfake Platform Verification ===")
API_URL = "http://localhost:8000/api/detect"

for case in test_cases:
    print(f"\nTesting: {case['desc']} ({case['label']})")
    files = None
    data = {}
    
    if case['type'] == 'image':
        success = download_image(case['url'], case['filename'])
        if not success:
            print("Download failed, skipping.")
            continue
        files = {'file': open(case['filename'], 'rb')}
    else:
        data = {'text_content': case['content']}
        
    try:
        start_time = time.time()
        resp = requests.post(API_URL, files=files, data=data)
        latency = time.time() - start_time
        
        if resp.status_code == 200:
            res_json = resp.json()
            verdict = res_json.get('prediction', 'UNKNOWN')
            conf = res_json.get('confidence', '0%')
            print(f"Result: {verdict} ({conf}) - Latency: {latency:.2f}s")
            
            # Close file if it's an image
            if files:
                files['file'].close()
                
            results.append({
                "Test Case": case['desc'],
                "Expected": case['label'],
                "Verdict": verdict,
                "Confidence": conf,
                "Latency (s)": round(latency, 2),
                "Reasons": res_json.get('reasons', [])
            })
        else:
            print(f"API Error: {resp.status_code}")
    except Exception as e:
        print(f"Request failed: {e}")

print("\n=== SQAT Run Complete ===")

# Generate Markdown Report
md_content = "# SQAT Report: Multimodal Deepfake Defense Platform\n\n"
md_content += "## Verification Results\n\n"
md_content += "| Test Case | Expected | Verdict | Confidence | Latency (s) |\n"
md_content += "|---|---|---|---|---|\n"

for r in results:
    md_content += f"| {r['Test Case']} | {r['Expected']} | **{r['Verdict']}** | {r['Confidence']} | {r['Latency (s)']} |\n"

md_content += "\n## Forensic Analysis Samples\n\n"
for r in results:
    md_content += f"### {r['Test Case']}\n"
    for reason in r['Reasons']:
        md_content += f"- {reason}\n"
    md_content += "\n"

with open('sqat_assets/SQAT_Report.md', 'w', encoding='utf-8') as f:
    f.write(md_content)
    
print("Report generated at sqat_assets/SQAT_Report.md")
