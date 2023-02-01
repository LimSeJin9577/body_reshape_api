import os.path
import uuid
from pathlib import Path
import markdown
from glob import glob
import cv2
import numpy as np

def create_workspace():
    """
    Return workspace path
    """
    # base directory
    work_dir = Path('static/upload/')

    # 나중에 안정화 되면 지우는 기능 넣자!
    # os.remove(work_dir)

    # UUID to prevent file overwrite
    request_id = Path(str(uuid.uuid4())[:8])
    # path concat instead of work_dir + '/' + request_id
    workspace = work_dir / request_id
    if not os.path.exists(workspace):
        # recursively create workdir/unique_id
        os.makedirs(workspace)

    return workspace

def openfile(filename):
    filepath = os.path.join("app/pages/", filename)
    with open(filepath, "r", encoding="utf-8") as input_file:
        text = input_file.read()

    html = markdown.markdown(text)
    data = {
        "text": html
    }
    return data

def clean_src_path() :
    src_files = glob("static/resources/temp_src/*")
    save_files = glob("static/resources/temp_save/*")
    for f in src_files : 
        os.remove(f)
    for sf in save_files :
        os.remove(sf)

def get_temp_save(name) :
    return glob(f"static/resources/temp_save/{name}*")

def save_images(image) :
    request_id = Path(str(uuid.uuid4())[:8])
    name = f"temp{request_id}"
    file_path = f"static/resources/temp_src/{name}.jpg"
    cv2.imwrite(file_path, image)
    return name

def toImage(image_bytes) :
    img = np.fromstring(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    return img

