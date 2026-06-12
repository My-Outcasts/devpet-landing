/**
 * Codepet waitlist endpoint — Google Apps Script web app.
 *
 * Writes signups to a SPECIFIC spreadsheet + tab:
 *   Spreadsheet: 1eb7qRbZGU4JbMNMgHlchPptTunVULEWV1r533NPy7-A
 *   Tab (gid):   1290467831   ("Sheet 2")
 *
 * Setup:
 *   1. Open that spreadsheet → Extensions → Apps Script.
 *   2. Paste this whole file, Save.
 *   3. Run doGet once to grant the authorization prompt (so the script
 *      may edit the spreadsheet).
 *   4. Deploy → New deployment → Web app
 *        Execute as: Me · Who has access: Anyone.
 *   5. Copy the /exec URL into GOOGLE_SHEET_WEBHOOK_URL
 *      (Vercel env var + local .env.local), then redeploy the site.
 *   (Editing an existing deployment? Pick "New version" so the change
 *    goes live; the /exec URL then stays the same.)
 *
 * Sheet 2 row 1 headers (recommended — dedupe scans column B):
 *   A: Timestamp   B: Email   C: Locale   D: UserAgent
 *
 * Contract (matches app/api/waitlist/route.ts):
 *   Request  — POST JSON: { "email": "...", "locale": "en" }
 *   Response — { "result": "ok" } on insert,
 *              { "result": "duplicate" } if email already present,
 *              { "result": "error", "message": "..." } on failure.
 */

const SPREADSHEET_ID = '1eb7qRbZGU4JbMNMgHlchPptTunVULEWV1r533NPy7-A';
const SHEET_GID = 1290467831; // "Sheet 2"

function doPost(e) {
  try {
    // The Next.js route forwards the original JSON body untouched, so
    // the payload arrives as postData.contents (not e.parameter).
    const raw = (e && e.postData && e.postData.contents) || '{}';
    const body = JSON.parse(raw);

    const email = (body.email || '').toString().trim().toLowerCase();
    const locale = (body.locale || '').toString().trim();
    const ua = (body.ua || '').toString().slice(0, 500);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return _json({ result: 'error', message: 'invalid_email' });
    }

    const sheet = _sheetByGid(SPREADSHEET_ID, SHEET_GID);
    if (!sheet) return _json({ result: 'error', message: 'sheet_not_found' });

    // Dedupe: scan column B (Email) for a case-insensitive match.
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < existing.length; i++) {
        const cell = (existing[i][0] || '').toString().trim().toLowerCase();
        if (cell === email) {
          return _json({ result: 'duplicate' });
        }
      }
    }

    sheet.appendRow([new Date(), email, locale, ua]);
    return _json({ result: 'ok' });
  } catch (err) {
    return _json({ result: 'error', message: String(err) });
  }
}

function doGet() {
  return _json({
    result: 'ok',
    hint: 'POST JSON { email, locale } to save an address.',
  });
}

/** Find a tab by its gid (the number in the sheet URL after #gid=). */
function _sheetByGid(id, gid) {
  const sheets = SpreadsheetApp.openById(id).getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) return sheets[i];
  }
  return null;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
