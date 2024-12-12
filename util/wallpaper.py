# Use latest Himawari 8 photo as wallpaper for Windows user

from datetime import datetime, timezone, timedelta
import requests
import ctypes
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
import os

minutes_before = 30
resolution = 1500
max_retry = 10
slices = 4

base_path = r"E:\myblog\source\util"
font_path = r"C:\Windows\Fonts\times.ttf"
earth_img_path = base_path + r"\latest-earth.jpg"
wallpaper_img_path = base_path + r"\wallpaper.jpg"

# Get the current time in UTC
utc_now = datetime.now(timezone.utc)

# Subtract one day from the current time to get yesterday's timestamp
yesterday = utc_now - timedelta(days=1)

# Adjust the time to the nearest rounded 10 minutes
formatted_time = yesterday - timedelta(
    minutes=yesterday.minute % 10,  # Align to 10-minute intervals
    seconds=yesterday.second,
)

# Format year, month, day with leading zeros
formatted_year = f"{formatted_time.year:04d}"
formatted_month = f"{formatted_time.month:02d}"
formatted_day = f"{formatted_time.day:02d}"

def download_earth_img():
    print("Starting image download...")
    for i in range(slices):
        for j in range(slices):
            url = "https://himawari8.nict.go.jp/img/D531106/4d/550/{}/{}/{}/{:02d}{:02d}{:02d}_{}_{}.png".format(
                formatted_year,
                formatted_month,
                formatted_day,
                formatted_time.hour,
                formatted_time.minute,
                formatted_time.second,
                i,
                j,
            )
            retry_cnt = 1

            while True:
                try:
                    response = requests.get(url)
                    response.raise_for_status()
                    print(f"Downloaded {url} successfully.")
                    break
                except Exception as e:
                    if retry_cnt >= max_retry:
                        print(f"max retry exceeded: {e}")
                        break
                    print(f"retrying... {retry_cnt}")
                    retry_cnt += 1

            temp_img_path = base_path + "/temp_{}_{}.png".format(i, j)

            with open(temp_img_path, "wb") as f:
                f.write(response.content)
            print(f"Saved temp image {temp_img_path}")

    imgs = []
    for j in range(slices):
        for i in range(slices):
            temp_img_path = base_path + "/temp_{}_{}.png".format(i, j)
            img = cv2.imread(temp_img_path)
            if img is None:
                print(f"Failed to read image {temp_img_path}")
            imgs.append(img)

    if len(imgs) == 0:
        print("No images were downloaded successfully.")
        return

    rows = []
    for i in range(0, slices * slices, slices):
        row = np.hstack(imgs[i:i + slices])
        rows.append(row)
    earth_img = np.vstack(rows)
    earth_img = cv2.resize(earth_img, (resolution, resolution))

    if cv2.imwrite(earth_img_path, earth_img):
        print(f"Earth image saved to {earth_img_path}")
    else:
        print(f"Failed to save earth image to {earth_img_path}")

def color_correct(img_path, new_img_path):
    print(f"Starting color correction for {img_path}...")
    img = cv2.imread(img_path)
    if img is None:
        print(f"Failed to read image {img_path}")
        return

    def levels(img, thres):
        inBlack  = np.array([0, 0, 0], dtype=np.float32)
        inWhite  = np.array([255, 255, 255], dtype=np.float32)
        inGamma  = np.array([thres, thres, thres], dtype=np.float32)
        outBlack = np.array([0, 0, 0], dtype=np.float32)
        outWhite = np.array([255, 255, 255], dtype=np.float32)

        img = np.clip( (img - inBlack) / (inWhite - inBlack), 0, 255 )
        img = ( img ** (1/inGamma) ) *  (outWhite - outBlack) + outBlack
        img = np.clip( img, 0, 255).astype(np.uint8)

        return img

    img = levels(img, 1.30)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(img)
    s = cv2.add(s, 0.15)
    img = cv2.merge((h, s, v))
    img = cv2.cvtColor(img, cv2.COLOR_HSV2BGR)

    b, g, r = cv2.split(img)
    new_r = 0.2 * g + 0.8 * r
    new_g = 0.33 * r + 0.66 * g
    new_b = 0.2 * r + 0.8 * b
    new_img = cv2.merge((new_b, new_g, new_r))

    new_img = levels(new_img, 1.40)

    if cv2.imwrite(new_img_path, new_img):
        print(f"Color-corrected image saved to {new_img_path}")
    else:
        print(f"Failed to save color-corrected image to {new_img_path}")

def generate_wallpaper():
    print("Generating wallpaper...")
    wallpaper = Image.new("RGB", (3840, 2160), "black")
    try:
        earth_img = Image.open(earth_img_path)
    except Exception as e:
        print(f"Error opening earth image: {e}")
        return

    start_x = (wallpaper.width - earth_img.width) // 2
    start_y = (wallpaper.height - earth_img.height) // 2
    wallpaper.paste(earth_img, (start_x, start_y))

    draw = ImageDraw.Draw(wallpaper)
    text = f"Last Update: {formatted_time.astimezone().strftime('%Y-%m-%d %H:%M:%S')}"
    text_width = draw.textlength(
        text, font=ImageFont.truetype(font_path, 25)
    )
    draw.text(
        ((wallpaper.width - text_width) / 2, wallpaper.height - 200),
        text,
        fill=(100, 100, 100, 100),
        font=ImageFont.truetype(font_path, 25),
    )

    if wallpaper.save(wallpaper_img_path):
        print(f"Wallpaper saved to {wallpaper_img_path}")
    else:
        print(f"Failed to save wallpaper to {wallpaper_img_path}")

if __name__ == '__main__':
    print("Starting wallpaper creation process...")
    download_earth_img()
    color_correct(earth_img_path, earth_img_path)
    generate_wallpaper()

    # Check if the wallpaper was generated before applying it
    if os.path.exists(wallpaper_img_path):
        ctypes.windll.user32.SystemParametersInfoW(20, 0, wallpaper_img_path, 0)
        print(f"Wallpaper applied successfully.")
    else:
        print(f"Failed to apply wallpaper. No image found at {wallpaper_img_path}")
