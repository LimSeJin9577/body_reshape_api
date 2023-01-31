from fastapi import Request, Form, APIRouter, File, UploadFile
from fastapi.responses import HTMLResponse
from pydantic.main import BaseModel
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates/")


@router.get("/body_reshape", response_class=HTMLResponse)
def get_pages(request: Request):
    return templates.TemplateResponse('body_reshape.html', context={'request': request})

class UploadedImage(BaseModel) :
    temp_list : List[str]

@router.post("/body_reshape/upload_image", response_class=HTMLResponse)
def post_upload_image(request: Request, response_model = UploadedData):
    async def post_upload(request:Request, image: UploadFile,):