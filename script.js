// Laisse vide si le script a été créé depuis le tableur (Extensions > Apps Script).
// Sinon, colle l'identifiant du tableur entre les guillemets.
const SHEET_ID = "";

// Ordre des colonnes dans le tableur (doit correspondre aux "name" du formulaire)
const COLONNES = ["date", "nom", "prenom", "email", "telephone", "date_naissance", "motivation"];

function getSheet() {
  const ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()[0];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();

    // Crée les titres si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLONNES);
      sheet.setFrozenRows(1);
    }

    const p = (e && e.parameter) ? e.parameter : {};
    const ligne = COLONNES.map(c => c === "date" ? new Date() : (p[c] || ""));
    sheet.appendRow(ligne);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Permet de tester le lien en l'ouvrant dans le navigateur
function doGet() {
  return ContentService.createTextOutput("Le script MJSA fonctionne.");
}
