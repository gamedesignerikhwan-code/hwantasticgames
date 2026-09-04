import os
import subprocess
from PIL import Image

def generate_square_png(svg_path, out_png_path, size):
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()

    # Calculate height preserving aspect ratio 274:222
    svg_height = size * (222.0 / 274.0)

    html_content = f"""<!DOCTYPE html>
<html>
<head>
<style>
html, body {{
    margin: 0;
    padding: 0;
    background: transparent;
    width: {size}px;
    height: {size}px;
    overflow: hidden;
}}
.container {{
    width: {size}px;
    height: {size}px;
    display: flex;
    align-items: center;
    justify-content: center;
}}
svg {{
    width: {size}px;
    height: {svg_height}px;
}}
</style>
</head>
<body>
<div class="container">
{svg_content}
</div>
</body>
</html>
"""

    temp_html = os.path.abspath(f"scratch/temp_{size}.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    abs_out_png = os.path.abspath(out_png_path)
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--force-device-scale-factor=1",
        "--default-background-color=00000000",
        "--hide-scrollbars",
        f"--window-size={size},{size}",
        f"--screenshot={abs_out_png}",
        f"file:///{temp_html}"
    ]

    subprocess.run(cmd, check=True)
    img = Image.open(abs_out_png)
    print(f"Generated {out_png_path}: size={img.size}, mode={img.mode}")

brand_dir = "assets/brand"
generate_square_png(os.path.join(brand_dir, "logo-primary.svg"), os.path.join(brand_dir, "logo-primary-600.png"), 600)
generate_square_png(os.path.join(brand_dir, "logo-primary.svg"), os.path.join(brand_dir, "logo-primary-1200.png"), 1200)
generate_square_png(os.path.join(brand_dir, "logo-primary-light.svg"), os.path.join(brand_dir, "logo-primary-light-600.png"), 600)
generate_square_png(os.path.join(brand_dir, "logo-primary-light.svg"), os.path.join(brand_dir, "logo-primary-light-1200.png"), 1200)
print("All 4 square primary PNGs successfully generated.")
