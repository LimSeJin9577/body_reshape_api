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
