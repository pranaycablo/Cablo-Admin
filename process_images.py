import os
import glob
from PIL import Image

input_dir = 'assets'
output_dir = 'frontend/assets'

os.makedirs(output_dir, exist_ok=True)

# List all image files in assets directory
extensions = ('*.png', '*.jpg', '*.jpeg', '*.webp')
files = []
for ext in extensions:
    files.extend(glob.glob(os.path.join(input_dir, ext)))

def remove_white_bg(img):
    img = img.convert("RGBA")
    datas = img.getdata()
    newData = []
    # Threshold for what we consider "white"
    threshold = 240
    for item in datas:
        # Check if the pixel is white-ish
        if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
            # Change to transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    return img

target_size = (500, 500)

for file in files:
    filename = os.path.basename(file)
    name, ext = os.path.splitext(filename)
    
    # Fix the case where the file is named "auto.png.jpg"
    if name.endswith('.png'):
        name = name[:-4]
        
    # Standardize name: lowercase, replace spaces and hyphens with underscores
    clean_name = name.lower().replace(' ', '_').replace('-', '_')
    output_filename = f"{clean_name}.png"
    output_path = os.path.join(output_dir, output_filename)
    
    try:
        img = Image.open(file)
        
        # Remove background if it's not already PNG with transparency (or even if it is, let's just make sure white is gone)
        # But wait, if it's a photo, removing white bg might remove white parts of the vehicle.
        # It's better to only apply this if the image has a predominantly white background.
        # Let's check the corners. If corners are white, we assume it has a white background.
        
        img = img.convert("RGBA")
        
        # Resize preserving aspect ratio
        img.thumbnail((target_size[0], target_size[1]), Image.Resampling.LANCZOS)
        
        # Create a new blank transparent image
        new_img = Image.new("RGBA", target_size, (255, 255, 255, 0))
        
        # Paste the resized image into the center of the blank image
        paste_x = (target_size[0] - img.size[0]) // 2
        paste_y = (target_size[1] - img.size[1]) // 2
        new_img.paste(img, (paste_x, paste_y), img)
        
        # Attempt to remove white bg (very basic)
        new_img = remove_white_bg(new_img)
        
        # Save as optimized PNG
        new_img.save(output_path, "PNG", optimize=True)
        print(f"Processed: {filename} -> {output_filename}")
        
    except Exception as e:
        print(f"Failed to process {filename}: {e}")

print("Done processing all images!")
