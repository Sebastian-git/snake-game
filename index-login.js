// Javascript code for Snapchat login page
window.snapKitInit = function() {
  var loginButtonIconId = "my-login-button-target";
  snap.loginkit.mountButton(loginButtonIconId, {
    clientId:
      "df72c33e-d692-416b-8428-e5c4ed3ac178",
    redirectURI:
      "https://sebastian-snake-game.glitch.me/",
    scopeList: ["user.display_name", "user.bitmoji.avatar"],
    
    // Function called after login
    handleResponseCallback: function() {
      snap.loginkit.fetchUserInfo().then(function(data) {
        // Store user data in local storage
        var bitmoji_avatar_url = data.data.me.bitmoji.avatar;
        localStorage.setItem("avatarurl", bitmoji_avatar_url);
        // Redirect to game's html page
        location.href = "game.html";
      });
    }
  });
};

// Snap developer kit code from SnapKit documentation
(function(d, s, id) {
  var js,
    sjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://sdk.snapkit.com/js/v1/login.js";
  sjs.parentNode.insertBefore(js, sjs);
})(document, "script", "loginkit-sdk");
