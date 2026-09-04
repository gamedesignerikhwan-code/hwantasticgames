import os
import subprocess
from PIL import Image

brand_dir = "assets/brand"
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def render_html_to_png(html_content, out_png_path, size):
    temp_html = os.path.abspath(f"scratch/temp_avatar_{size}.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    abs_out = os.path.abspath(out_png_path)
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--force-device-scale-factor=1",
        "--default-background-color=00000000",
        "--hide-scrollbars",
        f"--window-size={size},{size}",
        f"--screenshot={abs_out}",
        f"file:///{temp_html}"
    ]
    subprocess.run(cmd, check=True)
    img = Image.open(abs_out)
    print(f"Generated {out_png_path}: size={img.size}, mode={img.mode}")

# 1. Avatar Symbol (H Card Symbol on solid #0f1218 background)
avatar_symbol_html = """<!DOCTYPE html>
<html>
<head>
<style>
html, body {
    margin: 0;
    padding: 0;
    background: #0f1218;
    width: 1000px;
    height: 1000px;
    overflow: hidden;
}
.container {
    width: 1000px;
    height: 1000px;
    display: flex;
    align-items: center;
    justify-content: center;
}
svg {
    width: 600px;
    height: 600px;
}
</style>
</head>
<body>
<div class="container">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" role="img" aria-label="Hwantastic Games">
  <rect x="33.14" y="8.00" width="125.71" height="176.00" rx="10.81" fill="#ff2a75" stroke="#ff2a75" stroke-width="3.77"/>
  <path d="M768 0V584H432V0H104V1386H432V854H768V1386H1096V0Z" fill="#08090d" transform="translate(62.822 134.332) scale(0.055314 -0.055314)"/>
</svg>
</div>
</body>
</html>
"""

# 2. Primary 15-letter Logo Avatar on solid #0f1218 background
with open(os.path.join(brand_dir, "logo-primary.svg"), "r", encoding="utf-8") as f:
    logo_primary_svg = f.read()

avatar_primary_html = f"""<!DOCTYPE html>
<html>
<head>
<style>
html, body {{
    margin: 0;
    padding: 0;
    background: #0f1218;
    width: 1000px;
    height: 1000px;
    overflow: hidden;
}}
.container {{
    width: 1000px;
    height: 1000px;
    display: flex;
    align-items: center;
    justify-content: center;
}}
svg {{
    width: 840px;
    height: 680px;
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

# Generate Symbol Avatars (Solid Background)
render_html_to_png(avatar_symbol_html, os.path.join(brand_dir, "avatar-400.png"), 400)
render_html_to_png(avatar_symbol_html, os.path.join(brand_dir, "avatar-1024.png"), 1024)

# Generate 15-letter Primary Avatars (Solid Background)
render_html_to_png(avatar_primary_html, os.path.join(brand_dir, "avatar-primary-400.png"), 400)
render_html_to_png(avatar_primary_html, os.path.join(brand_dir, "avatar-primary-1024.png"), 1024)

print("Avatar PNG generation completed.")
