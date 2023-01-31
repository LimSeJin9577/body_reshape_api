
// Detect
function detect (URL, callback) {
  let imgWidth;
  let imgHeight;
  let image = new Image();
  image.src = URL;
  image.onload = function () {
    imgWidth = this.width;
    imgHeight = this.height;
    callback({ imgWidth, imgHeight });
  };
}

// Drag and Drop >> 신경 쓰지말자.
function dragdrop () {
  // preventing page from redirecting
  $("html").on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#howto").text("Drag here");
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


// Main Function, Main Process
$(function () {
  dragdrop();

  function preparedata (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    detect(img.src, function (result) {
      let winWidth = $(window).width();
      let imgWidth = result.imgWidth;
      let imgHeight = result.imgHeight;
      let data = { 'winWidth': winWidth, 'imgWidth': imgWidth, 'imgHeight': imgHeight };
      let jdata = JSON.stringify(data);
      let fd = new FormData();

//      console.log("jdata : " + jdata)
      fd.append('imgdata', jdata);
      fd.append('file', file);
      uploadData(fd);
    });
  }

  // Drop
  $('.upload-area').on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#howto").text("We are uploading your file.");
    let file = e.originalEvent.dataTransfer.files;
    let imageType = /image.*/;
    let winWidth = $("#window_width").val();
    let dropped = file[0];
    console.log("dropped :" + file)
    if (dropped.type.match(imageType)) {
      preparedata(dropped);
    } else {
      $("#howto").text("Please use an image file. Try one more time.");
    }
  });

  // Open file selector on div click
  $("#uploadfile").click(function () {
    $("#file").click();
  });

  // file selected
  $("#file").change(function () {
    let imageType = /image.*/;
    let file = $('#file')[0].files[0];
    $("#howto").text("Uploading your file.");

    console.log("file[0] :" + file)
    if (file.type.match(imageType)) {
      preparedata(file);
    } else {
      $("#howto").text("Please use an image file. Try one more time.");
    }
  });
});

// Sending AJAX request and upload file
function uploadData (formdata) {

  $.ajax({
    url: '/upload/new/',
    type: 'post',
    enctype: 'multipart/form-data',
    data: formdata,
    contentType: false,
    processData: false,
    success: function (data) {
      updatetags(data);
    }
  });
}

function updatetags (data) {
  let original = `<img src="/${data.thumb_path}" class="responsive" alt="">`;
  $("#original").html(original);

  $("#howto").html("Drag and Drop file here<br />Or<br />Click to Upload")
}