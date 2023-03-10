///// LOADING SCREEN /////
function hideLoading() {
    $("#loading").addClass('loading-screen-hidden');
}
function showLoading() {
    $("#loading").removeClass('loading-screen-hidden');
}

$("#loading").click(() => {
    //뒤에 작업 클릭 안되도록 임의로 넣어놓은 것
    console.log("loading click");
});


///// SINGLE FILE OUTPUT /////
var single_output = document.getElementById("single_file_output");
var single_img_path_list = [];

$("#single_file_upload").change((function (event) {
    //싱글 파일 업로드
    try {
        showLoading();
        readSingleImage(event.target);
        workWithImage(event.target.files[0]).then((response) => {
            console.log(response);
            single_img_path_list = response["img_path_list"];
            const index = Math.floor(single_slider.value / 0.1);
            single_output.src = single_img_path_list[index];
            hideLoading();
        });
    } catch (error) {
        console.log("===error===");
        console.log(error);
        hideLoading();
    }
}));

function readSingleImage(input) {
    // 인풋 태그에 파일이 있는 경우
    if (input.files && input.files[0]) {
        // FileReader 인스턴스 생성
        const reader = new FileReader();
        // 이미지가 로드가 된 경우
        reader.onload = e => {
            const inputImage = document.getElementById("single_file_input");
            inputImage.src = e.target.result;
        }
        // reader가 이미지 읽도록 하기
        reader.readAsDataURL(input.files[0]);
    }
}

//single slider update
var single_slider = document.getElementById("single_file_slider");
var single_value = document.getElementById("single_file_slider_value");
single_value.innerHTML = single_slider.value;

single_slider.oninput = function () {
    single_value.innerHTML = this.value;
    //parameter 값에 맞는 이미지 보여주기
    single_output.src = single_img_path_list[Math.floor(this.value / 0.1)];
}


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///// MULTI FILE OUTPUT /////
var multi_input_list = []; //file list
var multi_input_len = 1;
var multi_output = document.getElementById("multi_file_output");
var multi_img_path_list = []; //output src list

var multi_index = 0;
var multi_file_prev = document.getElementById("multi_file_prev");
var multi_file_next = document.getElementById("multi_file_next");
var multi_upload_btn = document.getElementById("multi_upload_btn");
var multi_value = document.getElementById("multi_file_slider_value");

multi_file_prev.addEventListener("click", function () {
    //files - prev btn click
    if (multi_index == 0) {
        multi_index = multi_input_len - 1;
    } else {
        multi_index--;
    }
    readMultiImage(multi_input_list[multi_index]);
    multi_output.src = multi_img_path_list[multi_index];
});

multi_file_next.addEventListener("click", function () {
    //files - next btn click
    // multi_index++;
    multi_index = (multi_index + 1) % multi_input_len;
    // multi_index %= multi_input_len;
    readMultiImage(multi_input_list[multi_index]);
    multi_output.src = multi_img_path_list[multi_index];
});

//보정 사진 받아오기 버튼
multi_upload_btn.addEventListener("click", function () {
    //API 연결
    if (multi_input_list.length == 0) {
        alert("파일을 넣어주세요");
        return;
    }
    else if (multi_value.value == "" || parseInt(multi_value.value) > 1 || parseInt(multi_value.value) > 0) {
        alert("degree를 0~1 사이로 입력해주세요");
        return;
    }
    showLoading();
    workWithFiles(multi_value.value, multi_input_list)
        .then((response) => {
            console.log(response);
            multi_img_path_list = response["img_path_list"];
            multi_output.src = multi_img_path_list[multi_index];
            hideLoading();
        })
        .catch((e) => {
            hideLoading();
        });
});

$("#multi_file_upload").change((function (event) {
    //파일 업로드 감지
    try {
        multi_index = 0;
        //file 저장, 이미지 보여주기
        if (event.target.files && event.target.files[0]) {
            multi_input_list = event.target.files;
            multi_input_len = multi_input_list.length;
            readMultiImage(multi_input_list[multi_index]);
        }
    } catch (error) {
        console.log("===error===");
        console.log(error);
    }
}));

function readMultiImage(file) {
    // FileReader 인스턴스 생성
    const reader = new FileReader();
    // 이미지가 로드가 된 경우
    reader.onload = file => {
        const inputImage = document.getElementById("multi_file_input");
        inputImage.src = file.target.result;
    }
    // reader가 이미지 읽도록 하기
    reader.readAsDataURL(file);
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///// API FUNCTION /////
const workWithImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return await $.ajax({
        url: '/upload_image/',
        type: 'post',
        enctype: 'multipart/form-data',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            return result.data;
        }
    }).catch((e) => {
        console.log(e);
        throw e;
    });
}

const workWithFiles = async (degree, files) => {
    const formData = new FormData();

    var file_len = files.length;
    for (var x = 0; x < file_len; x++) {
        formData.append("files", files[x]);
    }

    return await $.ajax({
        url: '/upload_files?degree=' + degree,
        type: 'post',
        enctype: 'multipart/form-data',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            return result.data;
        }
    }).catch((e) => {
        console.log(e);
        throw e;
    });
}


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///// NOT USE /////
// /* 박스 안에 Drag를 하고 있을 때 */
// $("#single_file_drop_zone").on("dragover", function (event) {
//     event.preventDefault();
//     event.stopPropagation();
//     $(this).addClass('dragging');
//     dragOverHandler(event);
// });

// /* 박스 밖으로 Drag가 나갈 때 */
// $("#single_file_drop_zone").on("dragleave", function (event) {
//     event.preventDefault();
//     event.stopPropagation();
//     $(this).removeClass('dragging');
//     dragOverHandler(event);
// });

// /* 박스 안에서 Drag를 Drop했을 때 */
// $("#single_file_drop_zone").on("drop", function (event) {
//     event.preventDefault();
//     // event.stopPropagation();
//     dropHandler(event);
// });


// function dropHandler(ev) {
//     console.log('File(s) dropped');

//     // Prevent default behavior (Prevent file from being opened)
//     ev.preventDefault();

//     console.log(ev);
//     console.log(ev.dataTransfer);

//     if (ev.dataTransfer.items) {
//         // Use DataTransferItemList interface to access the file(s)
//         [...ev.dataTransfer.items].forEach((item, i) => {
//             // If dropped items aren't files, reject them
//             if (item.kind === 'file') {
//                 const file = item.getAsFile();
//                 console.log(`… file[${i}].name = ${file.name}`);
//             }
//         });
//     } else {
//         // Use DataTransfer interface to access the file(s)
//         [...ev.dataTransfer.files].forEach((file, i) => {
//             console.log(`… file[${i}].name = ${file.name}`);
//         });
//     }
// }

// function dragOverHandler(ev) {
//     console.log('File(s) in drop zone');

//     // Prevent default behavior (Prevent file from being opened)
//     ev.preventDefault();
// }