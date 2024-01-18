document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // Your code to run since DOM is loaded and ready
});

// Create a storage reference from our storage service
const fileInputElement = document.querySelector("input1");
const clearButton = document.querySelector(".clear-button");
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

document.addEventListener("DOMContentLoaded", (event) => {
  const formElement = document.querySelector("#myForm");

  // Check if the formElement exists before adding an event listener
  if (formElement) {
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      const fileInputElement = document.getElementById("input1");
      console.log(fileInputElement.files[0]);
      const fileObject = fileInputElement.files[0];
      const objectURL = URL.createObjectURL(fileObject);
      console.log(objectURL);
      var file = fileObject; // Get the selected file
      // Prevent the default form submission behavior

      let sub = sessionStorage.getItem("sub"); // Get the sub value from session storage
      let formData = new FormData();
      formData.append("sub", sub);
      formData.append("file", fileInputElement.files[0]);


      const fileTypes = fileObject.name.split(".").pop().toLowerCase();
      if(fileTypes !== "docx" && fileTypes !== "doc"){
        alert("Please upload a docx file");
        return false;
      }
      
      if (file) {
        convertToHtml(file).then(function (html) {
          document.querySelector(".preview").innerHTML = html; // Display the HTML
        });
      }
      fetch("/upload", {
        method: "POST",
        body: formData, // Send the sub value to the Flask backend
      })
        .then((response) => {
          // Extract the URL from the headers of the response
          let url = response.headers.get("URL");

          // Save the URL in session storage
          sessionStorage.setItem("url", url);

          return response.json();
        })
        .then((data) => {
          console.log(data);

          // After the '/upload' request is completed, send a request to '/download2'
          return fetch("/download2", {
            method: "GET", // Send the sub value to the Flask backend
          })
            .then((response) => response.blob())
            .then((blob) => {
              // Create a new object URL for the blob
              let url = window.URL.createObjectURL(blob);

              // Create a link and programmatically click it to download the file
              let a = document.createElement("a");
              a.href = url;
              a.download = "document_updated.docx"; // Set the file name here
              a.click();
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      changePreviewOnUpload(
        fileObject.name,
        fileObject.type,
        fileObject.size,
        objectURL
      );
    });
  } else {
    console.error('Form with id "myForm" not found');
  }
});

function convertToHtml(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function (event) {
      var arrayBuffer = event.target.result;

      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (result) {
          resolve(result.value);
        })
        .catch(reject);
    };

    reader.readAsArrayBuffer(file); // Read the file as an array buffer
  });
}

document.addEventListener("DOMContentLoaded", (event) => {
  const clearButton = document.querySelector(".clear_button"); // Select the button

  // Check if the clearButton exists before adding an event listener
  if (clearButton) {
    clearButton.addEventListener("click", (e) => {
      location.reload();
    });
  } else {
    console.error('Button with class "clear_button" not found');
  }
});

function checkFile() {
  let sub = sessionStorage.getItem("sub");
  let formData2 = new FormData();
  formData2.append("sub", sub);
  fetch("/download", {
    method: "POST",
    body: formData2, // Send the sub value to the Flask backend
  })
    .then((response) => response.json()) // Parse the response body as JSON
    .then((data) => {
      console.log(data.files);
      // Save the files data in local storage
      localStorage.setItem("files", JSON.stringify(data.files));

      // Redirect to the /checking route
      window.location.href = "/checking";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
