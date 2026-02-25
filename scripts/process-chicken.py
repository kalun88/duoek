"""
Run this once after dropping chicken-new.png into public/images/:
  python3 scripts/process-chicken.py
Removes the black background and saves as public/images/chicken.png
"""
from PIL import Image
import os, sys

src = os.path.join(os.path.dirname(__file__), "../public/images/chicken-new.png")
dst = os.path.join(os.path.dirname(__file__), "../public/images/chicken.png")

if not os.path.exists(src):
    print("❌  public/images/chicken-new.png not found — drop it in first.")
    sys.exit(1)

img = Image.open(src).convert("RGBA")
data = list(img.getdata())
new_data = []
for r, g, b, a in data:
    # Remove black / near-black background
    if r < 40 and g < 40 and b < 40:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append((r, g, b, a))
img.putdata(new_data)
img.save(dst)
print(f"✅  Saved transparent chicken → {dst}")
