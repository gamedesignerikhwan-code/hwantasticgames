import os
from PIL import Image

s1_path = r"C:\Users\dream\.gemini\antigravity-ide\brain\8b2c1b24-11b2-4290-850b-09024d9aedf5\released_board_games_1786111021774.png"
out_dir = r"c:\dev\hwantasticgames\assets\devlog"
os.makedirs(out_dir, exist_ok=True)

img1 = Image.open(s1_path)

# Trim y_start to 90 to completely eliminate top white strip above Pyramido/Surfosaurus
crop_bg = img1.crop((306, 90, 856, 347))
crop_bg.save(os.path.join(out_dir, "devlog_02_published_boardgames.png"))

print("Cropped devlog_02_published_boardgames.png perfectly!")
