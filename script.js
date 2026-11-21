/* ===== Données : modifie ici, pas dans le HTML ===== */
/* Clé gratuite reçue par email sur web3forms.com (elle peut rester visible dans le code) */
const WEB3FORMS_KEY = "a0bd8cc1-d50f-451d-81f1-dcd2cea83fa3";

/* Base de données Supabase (clé publique "anon" ou "publishable", jamais la clé secrète) */
const SUPABASE_URL = "https://ekhlcsfuulupwjrpaxor.supabase.co";
const SUPABASE_KEY = "sb_publishable_6mjgPmu5o0lXdIBH8qCcrQ_VW7F3wHW";

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

/* Planning des messes : une ligne par messe.
   Pour ajouter des servants, écris leurs noms entre guillemets dans servants: [ ].
   Exemple : servants: ["KOFFI Kylian", "ADADE Marc"] */
const MESSES = [
  { jour: "Lundi", heure: "6h20", type: "Messe", servants: [] },
  { jour: "Mardi", heure: "6h20", type: "Messe", servants: [] },
  { jour: "Mercredi", heure: "6h20", type: "Messe", servants: [] },
  { jour: "Jeudi", heure: "6h20", type: "Messe", servants: [] },
  { jour: "Jeudi", heure: "18h30", type: "Adoration", servants: [] },
  { jour: "Vendredi", heure: "6h20", type: "Messe", servants: [] },
  { jour: "Samedi", heure: "6h20", type: "Messe", servants: [] },
  { jour: "Samedi", heure: "18h30", type: "Messe", servants: [] },
  { jour: "Dimanche", heure: "6h30", type: "Messe", servants: [] },
  { jour: "Dimanche", heure: "8h30", type: "Messe", servants: [] },
  { jour: "Dimanche", heure: "9h00", type: "Messe à l'hôpital", servants: [] },
  { jour: "Dimanche", heure: "10h00", type: "Messe", servants: [] },
  { jour: "Dimanche", heure: "11h00", type: "Messe à l'hôpital", servants: [] }
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
  MESSES.forEach(m => {
    const cases = m.servants.length
      ? m.servants.map(n => el("div", { className: "servant-item", textContent: n }))
      : [el("div", { className: "servant-empty", textContent: "Servants à annoncer" })];
    list.append(el("article", { className: "mass-day" }, [
      el("div", { className: "mass-head" }, [
        el("div", {}, [el("h3", { textContent: m.jour }), el("span", { className: "mass-type", textContent: m.type })]),
        el("span", { className: "mass-time", textContent: m.heure })
      ]),
      el("div", { className: "servant-grid" }, cases)
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

/* ===== Remplace le formulaire par un message de remerciement ===== */
function showThanks(form) {
  const header = $(".form-header");
  const again = el("button", { className: "submit-btn", type: "button", textContent: "Inscrire une autre personne" });
  const done = el("div", { className: "form-done", role: "status" }, [
    el("h2", { textContent: "Inscription envoyée !" }),
    el("p", { textContent: "Merci ! Votre demande est bien enregistrée. Un responsable du MJSA vous contactera bientôt." }),
    again
  ]);
  form.hidden = true;
  if (header) header.hidden = true;
  form.parentElement.append(done);
  done.scrollIntoView({ behavior: "smooth", block: "center" });
  again.addEventListener("click", () => {
    done.remove();
    form.hidden = false;
    if (header) header.hidden = false;
    $("#form-status").className = "form-status";
  });
}

/* ===== Inscription -> base Supabase + email Web3Forms ===== */
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
      const f = Object.fromEntries(new FormData(form));

      /* 1. Stockage dans la base de données */
      const saveDb = fetch(SUPABASE_URL + "/rest/v1/inscriptions", {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          nom: f.nom, prenom: f.prenom, email: f.email,
          telephone: f.telephone || null,
          date_naissance: f.date_naissance || null,
          motivation: f.motivation || null
        })
      }).then(r => { if (!r.ok) throw new Error("Supabase " + r.status); });

      /* 2. Email de notification */
      const data = new FormData(form);
      data.delete("website");
      data.append("access_key", WEB3FORMS_KEY);
      data.append("subject", "Nouvelle inscription MJSA : " + f.prenom + " " + f.nom);
      data.append("from_name", "Site MJSA");
      const sendMail = fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
        .then(r => r.json())
        .then(j => { if (!j.success) throw new Error(j.message || "Erreur Web3Forms"); });

      /* Succès si au moins l'un des deux a fonctionné */
      const [db, mail] = await Promise.allSettled([saveDb, sendMail]);
      if (db.status === "rejected") console.error("Base de données :", db.reason);
      if (mail.status === "rejected") console.error("Email :", mail.reason);
      if (db.status === "rejected" && mail.status === "rejected") throw new Error("Aucun envoi n'a fonctionné");

      form.reset();
      showThanks(form);
    } catch (err) {
      console.error("Erreur envoi formulaire :", err);
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
