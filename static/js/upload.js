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

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyALDPT2S_RWrvdyUYtrEwDNYSmcGS58QZw",
  authDomain: "uploadjs-7f8e6.firebaseapp.com",
  projectId: "uploadjs-7f8e6",
  storageBucket: "uploadjs-7f8e6.appspot.com",
  messagingSenderId: "649973015933",
  appId: "1:649973015933:web:783739943a9ce69f1ad814",
  measurementId: "G-L9S68T325S"
  // Your config here
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();

function uploadFile() {
  // Get the file from the input element
  var file = document.getElementById('input1').files[0];

  // Create a reference to the file
  var fileRef = storageRef.child(file.name);

  // Upload the file
  var uploadTask = fileRef.put(file);

  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    // Handle unsuccessful uploads
    console.log('Upload failed:', error);
  }, function() {
    // Handle successful uploads on complete
    console.log('Upload completed successfully.');
  });
}