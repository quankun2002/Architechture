const fileInputElement = document.querySelector("input#input1");
const clearButton = document.querySelector(".clear_button");
const imagePreview = document.querySelector(".preview-image");
const previewDescription = document.querySelector(".preview-description");
const previewSize = document.querySelector(".preview-size");

const changePreviewOnUpload = (fileName, fileType, fileSize, previewURL) => {
  if (fileType.includes("image")) {
    imagePreview.setAttribute("src", previewURL);
  } else {
    imagePreview.setAttribute("src", "images/placeholder-file.png");
  }
  previewDescription.textContent = fileName;
  previewSize.textContent = `${Math.round(fileSize / 1024)} kb`;

  clearButton.style.display = "inline-flex";
};

fileInputElement.addEventListener("change", (e) => {
  console.log(fileInputElement.files[0]);
  const fileObject = fileInputElement.files[0];
  const objectURL = URL.createObjectURL(fileObject);
  console.log(objectURL);

  changePreviewOnUpload(
    fileObject.name,
    fileObject.type,
    fileObject.size,
    objectURL
  );
});

clearButton.addEventListener("click", (e) => {
  imagePreview.setAttribute("src", "images/placeholder-image.png");

  previewDescription.textContent = "";
  previewSize.textContent = "";

  clearButton.style.display = "none";
});