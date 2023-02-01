# body_reshape_api
body_reshape_api for codime  

# Main Page
### GET Main Page
[GET]  
URL : "/"  
HTML : "body_reshape.html"  
REQUEST_TYPE : *request  
RESPONSE_TYPE : HTML  

### POST with 1 image
[POST]  
URL : "/upload_image/"  
REQUEST_TYPE : *request *UploadFile  
RESPONSE_TYPE : List(str)  
    - output image paths 

### POST with multi-images(file)
[POST]  
URL : "/upload_files/"  
REQUEST_TYPE : *request *List[UploadFlie]  
RESPONSE_TYPE : List(str)  
    - output image paths

<hr>  
### Google Drive model_path
https://drive.google.com/drive/folders/1-_qEqwZuL6bXLqPNHq8gAEe4_9FhNv7o?usp=sharing  
  
<Directions>  
body_reshape_api  
    ㄴ app  
        ㄴ library  
            ㄴ body_reshape  
                ㄴ models  
                    ㄴ body_reshape_model.pth
                    ㄴ body_pose_model.pth
