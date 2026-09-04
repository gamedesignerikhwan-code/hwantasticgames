import os
import subprocess
from PIL import Image

brand_dir = "assets/brand"
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def render_svg_to_png(svg_string, out_1024_path, out_400_path, bg_color="#0f1218"):
    size = 1024
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{
    width: {size}px;
    height: {size}px;
    background: {bg_color};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}}
.wrap {{
    width: {size}px;
    height: {size}px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px;
}}
svg {{
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
}}
</style>
</head>
<body>
<div class="wrap">
{svg_string}
</div>
</body>
</html>
"""

    temp_html = os.path.abspath("scratch/temp_fix_avatar.html")
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

# 1. Avatar Symbol (from icon.svg content)
with open(os.path.join(brand_dir, "icon.svg"), "r", encoding="utf-8") as f:
    icon_svg_content = f.read()

# 2. Primary 15-letter Logo Avatar (from logo-primary.svg content)
with open(os.path.join(brand_dir, "logo-primary.svg"), "r", encoding="utf-8") as f:
    logo_primary_svg_content = f.read()

print("--- Generating Avatar Symbol PNGs ---")
render_svg_to_png(
    icon_svg_content,
    os.path.join(brand_dir, "avatar-1024.png"),
    os.path.join(brand_dir, "avatar-400.png"),
    bg_color="#0f1218"
)

print("--- Generating Primary 15-letter Logo Avatar PNGs ---")
render_svg_to_png(
    logo_primary_svg_content,
    os.path.join(brand_dir, "avatar-primary-1024.png"),
    os.path.join(brand_dir, "avatar-primary-400.png"),
    bg_color="#0f1218"
)

print("Done generating all avatars.")
