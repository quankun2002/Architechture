// Select all input elements with class "drop-zone__input"
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  // Find the closest ancestor with class "drop-zone"
  const dropZoneElement = inputElement.closest(".drop-zone");

  // Open file dialog when drop zone is clicked
  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  // Update thumbnail when a file is selected
  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  // Highlight drop zone on drag over
  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  // Remove highlight on drag leave or drag end
  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  // Handle file drop - update thumbnail and remove highlight
  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      // Set input files to dropped files and update thumbnail
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  // Find existing thumbnail element or create a new one
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so let's create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  // Set the label of the thumbnail to the file name
  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    // Read the file as a data URL and set it as background image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    // Remove background image for non-image files
    thumbnailElement.style.backgroundImage = null;
  }
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase (replace with your Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyALDPT2S_RWrvdyUYtrEwDNYSmcGS58QZw",
  authDomain: "uploadjs-7f8e6.firebaseapp.com",
  projectId: "uploadjs-7f8e6",
  storageBucket: "uploadjs-7f8e6.appspot.com",
  messagingSenderId: "649973015933",
  appId: "1:649973015933:web:783739943a9ce69f1ad814",
  measurementId: "G-L9S68T325S"
};

firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Storage
const storage = firebase.storage();
const storageRef = storage.ref();

// Event listener for the "Upload" button
document.getElementById('uploadButton').addEventListener('click', uploadToFirebase);

// Function to handle file upload to Firebase Storage
function uploadToFirebase() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    // Create a reference to the file in Firebase Storage
    const fileRef = storageRef.child(file.name);

    // Upload file to Firebase Storage
    fileRef.put(file).then((snapshot) => {
      console.log('File uploaded successfully!');
    }).catch((error) => {
      console.error('Error uploading file:', error);
    });
  } else {
    console.error('No file selected for upload.');
  }
}

// Function to check Firebase (you can implement your logic here)
function check_firebase() {
  console.log('Checking Firebase...');
  // Your logic for checking Firebase, e.g., fetching data from Firebase Database
}
