/* ===== Assistant MJSA (questions fréquentes, sans IA, tout reste dans le navigateur) ===== */
(function () {
  "use strict";

  const CONTACT = { tels: ["+225 01 52 99 91 26", "+225 01 51 00 61 41"], mail: "koffibossypatrick@gmail.com" };
  const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  const SUGGESTIONS = ["Comment s'inscrire ?", "Programme des activités", "Horaires des messes", "Répétitions et formations", "Membres du bureau", "Contacter le responsable"];

  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();

  /* "=mot" : mot exact. Expression avec espace ou apostrophe : contenue dans la phrase. Sinon : début d'un mot. */
  function has(n, tokens, key) {
    if (key[0] === "=") return tokens.includes(key.slice(1));
    if (key.includes(" ") || key.includes("'")) return n.includes(key);
    return tokens.some(t => t.startsWith(key));
  }

  const tel = t => ["Appeler " + t, "tel:" + t.replace(/\s/g, "")];
  const contactLinks = () => CONTACT.tels.map(tel).concat([["Écrire un email", "mailto:" + CONTACT.mail]]);

  function replyActivities(n, tk) {
    const rows = typeof ACTIVITES !== "undefined" ? ACTIVITES : [];
    const topics = ["tournoi", "camp", "recollection", "visite", "semaine", "avent", "careme", "phare", "assemblee", "inter mouvement"];
    const asked = topics.filter(t => has(n, tk, t));
    let list = rows.filter(r => asked.some(t => norm(r.join(" ")).includes(t)));
    if (!list.length) list = rows;
    const lines = list.map(r => "• " + r[0] + " : " + r[1] + (/determiner/.test(norm(r[2])) ? " (lieu à déterminer)" : " (" + r[2] + ")"));
    return { text: "Programme d'activités 2026-2027 :\n" + lines.join("\n") + "\n\nLes dates peuvent changer : consultez régulièrement le site.", links: [["Voir le programme complet", "#programmes", "activities"]] };
  }

  function replyMasses(n, tk) {
    const rows = typeof MESSES !== "undefined" ? MESSES : [];
    const days = DAYS.filter(d => tk.includes(d));
    const hospital = has(n, tk, "hopital"), adoration = has(n, tk, "adoration");
    let list = rows;
    if (days.length) list = list.filter(m => days.includes(norm(m.jour)));
    if (hospital) list = list.filter(m => norm(m.type).includes("hopital"));
    if (adoration) list = list.filter(m => norm(m.type).includes("adoration"));
    const links = [["Voir le planning des messes", "#programmes", "masses"]];
    if (!days.length && !hospital && !adoration) {
      const byDay = {};
      rows.forEach(m => { (byDay[m.jour] = byDay[m.jour] || []).push(m.heure + (m.type !== "Messe" ? " (" + m.type.toLowerCase() + ")" : "")); });
      const lines = Object.keys(byDay).map(j => "• " + j + " : " + byDay[j].join(", "));
      return { text: "Horaires des messes :\n" + lines.join("\n") + "\n\nPour voir les servants, demandez par exemple « messe du dimanche ».", links };
    }
    if (!list.length) return { text: "Je ne trouve pas de messe correspondant à votre demande.", links };
    const lines = list.map(m => "• " + m.jour + " " + m.heure + " (" + m.type.toLowerCase() + ") : " + (m.servants.length ? m.servants.join(", ") : "servants à annoncer"));
    return { text: lines.join("\n"), links };
  }

  const INTENTS = [
    { weak: ["bonjour", "bonsoir", "salut", "coucou", "hello", "salam"], reply: () => ({ text: "Bonjour ! 🙏 Je suis l'assistant automatique du MJSA. Posez-moi une question ou choisissez un sujet ci-dessous." }) },
    { weak: ["merci", "thanks"], reply: () => ({ text: "Avec plaisir ! Que Dieu vous bénisse. 🙏" }) },
    { strong: ["inscri", "rejoindre", "adhes", "adhere"], weak: ["comment faire", "devenir", "formulaire", "enregistr"],
      reply: () => ({ text: "Pour inscrire un enfant :\n1. Ouvrez le formulaire « Rejoindre le MJSA » (bouton ci-dessous).\n2. Remplissez le nom, le prénom, l'email, la date de naissance et un téléphone.\n3. Touchez « Envoyer ma demande ».\n\nDans la case Téléphone, mettez le numéro d'un parent. Un responsable vous contactera.", links: [["Ouvrir le formulaire", "#inscription"]] }) },
    { strong: ["repetition", "repet"], weak: ["horaire", "formation", "heure", "mercredi"],
      reply: () => ({ text: "Répétitions : les mercredis de 15h à 17h.\nFormations : les dimanches de 15h à 17h.\n\nPour les horaires des messes, demandez « horaires des messes »." }) },
    { strong: ["paiement", "payer", "paye", "cotisation", "tarif", "prix", "cout", "combien", "wave", "frais", "argent", "gratuit"],
      reply: () => ({ text: "Pour le moment, le site ne permet pas de payer en ligne, et je n'ai pas de montants à vous donner. Pour connaître les frais d'une activité, contactez le responsable.", links: contactLinks() }) },
    { strong: ["programme", "activite", "calendrier", "agenda", "tournoi", "camp", "recollection", "visite", "semaine du serviteur", "serviteur", "prochaine", "evenement"], weak: ["=date", "quand", "2026", "2027"], reply: replyActivities },
    { strong: ["messe", "adoration", "hopital", "planning", "qui sert"], weak: ["servant", "horaire", "heure", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"], reply: replyMasses },
    { strong: ["contact", "telephone", "numero", "appeler", "joindre", "whatsapp", "email", "mail", "responsable", "parler"], weak: ["=tel"],
      reply: () => ({ text: "Vous pouvez joindre le MJSA :\n📞 " + CONTACT.tels.join("\n📞 ") + "\n📧 " + CONTACT.mail + "\n\nResponsable du MJSA : R. BROU Axel-Mary Oswald.", links: contactLinks() }) },
    { strong: ["adresse", "lieu", "situe", "localis", "ou se trouve", "ou est", "emplacement"], weak: ["eglise", "paroisse"],
      reply: () => ({ text: "Le MJSA est rattaché à la Paroisse Sainte Anne de Port-Bouët, à Abidjan (Côte d'Ivoire). Le lieu de chaque activité est indiqué dans le programme.", links: [["Voir le programme", "#programmes", "activities"]] }) },
    { strong: ["=age", "=ans", "condition", "qui peut", "tenue", "uniforme", "soutane", "aube", "materiel", "apporter"],
      reply: () => ({ text: "Je n'ai pas d'information précise à ce sujet. Le formulaire d'inscription demande la date de naissance de l'enfant, et un responsable vous répondra. Vous pouvez aussi le contacter directement.", links: contactLinks() }) },
    { strong: ["fondateur", "akichi", "picault", "jean luc", "tarcisius", "tarcisus", "patron", "=saint"],
      reply: () => ({ text: "Notre saint patron est saint Tarcisius. Le MJSA garde la mémoire de feu Mgr Joseph Aka Akichi et de feu le Père franciscain Jean-Luc Picault, fondateur du MJSA.", links: [["Voir la section", "#fondateurs"]] }) },
    { strong: ["photo", "galerie", "image", "bibliotheque", "album"],
      reply: () => ({ text: "Retrouvez les photos des activités dans la bibliothèque média.", links: [["Voir les photos", "#bibliotheque"]] }) },
    { strong: ["c'est quoi", "qu'est", "histoire", "fonde", "fondation", "1988", "mission", "presentation", "qui sommes", "qui etes", "decrire"], weak: ["mjsa", "mouvement"],
      reply: () => ({ text: "Le MJSA (Mouvement des Jeunes au Service de l'Autel) de la paroisse Sainte Anne de Port-Bouët rassemble des jeunes qui veulent servir Dieu et l'Église par le service liturgique. Fondé en 1988, il offre une formation spirituelle, liturgique et humaine aux servants d'autel.", links: [["En savoir plus", "#apropos"]] }) }
  ];

  /* Petites conversations (placées après les autres sujets pour ne jamais les gêner) */
  INTENTS.push(
    { strong: ["bureau", "membre", "equipe", "organigramme", "comite", "dirigeant"], reply: replyBureau },
    { strong: ["ca va", "comment vas", "comment allez", "comment tu vas", "comment il va", "tu vas bien", "vous allez bien", "la forme"],
      reply: () => ({ text: "Je vais très bien, merci ! 🙏 Et vous ? Comment puis-je vous aider ?" }) },
    { strong: ["qui es tu", "tu es qui", "t'es qui", "es tu un robot", "es tu une ia", "es tu humain", "tu es un robot", "ton nom", "tu t'appelles", "robot"],
      reply: () => ({ text: "Je suis l'assistant automatique du MJSA : un petit programme, pas une personne. Je réponds aux questions sur les inscriptions, le programme, les messes et les contacts." }) },
    { strong: ["aide", "help", "que peux tu", "que sais tu", "tu peux faire", "quoi demander"],
      reply: () => ({ text: "Je peux vous renseigner sur :\n• l'inscription d'un enfant\n• le programme des activités\n• les horaires des messes et les servants\n• les répétitions et les formations\n• les contacts du MJSA\n\nChoisissez un sujet ci-dessous ou écrivez votre question." }) },
    { weak: ["au revoir", "bye", "a bientot", "bonne journee", "bonne soiree", "a plus"],
      reply: () => ({ text: "Au revoir, et que Dieu vous bénisse ! 🙏" }) }
  );

  /* ===== Bureau : lit la liste MEMBRES de bureau.js (toujours à jour) ===== */
  const membres = () => (typeof MEMBRES !== "undefined" ? MEMBRES : []).filter(m => (m.prenoms || "").trim() || (m.nom || "").trim());
  const nomM = m => ((m.prenoms || "") + " " + (m.nom || "")).trim();
  const STOP = ["des", "les", "une", "qui", "que", "est", "pas", "pour", "par", "sur", "son", "ses", "mes", "tes", "nos", "vos", "car", "aux", "ton", "mon", "dans", "avec", "fait"];
  const stem = t => t.slice(0, 6);

  function chercherMembres(n, tk) {
    const list = membres();
    const mots = tk.filter(t => t.length >= 3 && !STOP.includes(t));
    let best = 0, parNom = [];
    list.forEach(m => {
      const c = norm(nomM(m)).split(" ").filter(t => t.length >= 3 && mots.includes(t)).length;
      if (c > best) { best = c; parNom = [m]; } else if (c === best && c > 0) parNom.push(m);
    });
    let parFonction = [];
    const cue = ["qui", "fonction", "role", "poste", "charge", "occupe"].some(k => tk.includes(k));
    if (cue && !parNom.length) {
      const racines = mots.filter(t => t.length >= 4).map(stem);
      parFonction = list.filter(m => norm(m.fonction || "").split(" ").filter(t => t.length >= 4).some(t => racines.includes(stem(t))));
    }
    return { parNom, parFonction };
  }

  function replyMembres(list, n, tk) {
    const lignes = list.map(m => "• " + nomM(m) + (m.fonction ? " : " + m.fonction : ""));
    let text = (list.length > 1 ? "Voici ce que j'ai trouvé :\n" : "") + lignes.join("\n");
    const links = [["Voir le bureau", "#bureau"]];
    if (["numero", "telephone", "contact", "joindre", "appeler", "whatsapp", "email", "mail"].some(k => has(n, tk, k))) {
      text += "\n\nJe n'ai pas les coordonnées personnelles des membres. Pour les joindre, contactez le MJSA :";
      links.push(...contactLinks());
    }
    return { text, links };
  }

  function replyBureau() {
    const list = membres();
    if (!list.length) return { text: "La liste des membres du bureau n'est pas disponible pour le moment.", links: contactLinks() };
    return { text: "Membres du bureau du MJSA :\n" + list.map(m => "• " + nomM(m) + (m.fonction ? " : " + m.fonction : "")).join("\n"), links: [["Voir le bureau", "#bureau"]] };
  }

  function answer(text) {
    const n = norm(text), tk = n.split(/[' ]+/);
    let best = null, bestScore = 0;
    INTENTS.forEach(it => {
      const s = 3 * (it.strong || []).filter(k => has(n, tk, k)).length + (it.weak || []).filter(k => has(n, tk, k)).length;
      if (s > bestScore) { best = it; bestScore = s; }
    });
    const r = chercherMembres(n, tk);
    if (r.parNom.length && 9 > bestScore) return replyMembres(r.parNom, n, tk);
    if (r.parFonction.length && 5 > bestScore) return replyMembres(r.parFonction, n, tk);
    if (best) return best.reply(n, tk);
    return { text: "Je n'ai pas bien compris, ou je n'ai pas cette information. Essayez avec d'autres mots, ou contactez directement le responsable :", links: contactLinks() };
  }

  /* ===== Interface ===== */
  const css = `
#mjsa-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:900;width:58px;height:58px;border-radius:50%;border:0;background:var(--red,#8f1d2c);color:#fff;font-size:1.6rem;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.3)}
#mjsa-fab:hover{background:var(--wine,#3a0c14)}
#mjsa-chat{position:fixed;right:16px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:901;width:360px;max-width:calc(100vw - 24px);height:min(70vh,560px);height:min(70svh,560px);background:#fff;border:1px solid var(--line,#e8dcd8);border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;font-size:.95rem}
#mjsa-chat.open{display:flex}
#mjsa-chat header{position:static;background:var(--wine,#3a0c14);color:#fff;padding:.8rem 1rem;display:flex;justify-content:space-between;align-items:center;box-shadow:none;border:0}
#mjsa-chat header strong{display:block;font-family:Georgia,serif;color:var(--gold,#c9a24a)}
#mjsa-chat header span{font-size:.78rem;opacity:.85}
#mjsa-close{background:none;border:0;color:#fff;font-size:1.6rem;cursor:pointer;line-height:1;padding:.2rem .5rem}
#mjsa-msgs{flex:1;overflow-y:auto;padding:1rem;background:var(--paper,#fcfaf9);display:flex;flex-direction:column;gap:.6rem}
.mjsa-b{max-width:88%;padding:.6rem .8rem;border-radius:10px;white-space:pre-line;overflow-wrap:anywhere;line-height:1.45}
.mjsa-b.bot{background:#fff;border:1px solid var(--line,#e8dcd8);align-self:flex-start}
.mjsa-b.me{background:var(--red,#8f1d2c);color:#fff;align-self:flex-end}
.mjsa-links{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem}
.mjsa-links a{display:inline-block;background:var(--tint,#f6efec);color:var(--red,#8f1d2c);border:1px solid var(--line,#e8dcd8);border-radius:999px;padding:.3rem .7rem;font-weight:600;font-size:.85rem}
.mjsa-chips{display:flex;flex-wrap:wrap;gap:.4rem}
.mjsa-chips button{background:#fff;color:var(--red,#8f1d2c);border:1px solid var(--red,#8f1d2c);border-radius:999px;padding:.35rem .75rem;font:inherit;font-size:.85rem;cursor:pointer}
.mjsa-chips button:hover{background:var(--tint,#f6efec)}
#mjsa-form{display:flex;gap:.5rem;padding:.7rem;border-top:1px solid var(--line,#e8dcd8);background:#fff}
#mjsa-input{flex:1;min-width:0;padding:.6rem .7rem;border:1px solid #cdbcb8;border-radius:6px;font:inherit;font-size:16px}
#mjsa-form button{background:var(--red,#8f1d2c);color:#fff;border:0;border-radius:6px;padding:0 1rem;font:inherit;font-weight:600;cursor:pointer}
#mjsa-hint{font-size:.72rem;color:var(--muted,#6b5a5d);text-align:center;padding:0 .7rem .5rem;background:#fff}
@media(max-width:480px){#mjsa-chat{left:12px;right:12px;width:auto;max-width:none}}`;

  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function init() {
    const style = h("style"); style.textContent = css; document.head.append(style);

    const fab = h("button", "", "💬"); fab.id = "mjsa-fab"; fab.type = "button";
    fab.setAttribute("aria-label", "Ouvrir l'assistant du MJSA"); fab.setAttribute("aria-expanded", "false");

    const chat = h("div"); chat.id = "mjsa-chat"; chat.setAttribute("role", "dialog"); chat.setAttribute("aria-label", "Assistant du MJSA");
    const head = h("header");
    const title = h("div"); title.append(h("strong", "", "Assistant MJSA"), h("span", "", "Assistant automatique, pas une personne"));
    const close = h("button", "", "×"); close.id = "mjsa-close"; close.type = "button"; close.setAttribute("aria-label", "Fermer");
    head.append(title, close);

    const msgs = h("div"); msgs.id = "mjsa-msgs"; msgs.setAttribute("role", "log"); msgs.setAttribute("aria-live", "polite");
    const form = h("form"); form.id = "mjsa-form";
    const input = h("input"); input.id = "mjsa-input"; input.type = "text"; input.maxLength = 200; input.autocomplete = "off";
    input.placeholder = "Posez votre question…"; input.setAttribute("aria-label", "Votre question");
    const send = h("button", "", "Envoyer"); send.type = "submit";
    form.append(input, send);
    const hint = h("div", "", "N'écrivez pas de données personnelles ici."); hint.id = "mjsa-hint";
    chat.append(head, msgs, form, hint);
    document.body.append(fab, chat);

    let chips = null;
    const toBottom = () => { msgs.scrollTop = msgs.scrollHeight; };

    function showChips() {
      if (chips) chips.remove();
      chips = h("div", "mjsa-chips");
      SUGGESTIONS.forEach(s => { const b = h("button", "", s); b.type = "button"; b.addEventListener("click", () => ask(s)); chips.append(b); });
      msgs.append(chips); toBottom();
    }

    function bot(res) {
      const b = h("div", "mjsa-b bot", res.text);
      if (res.links && res.links.length) {
        const box = h("div", "mjsa-links");
        res.links.forEach(([label, href, tab]) => {
          const a = h("a", "", label); a.href = href;
          if (href[0] === "#") a.addEventListener("click", () => {
            if (tab) { const t = document.querySelector('.program-tab[data-tab="' + tab + '"]'); if (t) t.click(); }
            setTimeout(toggle, 50, false);
          });
          box.append(a);
        });
        b.append(box);
      }
      msgs.append(b); showChips();
    }

    function ask(text) {
      text = text.trim(); if (!text) return;
      if (chips) chips.remove();
      msgs.append(h("div", "mjsa-b me", text)); toBottom();
      setTimeout(() => bot(answer(text)), 300);
    }

    function toggle(force) {
      const open = typeof force === "boolean" ? force : !chat.classList.contains("open");
      chat.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", String(open));
      fab.textContent = open ? "×" : "💬";
      if (open) { if (!msgs.children.length) bot({ text: "Bonjour ! 🙏 Je suis l'assistant automatique du MJSA. Je réponds aux questions sur les inscriptions, le programme, les messes et les contacts.\n\nChoisissez un sujet ou écrivez votre question." }); input.focus(); }
    }

    fab.addEventListener("click", () => toggle());
    close.addEventListener("click", () => toggle(false));
    form.addEventListener("submit", e => { e.preventDefault(); const v = input.value; input.value = ""; ask(v); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && chat.classList.contains("open")) toggle(false); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
