/* ===== Données : modifie ici, pas dans le HTML ===== */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUZwEf5BEaC2emhDUxN7qwpuVw_0xsOctLSOLXYgZ8k-YiVZp9w8zmU_9wKZSitOcj/exec";

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

const MISSION = "Terrain de l'école de la mission";
const CHAPELLE = "Chapelle de l'hôpital";
const PAROISSE = "Paroisse Sainte Anne de Port-Bouët";
const ACTIVITES = [
  ["02 novembre 2025", "Prière collective d'ouverture", PAROISSE],
  ["29 novembre 2025", "24h de prière", CHAPELLE],
  ["27 décembre 2025", "MJSA Championship", MISSION],
  ["03 janvier 2026", "Journée récréative", PAROISSE],
  ["24 janvier 2026", "MJSA Championship", MISSION],
  ["31 janvier 2026", "24h de prière", CHAPELLE],
  ["19 février 2026", "Visite guidée", "À déterminer"],
  ["28 février 2026", "MJSA Championship", MISSION],
  ["01 mars 2026", "Visite fraternelle", "Paroisse Cœur Immaculé de Marie, Impérial de Bassam"],
  ["28 mars 2026", "24h de prière", CHAPELLE], /* ancien texte : « 28 Mai 2025 », à vérifier */
  ["04 avril 2026", "MJSA Championship", MISSION],
  ["05 avril 2026", "Répétition générale Semaine Sainte", "Église Sainte Anne"],
  ["10 avril 2026", "Journée fraternelle avec les CVAV", PAROISSE],
  ["18-20 avril 2026", "MJSA Championship", MISSION],
  ["Mai 2026", "Promesse diocésaine", "À déterminer"],
  ["23 mai 2026", "MJSA Championship", MISSION],
  ["30 mai 2026", "24h de prière", CHAPELLE],
  ["07 juin 2026", "Cérémonie de prise d'aubes et de prise de croix", "Paroisse Sainte Anne"],
  ["Juillet 2026", "Camp de formation, secteur Bonoua ou Aboisso", "À déterminer"]
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
      const res = await fetch(SCRIPT_URL, { method: "POST", body: new FormData(form) });
      if (!res.ok) throw new Error(res.statusText);
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
