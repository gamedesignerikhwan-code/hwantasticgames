import os
import subprocess
from PIL import Image

brand_dir = "assets/brand"
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def render_html_to_png(html_content, out_1024_path, out_400_path):
    size = 1024
    temp_html = os.path.abspath("scratch/temp_avatar_render.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    abs_1024 = os.path.abspath(out_1024_path)
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--force-device-scale-factor=1",
        "--default-background-color=00000000",
        "--hide-scrollbars",
        f"--window-size={size},{size}",
        f"--screenshot={abs_1024}",
        f"file:///{temp_html}"
    ]
    subprocess.run(cmd, check=True)

    img_1024 = Image.open(abs_1024)
    print(f"Generated 1024: {out_1024_path}, size={img_1024.size}")

    img_400 = img_1024.resize((400, 400), Image.Resampling.LANCZOS)
    abs_400 = os.path.abspath(out_400_path)
    img_400.save(abs_400)
    print(f"Generated 400: {out_400_path}, size={img_400.size}")

# 1. Bold Studio Symbol Avatar (Card 'H' filling ~72% of canvas, perfectly safe for circle cropping)
avatar_symbol_html = """<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
    width: 1024px;
    height: 1024px;
    background: #0f1218;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}
.container {
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
}
svg {
    width: 530px;
    height: 742px;
}
</style>
</head>
<body>
<div class="container">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 146" role="img" aria-label="Hwantastic Games">
  <rect x="0" y="0" width="104.00" height="146.00" rx="8.94" fill="#ff2a75" stroke="#ff2a75" stroke-width="3.43"/>
  <path d="M768 0V584H432V0H104V1386H432V854H768V1386H1096V0Z" fill="#08090d" transform="translate(20.398 109.500) scale(0.052670 -0.052670)"/>
</svg>
</div>
</body>
</html>
"""

# 2. Bold 15-Letter Primary Logo Avatar (Filling ~86% of canvas width)
with open(os.path.join(brand_dir, "logo-primary.svg"), "r", encoding="utf-8") as f:
    logo_primary_svg = f.read()

avatar_primary_html = f"""<!DOCTYPE html>
<html>
<head>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{
    width: 1024px;
    height: 1024px;
    background: #0f1218;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}}
.container {{
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
}}
svg {{
    width: 880px;
    height: 712.85px;
}}
</style>
</head>
<body>
<div class="container">
{logo_primary_svg}
</div>
</body>
</html>
"""

print("--- Generating Proportional Avatar Symbol PNGs ---")
render_html_to_png(avatar_symbol_html, os.path.join(brand_dir, "avatar-1024.png"), os.path.join(brand_dir, "avatar-400.png"))

print("--- Generating Proportional Primary 15-letter Avatar PNGs ---")
render_html_to_png(avatar_primary_html, os.path.join(brand_dir, "avatar-primary-1024.png"), os.path.join(brand_dir, "avatar-primary-400.png"))

print("All proportional avatar PNGs generated successfully.")
