# 실행방법 : uvicorn app.main:app --reload port 8080

from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from .library.helpers import *
from typing import List
from pydantic.main import BaseModel
import subprocess

from app.library.helpers import toImage, save_images
from app.library.helpers import clean_src_path, get_temp_save

app = FastAPI()

# Jinja문법, templates폴더에 연결
templates = Jinja2Templates(directory = "templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

class ImagePaths(BaseModel) :
    img_path_list : List[str]

# Initialize Page
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("body_reshape.html", {"request": request})


# Complete
@app.post("/upload_image", response_model=ImagePaths)
async def upload_image(request: Request, image : UploadFile) :
    # init files
    clean_src_path()
    
    # image upload
    image_bytes = await image.read()
    image = toImage(image_bytes)

    # temp_files, save_directory
    name = save_images(image)

    # model inference
    inference(mode="image", degree=0.0)

    # output_file_path
    img_path_list = get_temp_save(name)
    img_path_list.sort()

    return ImagePaths(
        img_path_list = img_path_list
    )

# Complete
@app.post("/upload_files", response_model=ImagePaths)
async def upload_files(request: Request, degree : float, files : List[UploadFile] = File(...)) :
    # init files
    clean_src_path()
    name_list = []
    img_path_list = []

    # save multi-contents(images)
    for i,file in enumerate(files) :
        contents = await file.read()
        image = toImage(contents)
        name_list.append(save_images(image))

    inference(mode="files", degree=degree)
    for name in name_list :
        img_path_list.append(get_temp_save(name))
    img_path_list.sort()

    return ImagePaths(
        img_path_list = img_path_list
    )

# Operate Model Inference.py
def inference(mode="", degree=0.0) :
    subprocess.run([f"/home/sejin/gitfile/body_reshape_api/app/library/body_reshape/model.sh {mode} {degree}"], shell=True)


