/* ===== Données : modifie ici, pas dans le HTML ===== */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHkonufJDQtZ5OOmAd5peaR9y6DQvYHLJ0J88HCT3iMdx9jQw7v_Xyrd4ALL72P7lPWA/exec";

const PHOTOS = [
  ["soutanelle.jpeg", "Photo avec le gbonhi des magnifiques enfants de chœur", "13 juillet 2025"],
  ["theo.jpeg", "Le petit diocésain", "13 juillet 2025"],
  ["les promettants.jpeg", "Les nouveaux promettants", "13 juillet 2025"],
  ["catholique.jpeg", "Quelques autres servants", "18 avril 2025"],
  ["dago.jpeg", "Servant, missionnaire", "13 mai 2025"],
  ["famille.jpeg", "Une famille où il fait bon vivre", "13 mai 2024"],
  ["yoyo.jpeg", "Le premier responsable", "13 avril 2025"],
  ["tarcisus.jpeg", "Notre saint patron", "13 avril 2025"],
  ["respo.jpeg", "Quelques responsables", "15 mai 2025"]
];

const ECOLE = "École Sainte Anne de Port-Bouët";
const PAROISSE = "Paroisse Sainte Anne";
const ACTIVITES = [
  ["Dimanche 13 décembre 2026", "Début du tournoi des servants (J1)", ECOLE],
  ["Dimanche 13 décembre 2026", "Récollection du temps de l'Avent", ECOLE],
  ["À déterminer (février 2027)", "Visite guidée au phare de Port-Bouët", "Port-Bouët, phare"],
  ["Dimanche 7 mars 2027", "Visite fraternelle", "Paroisse Cœur Immaculé de Marie d'Impérial ou Nda Koumassi"],
  ["Dimanche 14 mars 2027", "Tournoi des servants (J2)", ECOLE],
  ["Dimanche 14 mars 2027", "Récollection du temps de carême", ECOLE],
  ["À déterminer (mars 2027)", "Mini camp de formation avec la paroisse Saint Jean-Marie Vianney, Vridi Cité", "À déterminer"],
  ["À déterminer", "Journée inter mouvement (avec le mouvement de la Sainte Enfance Missionnaire)", PAROISSE],
  ["À déterminer", "Visite guidée à l'Assemblée nationale et chez les Pompiers", "Abidjan-Plateau"],
  ["Du dimanche 4 au dimanche 11 juillet 2027", "Semaine du serviteur", PAROISSE],
  ["À déterminer (juillet 2027)", "Camp de formation paroissial", "À déterminer"]
];

const MESSES = [
  ["Lundi - Messe à 6h20", ["N'ZEBO Mael", "ADADE Marc"]],
  ["Mardi - Messe à 6h20", ["YAO Eza", "ABLE Hans", "NIAKPA Rayan"]],
  ["Mercredi - Messe à 6h20", ["KOUAKOU Roger", "ADOUKO Archange", "KOFFI Kylian"]],
  ["Jeudi - Messe à 6h20", ["N'ZEBO Mael", "SAOURA Essaie", "LAHIBI ZORO"]],
  ["Vendredi - Messe à 6h20", ["ADADE Marc", "MAMBO Archange", "KOFFI Kylian"]],
  ["Samedi - Messe à 6h20", ["KOUAKOU Guy Roger", "DJAMALA David", "NIAKPA Rayan"]],
  ["Samedi - Messe à 18h30", ["BINI Charnel", "AKA Christ", "YAYO Josseph"]],
  ["Dimanche - Messe à 6h30", ["ABLE Hans", "NOGBOU Amichia", "KEITA Oracle", "ADOUKO Archange", "BISSIE Bryan", "R. DAGO Ange"]],
  ["Dimanche - Messe à 8h30", ["N'GUESSAN Ange", "ADADE Marc", "MAMBO Amichia", "AGBOHIBOR Dylan", "KPAGNIBO Marc", "R. NOGBOU Jean"]],
  ["Dimanche - Messe à 10h00", ["N'GUESSAN Prince", "LAHIBI ZORO", "TANOE Amichia", "KOFFI Kylian", "DIBLI Christ", "DJAMALA David"]],
  ["Dimanche - Messe à l'hôpital, 9h00", ["N'ZEBO Mael", "NIAKPA Rayan", "KOUABRAN Guy"]],
  ["Dimanche - Messe à l'hôpital, 11h00", ["YAYO Emmanuel", "N'GUETTIA Enoch", "DONDJI Mael"]],
  ["Jeudi - Adoration à 18h30", ["BINI Charnel", "ADOUKO Archange"]]
];

