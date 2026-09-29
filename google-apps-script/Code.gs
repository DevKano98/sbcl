/**
 * Bound script for the existing Google Sheet.
 * Deploy as a Web App that executes as you (the sheet owner).
 */
const SHEET_NAME = 'Registrations';
const HEADERS = [
  'registration_id', 'full_name', 'email', 'phone', 'college', 'branch', 'year',
  'aws_builder_alias', 'aws_display_name', 'status', 'created_at', 'updated_at'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    const body = JSON.parse(e && e.postData && e.postData.contents || '{}');
    if (!['create', 'aws_clicked', 'complete'].includes(body.action)) {
      throw new Error('Invalid request.');
    }
    const id = clean(body.registration_id);
    if (!/^AWS-[A-Z0-9]{6}$/.test(id)) throw new Error('Invalid registration ID.');

    lock.waitLock(10000);
    locked = true;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Registrations sheet not found.');
    const columns = getColumns(sheet);
    const rowNumber = findRow(sheet, columns.registration_id, id);
    const now = new Date();

    if (body.action === 'create') {
      if (rowNumber) return json({ success: true, data: { registration_id: id } });
      const values = {
        registration_id: id,
        full_name: required(body.full_name, 'Full name'),
        email: required(body.email, 'Email'),
        phone: required(body.phone, 'Phone'),
        college: required(body.college, 'College'),
        branch: required(body.branch, 'Branch'),
        year: required(body.year, 'Year'),
        aws_builder_alias: '',
        aws_display_name: '',
        status: 'started',
        created_at: now,
        updated_at: now
      };
      const row = Array(sheet.getLastColumn()).fill('');
      HEADERS.forEach(function (header) { row[columns[header] - 1] = values[header]; });
      sheet.appendRow(row);
      return json({ success: true, data: { registration_id: id } });
    }

    if (!rowNumber) throw new Error('Registration not found.');

    if (body.action === 'aws_clicked') {
      // A delayed click request must not undo a completed registration.
      const status = sheet.getRange(rowNumber, columns.status).getValue();
      if (status !== 'completed') {
        sheet.getRange(rowNumber, columns.status).setValue('aws_opened');
        sheet.getRange(rowNumber, columns.updated_at).setValue(now);
      }
      return json({ success: true, data: {} });
    }

    const alias = required(body.aws_builder_alias, 'Builder Alias');
    const displayName = required(body.aws_display_name, 'Name on AWS');
    sheet.getRange(rowNumber, columns.aws_builder_alias).setValue(alias);
    sheet.getRange(rowNumber, columns.aws_display_name).setValue(displayName);
    sheet.getRange(rowNumber, columns.status).setValue('completed');
    sheet.getRange(rowNumber, columns.updated_at).setValue(now);
    return json({ success: true, data: {} });
  } catch (error) {
    const message = error && error.message === 'Registration not found.' ? error.message :
      error && /^(Invalid request\.|Invalid registration ID\.|.+ is required\.|Registrations sheet not found\.|Sheet headers are missing: .+)$/.test(error.message) ? error.message :
      'Something went wrong. Please try again.';
    console.error(error);
    return json({ success: false, message: message });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function getColumns(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columns = {};
  headers.forEach(function (header, index) { columns[String(header).trim()] = index + 1; });
  const missing = HEADERS.filter(function (header) { return !columns[header]; });
  if (missing.length) throw new Error('Sheet headers are missing: ' + missing.join(', '));
  return columns;
}

function findRow(sheet, idColumn, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === id) return i + 2;
  }
  return 0;
}

function clean(value) {
  return String(value == null ? '' : value).trim();
}

function required(value, label) {
  const result = clean(value);
  if (!result) throw new Error(label + ' is required.');
  // Keep spreadsheet formulas supplied as form input as plain text.
  return /^[=+\-@]/.test(result) ? "'" + result : result;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
