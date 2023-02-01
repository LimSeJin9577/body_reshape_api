from fastapi import FastAPI, Request, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from .library.helpers import *
from app.routers import unsplash, twoforms, accordion
from typing import List
from pydantic.main import BaseModel

# uvicorn app.main:app --reload port 8080

app = FastAPI()

# Jinja문법, templates폴더에 연결
templates = Jinja2Templates(directory = "templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

# app.include_router(unsplash.router)
# app.include_router(twoforms.router)
# app.include_router(accordion.router)

# Uploaded Image *Response* Form Data
class ImagePaths(BaseModel) :
    img_path_list : List[str]

# Initialize Page
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("body_reshape.html", {"request": request})

'''
    Upload 1 Image Post Function
    > Request <
    - just 1 image file

    > Response <
    - [Images/Image_paths] image file 20~30 output with multi-scaled
'''
@app.post("/upload_image", response_model=ImagePaths)
async def upload_image(request: Request, image : UploadFile) :
    # calc 20~30 images.

    return ImagePaths(
        img_path_list = []
    )


'''
    Upload Files Post Function
    > Request <
    - folder with images
    - degree(body_reshape_model)

    > Response < 
    - [Image/Image_paths]Image Folder with guided-scaling Images
'''
@app.post("/upload_files", response_model=ImagePaths)
async def upload_image(request: Request, files : List[UploadFile]) :
    return ImagePaths(
        img_path_list = []
    )
