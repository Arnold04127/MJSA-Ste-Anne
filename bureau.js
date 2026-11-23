/* ===== Section « Le bureau » : modifie seulement la liste MEMBRES ===== */
/* Une ligne par membre. "photo" : nom du fichier envoyé sur GitHub (laisse "" s'il n'y en a pas encore). */
const MEMBRES = [
  { prenoms: "Axel-Mary Oswald", nom: "BROU", fonction: "Responsable du MJSA", photo: "" }
  /* Pour ajouter un membre : mets une virgule à la fin de la ligne précédente, puis écris la ligne suivante :
  { prenoms: "Prénoms", nom: "NOM", fonction: "Secrétaire", photo: "secretaire.jpeg" } */
];

(function () {
  "use strict";

  const css = `
#bureau .bureau-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.membre{background:#fff;border:1px solid var(--line,#e8dcd8);border-top:4px solid var(--gold,#c9a24a);border-radius:0;overflow:hidden;text-align:center}
.membre-photo{aspect-ratio:4/5;background:var(--tint,#f6efec);overflow:hidden}
.membre-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.membre-initiales{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--wine,#3a0c14);color:var(--gold,#c9a24a);font-family:Georgia,serif;font-size:clamp(2rem,9vw,3rem)}
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

  function carte(m) {
    const nomComplet = (m.prenoms + " " + m.nom).trim();
    const initiales = ((m.prenoms || "").trim()[0] || "") + ((m.nom || "").trim()[0] || "");
    const box = el("div", "membre-photo");
    const fallback = () => { box.replaceChildren(el("div", "membre-initiales", initiales.toUpperCase())); };
    if (m.photo) {
      const img = el("img");
      img.src = encodeURI(m.photo); img.alt = nomComplet; img.loading = "lazy";
      img.addEventListener("error", fallback);
      box.append(img);
    } else fallback();
    const info = el("div", "membre-info");
    info.append(el("h3", "", nomComplet), el("span", "", m.fonction || ""));
    const c = el("article", "membre");
    c.append(box, info);
    return c;
  }

  function init() {
    if (!MEMBRES.length) return;
    const style = el("style"); style.textContent = css; document.head.append(style);

    const section = el("section", "section"); section.id = "bureau";
    const titre = el("div", "section-title"); titre.append(el("h2", "", "Le bureau du MJSA"));
    const grille = el("div", "bureau-grid");
    MEMBRES.forEach(m => grille.append(carte(m)));
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
