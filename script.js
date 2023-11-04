function handleImage(input) {
    var preview = document.getElementById('preview');
    var textAbovePreview = document.getElementById('textAbovePreview');
    preview.innerHTML = '';
  
    var end_point_url = "http://localhost:5000/api/predict/animal";
  
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.classList.add('preview-image');
  
        base64String = reader.result;
  
        // แสดง "Predicted Loading..." ในรอบการส่งข้อมูล
        textAbovePreview.textContent = 'Predicted Loading...';
  
        fetch(end_point_url, {
          method: "POST",
          body: JSON.stringify({ img_base64: base64String }),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("ไม่สามารถดึงข้อมูลได้");
            }
          })
          .then((json) => {
            let animal = json.Animal;
            console.log(json);
            console.log("Animal -> " + animal);
            // แสดงผลลัพธ์ JSON ใน textAbovePreview
            // textAbovePreview.textContent = 'Predicted: ' + JSON.stringify(json);
            textAbovePreview.textContent = 'Predicted: ' + animal;
          })
          .catch((error) => {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูล: " + error);
            // ในกรณีที่เกิดข้อผิดพลาด, ก็แสดงข้อความ "Predicted Loading..." อีกครั้ง
            textAbovePreview.textContent = 'Predicted Loading...';
          });
  
        image.onload = function () {
          // Resize the image to fit within 500x500 pixels
          resizeImage(image, 500, 500, function (resizedImage) {
            preview.appendChild(resizedImage);
          });
        };
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  
    var fileName = input.files[0] ? input.files[0].name : 'No file selected';
    textAbovePreview.textContent = 'Selected File: ' + fileName;
  }
  
    
function resizeImage(image, maxWidth, maxHeight, callback) {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var width = image.width;
          var height = image.height;
    
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
    
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);
          
          var resizedImage = new Image();
          resizedImage.src = canvas.toDataURL('image/png');
          callback(resizedImage);
}

// function handleImage(element) {
//     let end_point_url = "http://localhost:5000/api/predict/animal";
//     var base64String = "";

//     let file = element.files[0];
//     let reader = new FileReader();

//     reader.onload = () => {
//         base64String = reader.result;
//         fetch(end_point_url, {
//             method: "POST",
//             body: JSON.stringify({ img_base64: base64String }),
//             headers: { "Content-type": "application/json; charset=UTF-8" }
//         })
//         .then((response) => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('ไม่สามารถดึงข้อมูลได้');
//             }
//         })
//         .then((json) => {
//             console.log(json); // แสดงผลลัพธ์ที่ API ส่งกลับมา
//         })
//         .catch((error) => console.error("เกิดข้อผิดพลาดในการส่งข้อมูล: " + error));
//     };
//     reader.readAsDataURL(file);
// }
