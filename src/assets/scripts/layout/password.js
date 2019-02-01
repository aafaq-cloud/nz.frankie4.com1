import "../../styles/password.scss";


function initLogin() {
  const loginButton = document.querySelector("#login-button");
  const cancelButton = document.querySelector("#cancel-login-button");
  const containerOpening = document.querySelector("#container-opening");
  const containerLogin = document.querySelector("#container-login");

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    loginButton.classList.toggle("hide");
    cancelButton.classList.toggle("hide");
    containerOpening.classList.toggle("hide");
    containerLogin.classList.toggle("hide");
  });

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();

    loginButton.classList.toggle("hide");
    cancelButton.classList.toggle("hide");
    containerOpening.classList.toggle("hide");
    containerLogin.classList.toggle("hide");
  });
}


initLogin();
