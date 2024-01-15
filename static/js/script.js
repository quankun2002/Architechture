// Author: Kiet Park
// Last Modified: 4/20/21
// Purpose: This file contains the functions that are used in the login.html file.
//          The functions are used to sign in with Google and to check if the user
//          is already logged in.

function signInGoogle() {
  event.preventDefault(); // Prevent the default form submission behavior
  localStorage.removeItem("authInfo");

  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth"; // Create <form> element
  let form = document.createElement("form"); // Set attributes
  form.setAttribute("method", "GET"); // Set attributes
  form.setAttribute("action", oauth2Endpoint); // Set attributes

  let params = {
    // Set form parameters
    client_id:
      "33229960992-elv2jgnpqp12ohiolkiupd9fvpd2knt5.apps.googleusercontent.com", // Replace this value with the Client ID from the API Console
    redirect_uri:
      "http://127.0.0.1:5000/userDetail", // Replace this value with the redirect URI from the API Console
    response_type: "token",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  // Prevent the default form submission behavior
  document.body.appendChild(form);
  form.submit();
}
// This form is for Facebook Authentication//
// This is called with the results from from FB.getLoginStatus().
let params = {};
let regex = /([^&=]+)=([^&]*)/g,
  m;
while ((m = regex.exec(location.href))) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0) {
  localStorage.setItem("authInfo", JSON.stringify(params));
}
// window.history.pushState({}, document.title, "/" + "userDetail.html")
let info = JSON.parse(localStorage.getItem("authInfo"));
console.log(JSON.parse(localStorage.getItem("authInfo")));
console.log(info["access_token"]);
console.log(info["expires_in"]);

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${info["access_token"]}`,
  },
})
  .then((data) => data.json())
  .then((info) => {
    console.log(info);
    document.getElementById("sub").innerHTML += info.sub;
    sessionStorage.setItem("sub", info.sub);
    document.getElementById("name").innerHTML += info.name;
    document.getElementById("image").src = info.picture;
  });

function returnHomepage() {
  window.location.href = homeBtn;
}

// Check if credentials exist
let storedCredentials = localStorage.getItem("authInfo");
if (storedCredentials) {
  let info = JSON.parse(storedCredentials);

  // Now you can use `info` to display user information on the page
  console.log(info["access_token"]);
  console.log(info["expires_in"]);

  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${info["access_token"]}`,
    },
  })
    .then((data) => data.json())
    .then((info) => {
      console.log(info);
      document.getElementById("image").src = info.picture;
    });
} else {
  // Handle the case where no credentials are stored
  console.log("No user credentials found");
}

function logOut() {
  // Check if credentials exist
  let storedCredentials = localStorage.getItem("authInfo");

  if (storedCredentials) {
    let info = JSON.parse(storedCredentials);

    // Google's OAuth 2.0 endpoint for revoking access tokens.
    var revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';

    // Create a FormData object to send the token in the request body
    var formData = new FormData();
    formData.append('token', info["access_token"]);

    // Make a POST request to revoke the token
    fetch(revokeTokenEndpoint, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      // Clear credentials after revoking the token, regardless of the response
      localStorage.removeItem("authInfo");

      // Redirect to the login page
      window.location.href = logout;
    })
    .catch(error => {
      console.error('Error revoking token:', error);
    });
  } else {
    // Handle the case where no credentials are stored
    console.log("No user credentials found");
  }
}
