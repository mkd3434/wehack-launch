/*
 * WeHack Launch Page — Email Signup Webhook
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://sheets.google.com → Create a new spreadsheet
 * 2. Name it "WeHack Launch Signups"
 * 3. In Row 1, add headers: Timestamp | Email | Source | Page
 * 4. Go to Extensions → Apps Script
 * 5. Delete the default code and paste everything below
 * 6. Click Deploy → New deployment
 * 7. Type: "Web app"
 * 8. Execute as: "Me"
 * 9. Who has access: "Anyone"
 * 10. Click Deploy → Copy the Web App URL
 * 11. Paste that URL into wehack-launch/index.html replacing GOOGLE_APPS_SCRIPT_URL
 * 12. Commit & push to GitHub
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      new Date().toISOString(),
      data.email || '',
      data.source || 'wehack-launch-signup',
      data.page || 'launch'
    ]);

    // Optional: send yourself a notification email
    try {
      MailApp.sendEmail({
        to: 'info@wehack.co.nz',
        subject: 'New WeHack Signup: ' + data.email,
        body: 'New signup from the launch page!\n\n' +
              'Email: ' + data.email + '\n' +
              'Source: ' + (data.source || 'launch') + '\n' +
              'Time: ' + new Date().toLocaleString('en-NZ', {timeZone: 'Pacific/Auckland'})
      });
    } catch(mailErr) { /* email sending is optional */ }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for CORS preflight from browser
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Webhook is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
