document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // ⚠️ Remplace par ton URL Web App
    const scriptURL = "https://script.google.com/macros/s/AKfycbwUZwEf5BEaC2emhDUxN7qwpuVw_0xsOctLSOLXYgZ8k-YiVZp9w8zmU_9wKZSitOcj/exec";

    // Envoi vers Google Sheet via FormData
    fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          alert("✅ Inscription enregistrée avec succès !");
          form.reset(); // vider le formulaire après envoi
        } else {
          alert("❌ Erreur : " + response.statusText);
        }
      })
      .catch((error) => {
        alert("❌ Erreur lors de l'envoi : " + error);
      });
  });
});
