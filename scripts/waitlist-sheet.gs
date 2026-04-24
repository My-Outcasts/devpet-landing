/**
 * Codepet waitlist endpoint — Google Apps Script web app.
 *
 * Paste this entire file into the Apps Script editor bound to your
 * waitlist Google Sheet (Extensions → Apps Script), then Deploy →
 * New deployment → Web app (Execute as: Me · Who has access: Anyone).
 * Copy the /exec URL into GOOGLE_SHEET_WEBHOOK_URL in .env.local.
 *
 * The bound spreadsheet's first sheet should have these headers
 * in row 1:
 *   A: Timestamp   B: Email   C: Locale   D: UserAgent
 *
 * Contract (matches app/api/waitlist/route.ts):
 *   Request  — POST JSON: { "email": "...", "locale": "en" }
 *   Response — JSON: { "result": "ok" } on insert,
 *                    { "result": "duplicate" } if email already present,
 *                    { "result": "error", "message": "..." } on failure.
 */

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

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

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

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