/* ===== Utilitaires ===== */
const $ = (s, r = document) => r.querySelector(s);
function el(tag, props = {}, children = []) {
  const n = document.createElement(tag);
  Object.assign(n, props);
  children.forEach(c => n.append(c));
  return n;
}

/* ===== Rendu des données (textContent : pas de risque d'injection) ===== */
function renderGallery() {
  const box = $("#gallery");
  PHOTOS.forEach(([file, title, date]) => {
    const src = encodeURI(file);
    const btn = el("button", { className: "media-item", type: "button" }, [
      el("div", { className: "media-thumbnail" }, [el("img", { src, alt: title, loading: "lazy" })]),
      el("div", { className: "media-info" }, [el("h3", { textContent: title }), el("div", { className: "media-meta", textContent: date })])
    ]);
    btn.addEventListener("click", () => openLightbox(src, title));
    box.append(btn);
  });
}

function renderActivities() {
  const body = $("#activities-body");
  ACTIVITES.forEach(row => body.append(el("tr", {}, row.map(t => el("td", { textContent: t })))));
}

function renderMasses() {
  const list = $("#masses-list");
  MESSES.forEach(([titre, servants]) => {
    list.append(el("div", { className: "mass-day" }, [
      el("h3", { textContent: titre }),
      el("div", { className: "servant-grid" }, servants.map(s => el("div", { className: "servant-item", textContent: s })))
    ]));
  });
}

/* ===== Lightbox ===== */
function openLightbox(src, title) {
  $("#lightbox-img").src = src;
  $("#lightbox-img").alt = title;
  $("#lightbox-caption").textContent = title;
  $("#lightbox").classList.add("open");
  $("#lightbox-close").focus();
}
function closeLightbox() { $("#lightbox").classList.remove("open"); }

/* ===== Slider (initialisé une seule fois) ===== */
function initSlider() {
  const slider = $(".slider"), box = $(".slider-container");
  const slides = document.querySelectorAll(".slide"), dotsBox = $(".slider-dots");
  let current = 0, timer;
  const dots = [...slides].map((_, i) => {
    const d = el("button", { className: "dot", type: "button", ariaLabel: "Diapositive " + (i + 1) });
    d.addEventListener("click", () => show(i));
    dotsBox.append(d);
    return d;
  });
  function show(i) {
    current = (i + slides.length) % slides.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle("active", k === current));
  }
  const start = () => { stop(); timer = setInterval(() => show(current + 1), 5000); };
  const stop = () => clearInterval(timer);
  $(".next-btn").addEventListener("click", () => show(current + 1));
  $(".prev-btn").addEventListener("click", () => show(current - 1));
  box.addEventListener("mouseenter", stop);
  box.addEventListener("mouseleave", start);
  show(0);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) start();
}

/* ===== Menu mobile ===== */
function initMenu() {
  const btn = $(".menu-toggle"), nav = $("#main-nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", e => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });
}

/* ===== Onglets ===== */
function initTabs() {
  const tabs = document.querySelectorAll(".program-tab");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", t === tab); });
    document.querySelectorAll(".program-content").forEach(c => c.classList.remove("active"));
    $("#" + tab.dataset.tab + "-content").classList.add("active");
  }));
}

/* ===== Inscription -> Google Sheets ===== */
function initForm() {
  const form = $("#registration-form"), status = $("#form-status"), btn = $(".submit-btn", form);
  const show = (cls, msg) => { status.className = "form-status " + cls; status.textContent = msg; };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (form.website.value) return; /* anti-spam : champ caché rempli par un robot */
    if (!form.checkValidity()) { form.reportValidity(); return; }

    btn.disabled = true;
    btn.textContent = "Envoi en cours…";
    status.className = "form-status";
    try {
      /* no-cors : Google Apps Script ne renvoie pas d'en-têtes CORS, la réponse est "opaque".
         Si fetch ne plante pas, la requête est bien partie. */
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(new FormData(form))
      });
      show("ok", "Merci ! Votre demande est enregistrée. Un responsable vous contactera.");
      form.reset();
    } catch (err) {
      show("err", "L'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous par téléphone.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Envoyer ma demande";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderGallery(); renderActivities(); renderMasses();
  initSlider(); initMenu(); initTabs(); initForm();
  $("#lightbox-close").addEventListener("click", closeLightbox);
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
});
