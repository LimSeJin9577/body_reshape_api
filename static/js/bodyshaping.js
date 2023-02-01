

$("#single_file_upload").change((function (event) {
    try {
        readImage(event.target);
        workWithImage(event.target.files[0]).then((response) => {
            console.log("ss");
        });
    } catch (error) {
        console.log("===error===");
        console.log(error);
    }
}));

function readImage(input) {
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

//slider update
var slider = document.getElementById("single_file_slider");
var value = document.getElementById("single_file_slider_value");
value.innerHTML = slider.value;

slider.oninput = function () {
    value.innerHTML = this.value;
    //TODO: 이미지 다르게 보여주기
}


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

///// API FUNCTION /////
const workWithImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return $.ajax({
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


function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    console.log(ev);
    console.log(ev.dataTransfer);

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === 'file') {
                const file = item.getAsFile();
                console.log(`… file[${i}].name = ${file.name}`);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
        });
    }
}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}