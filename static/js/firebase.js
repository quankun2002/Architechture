// Import the Firebase SDK
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALDPT2S_RWrvdyUYtrEwDNYSmcGS58QZw",
  authDomain: "uploadjs-7f8e6.firebaseapp.com",
  projectId: "uploadjs-7f8e6",
  storageBucket: "uploadjs-7f8e6.appspot.com",
  messagingSenderId: "649973015933",
  appId: "1:649973015933:web:783739943a9ce69f1ad814",
  measurementId: "G-L9S68T325S"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
// Get a reference to the Firestore service
const db = getFirestore(firebase);
const storage = firebase.storage();

// Try to read data
db.collection('test').doc('testDoc').get().then((doc) => {
  if (doc.exists) {
    console.log('Connected to Firebase successfully!');
  } else {
    console.log('No such document!');
  }
}).catch((error) => {
  console.error('Error connecting to Firebase:', error);
});

// Function to upload a file
function uploadFile() {
  const fileInput = document.getElementById('input1');
  const file = fileInput.files[0];
  fileRef.put(file).then((snapshot) => {
    console.log('File uploaded successfully!');
  }).catch((error) => {
    console.error('Error uploading file:', error);
  });
  
}

// Function to download a file
function downloadFile() {
  const storageRef = storage.ref();
  const fileRef = storageRef.child('example.txt');
  fileRef.getDownloadURL().then((url) => {
    // This can be downloaded directly:
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
      var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();
    console.log('File downloaded successfully!');
  }).catch((error) => {
    console.error('Error downloading file:', error);
  });
}

// Your other code...
