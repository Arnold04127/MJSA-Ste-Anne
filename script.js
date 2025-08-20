document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    const data = {
      nom: document.getElementById("nom").value,
      prenom: document.getElementById("prenom").value,
      "date-naissance": document.getElementById("date-naissance").value,
      age: document.getElementById("age").value,
      adresse: document.getElementById("adresse").value,
      ville: document.getElementById("ville").value,
      paroisse: document.getElementById("paroisse").value,
      "parent-nom": document.getElementById("parent-nom").value,
      "parent-tel": document.getElementById("parent-tel").value,
      email: document.getElementById("email").value,
      motivation: document.getElementById("motivation").value,
    };

    // ⚠️ Ici tu dois remplacer l’URL par celle de ton Web App Google Apps Script
    const scriptURL = "https://script.google.com/macros/s/AKfycbwUZwEf5BEaC2emhDUxN7qwpuVw_0xsOctLSOLXYgZ8k-YiVZp9w8zmU_9wKZSitOcj/exec";

    // Envoi vers Google Sheet
    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        alert("✅ Inscription enregistrée avec succès !");
        form.reset(); // vide le formulaire après envoi
      })
      .catch((error) => {
        alert("❌ Erreur lors de l'envoi : " + error);
      });
  });
});
