// Sending AJAX request and upload file

// Drag and Drop >> 신경 쓰지말자.
function dragdrop () {
  // preventing page from redirecting
  $("html").on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#howto").text("Drag and Drop file here");
  });

  $("html").on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // Drag enter
  $('.upload-area').on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("Drop");
  });

  // Drag over
  $('.upload-area').on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("Drop");
  });
}

$(function () {
    dragdrop();

    function just_datas(file) {
        let files = new FormData();
        for (var i = 0; i < file.length; i++) {
            if (file[i].name.includes("_p")) {
                files.append("image_parse", file.item(i));
            } else if (file[i].name.includes("_gp")){
                files.append("garment_parsing", file.item(i));
            } else if (file[i].name.includes(".json")) {
                files.append("keypoints", file.item(i));
            } else {
                files.append("image", file[i])
            }
        }
        for (var pair of files.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
        uploadData(files)
    }

    // Drop
//    $('.upload-area').on('drop', function (e) {
//        e.stopPropagation();
//        e.preventDefault();
//        $("#howto").text("We are uploading your file.");
//        let file = e.originalEvent.dataTransfer.files;
//        console.log("file :: " + file)
//        console.log("file length :: " + file.length)
//        console.log("file item :: " + file.item(0))
//        just_datas(file)
//    });

    // Open file selector on div click
    $("#uploadfile").click(function () {
        $("#file").click();
    });

    // file selected
    $("#file").change(function () {
        let file = $('#file')[0].files
        console.log("file :: " + file)
        console.log("file length :: " + file.length)
        console.log("file item :: " + file.item(0))
        just_datas(file)
    });
});


function uploadData (formdata) {
    fetch( '/upload/new/', {method: 'POST', body: formdata})
    .then(response => response.json()).then(data => {
        console.log("여긴 됨?")
        updatetags(data)
    }).catch(error => {
        console.log(error)
    })
}

function updatetags (data) {
//// 이미지 저장을 요기서 하자.
    let original = `<img src="/${data.img_path}" class="responsive" alt="">`;
    let keypoints = `<img src="/${data.kp_path}" class="responsive" alt="">`;
    let result1 = `<img src="/${data.result1}" class="responsive" alt="">`;
    let result2 = `<img src="/${data.result2}" class="responsive" alt="">`;
    let result3 = `<img src="/${data.result3}" class="responsive" alt="">`;
    
    $("#original").html(original);
    $("#keypoints").html(keypoints);
    $("#result1").html(result1);
    $("#result2").html(result2);
    $("#result3").html(result3);


    $("#howto").html("Drag and Drop file here<br />Or<br />Click to Upload")
}