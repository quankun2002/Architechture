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

  changePreviewOnUpload(
    fileObject.name,
    fileObject.type,
    fileObject.size,
    objectURL);
  document.getElementById('uploadForm').submit();
});
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
});