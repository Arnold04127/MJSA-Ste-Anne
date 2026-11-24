/* ===== Section « Le bureau » : modifie seulement cette liste ===== */
/* Une ligne par membre. Remplis prenoms, nom, fonction, et photo (nom du fichier envoyé sur GitHub, "" s'il n'y en a pas encore).
   Exemple : { prenoms: "Marie", nom: "KOUASSI", fonction: "Secrétaire", photo: "marie-kouassi.jpeg" },
   Les lignes laissées vides sont des cases à compléter. */
const MEMBRES = [
{ prenoms: "Axel-Mary Oswald", nom: "BROU", fonction: "1er Responsable", photo: "brou-axel.jpg.jpeg" },
  { prenoms: "Bossy Theophanie", nom: "KOFFI", fonction: "Vice Responsable", photo: "koffi-theophanie" },
  { prenoms: "Yao Chabel", nom: "KUNY", fonction: "2e Vice Responsable & Communication", photo: "kuny-chabel" },
  { prenoms: "Adjiman", nom: "KOUAKOU", fonction: "Secrétaire", photo: "kouakou-adjiman" },
  { prenoms: "Yekony Edgar", nom: "BLA", fonction: "Formation & Spiritualité", photo: "bla-edgar" },
  { prenoms: "Bruno", nom: "ZABSORNE", fonction: "Formation", photo: "zabsorne-bruno" },
  { prenoms: "Ange", nom: "DAGO", fonction: "Liturgie & Programmation", photo: "dago-ange" },
  { prenoms: "Jean Yves", nom: "MALAMBIAN", fonction: "Liturgie & Programmation", photo: "malambian-jeanyves" },
  { prenoms: "Kouadio Yvan", nom: "KRA", fonction: "Organisation & Chapelle", photo: "kra-yvan" },
  { prenoms: "Jean Levy Arnold", nom: "NOGBOU", fonction: "Organisation & Communication", photo: "nogbou-arnold" },
  { prenoms: "Tresor", nom: "OBLE", fonction: "Organisation", photo: "oble-tresor" },
  { prenoms: "Crist", nom: "AKA", fonction: "Sacristain", photo: "aka-crist" },
  { prenoms: "N'cho Georges Loic", nom: "AKO", fonction: "Trésorier adjoint", photo: "ako-loic" },

];

/* true  : les cases vides s'affichent (pratique pour préparer la page).
   false : les cases vides sont cachées (à utiliser quand le site est annoncé aux parents). */
const MONTRER_CASES_VIDES = true;

(function () {
  "use strict";

  const css = `
#bureau .bureau-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.membre{background:#fff;border:1px solid var(--line,#e8dcd8);border-top:4px solid var(--gold,#c9a24a);border-radius:0;overflow:hidden;text-align:center}
.membre-photo{aspect-ratio:4/5;background:var(--tint,#f6efec);overflow:hidden}
.membre-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.membre-initiales{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--wine,#3a0c14);color:var(--gold,#c9a24a);font-family:Georgia,serif;font-size:clamp(2rem,9vw,3rem)}
.membre-vide .membre-initiales{background:var(--tint,#f6efec);color:#b9a8a4}
.membre-vide h3,.membre-vide span{color:var(--muted,#6b5a5d)!important;font-weight:400}
.membre-info{padding:.8rem .6rem 1rem}
.membre-info h3{font-size:1rem;line-height:1.25;margin-bottom:.3rem;overflow-wrap:anywhere}
.membre-info span{display:block;color:var(--red,#8f1d2c);font-weight:600;font-size:.85rem;line-height:1.3}
@media(min-width:600px){#bureau .bureau-grid{grid-template-columns:repeat(3,1fr);gap:1.2rem}}
@media(min-width:900px){#bureau .bureau-grid{grid-template-columns:repeat(4,1fr);gap:1.4rem}.membre-info h3{font-size:1.1rem}.membre-info span{font-size:.92rem}}`;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  const estVide = m => !(m.prenoms || "").trim() && !(m.nom || "").trim();

  function carte(m) {
    const vide = estVide(m);
    const nomComplet = vide ? "À compléter" : ((m.prenoms || "") + " " + (m.nom || "")).trim();
    const initiales = vide ? "?" : (((m.prenoms || "").trim()[0] || "") + ((m.nom || "").trim()[0] || "")).toUpperCase();
    const box = el("div", "membre-photo");
    const fallback = () => { box.replaceChildren(el("div", "membre-initiales", initiales)); };
    if (m.photo && !vide) {
      const img = el("img");
      img.src = encodeURI(m.photo); img.alt = nomComplet; img.loading = "lazy";
      img.addEventListener("error", fallback);
      box.append(img);
    } else fallback();
    const info = el("div", "membre-info");
    info.append(el("h3", "", nomComplet), el("span", "", vide ? "Fonction" : (m.fonction || "")));
    const c = el("article", "membre" + (vide ? " membre-vide" : ""));
    c.append(box, info);
    return c;
  }

  function init() {
    const liste = MEMBRES.filter(m => MONTRER_CASES_VIDES || !estVide(m));
    if (!liste.length) return;
    const style = el("style"); style.textContent = css; document.head.append(style);

    const section = el("section", "section"); section.id = "bureau";
    const titre = el("div", "section-title"); titre.append(el("h2", "", "Le bureau du MJSA"));
    const grille = el("div", "bureau-grid");
    liste.forEach(m => grille.append(carte(m)));
    section.append(titre, grille);

    const message = document.getElementById("message");
    if (message) message.before(section); else document.querySelector("main").append(section);

    const ul = document.querySelector("#main-nav ul");
    if (ul && ul.lastElementChild) {
      const li = el("li"); const a = el("a", "", "Le bureau"); a.href = "#bureau"; li.append(a);
      ul.insertBefore(li, ul.lastElementChild);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
