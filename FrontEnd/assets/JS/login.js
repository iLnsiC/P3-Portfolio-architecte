const form = document.querySelector("form");
const errorDom = document.querySelector("#error");

async function onSubmit(event) {
  event.preventDefault();
  let user = {
    email: form.email.value,
    password: form.password.value,
  };
  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  let result = await response.json();

  if (response.status === 200) {
    localStorage.setItem("token", result.token);
    // je choisi la methode replace() pour ne pas avoir la fenetre Login dans l'historique et eviter que le bouton precedent nous ramene a cette fenetre
    window.location.replace("http://127.0.0.1:5500/FrontEnd/index.html");
  } else if (response.status === 404 || response.status === 401) {
    errorDom.textContent =
      "Votre nom d'utilisateur ou votre mot de passe est incorrecte";
    form.email.value = "";
    form.password.value = "";
  }
}
form.addEventListener("submit", onSubmit);
