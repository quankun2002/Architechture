const fileInputElement = document.querySelector("input1");
const clearButton = document.querySelector(".clear_button");
const imagePreview = document.querySelector(".preview-image");
const previewDescription = document.querySelector(".preview-description");
const previewSize = document.querySelector(".preview-size");
const changePreviewOnUpload = (fileName, fileType, fileSize, previewURL) => {
  if (fileType.includes("image")) {
    imagePreview.setAttribute("src", previewURL);
  } else {
    imagePreview.setAttribute("src", imageUrl2);
  }
  previewDescription.textContent = fileName;
  previewSize.textContent = `${Math.round(fileSize / 1024)} kb`;

  clearButton.style.display = "inline-flex";
};
document.getElementById('input1').addEventListener('change', function() {
  const fileInputElement = document.getElementById('input1');
  console.log(fileInputElement.files[0]);
  const fileObject = fileInputElement.files[0];
  const objectURL = URL.createObjectURL(fileObject);
  console.log(objectURL);
  var file = fileObject; // Get the selected file

  if (file) {
      convertToHtml(file).then(function(html) {
          document.querySelector('.preview').innerHTML = html; // Display the HTML
      });
  }
  changePreviewOnUpload(
    fileObject.name,
    fileObject.type,
    fileObject.size,
    objectURL);
  document.getElementById('uploadForm').submit();
});

function convertToHtml(file) {
  return new Promise(function(resolve, reject) {
      var reader = new FileReader();

      reader.onload = function(event) {
          var arrayBuffer = event.target.result;

          mammoth.convertToHtml({arrayBuffer: arrayBuffer})
              .then(function(result) {
                  resolve(result.value);
              })
              .catch(reject);
      };

      reader.readAsArrayBuffer(file); // Read the file as an array buffer
  });
}
// fileInputElement.addEventListener("change", (e) => {
//   console.log(fileInputElement.files[0]);
//   const fileObject = fileInputElement.files[0];
//   const objectURL = URL.createObjectURL(fileObject);
//   console.log(objectURL);

//   changePreviewOnUpload(
//     fileObject.name,
//     fileObject.type,
//     fileObject.size,
//     objectURL
//   );
// });

clearButton.addEventListener("click", (e) => {
  imagePreview.setAttribute("src", imageUrl);

  previewDescription.textContent = "";
  previewSize.textContent = "";

  clearButton.style.display = "none";
  location.reload();
});