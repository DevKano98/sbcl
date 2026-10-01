const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const headers = [
  'registration_id', 'full_name', 'email', 'phone', 'college', 'branch', 'year',
  'aws_builder_alias', 'aws_display_name', 'status', 'created_at', 'updated_at',
]
const rows = [headers]
const sheet = {
  getLastColumn: () => headers.length,
  getLastRow: () => rows.length,
  getRange(row, column, height = 1, width = 1) {
    return {
      getValues: () => Array.from({ length: height }, (_, r) => Array.from({ length: width }, (_, c) => rows[row + r - 1][column + c - 1])),
      getValue: () => rows[row - 1][column - 1],
      setValue(value) { rows[row - 1][column - 1] = value },
    }
  },
  appendRow(row) { rows.push(row) },
}
const context = {
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: (name) => name === 'Registrations' ? sheet : null }) },
  ContentService: { MimeType: { JSON: 'JSON' }, createTextOutput: (text) => ({ text, setMimeType() { return this } }) },
  console: { error() {} },
}
vm.createContext(context)
vm.runInContext(fs.readFileSync('google-apps-script/Code.gs', 'utf8'), context)
const send = (body) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(body) } }).text)
const registration = {
  action: 'create', registration_id: 'AWS-K8Q4P2', full_name: 'Test Student',
  email: 'test@example.com', phone: '+919876543210', college: 'Example College',
  branch: 'Computer Science', year: '2nd Year', status: 'started',
}

assert.equal(send(registration).success, true)
assert.equal(rows.length, 2)
assert.equal(rows[1][9], 'started')
assert.equal(send(registration).success, true)
assert.equal(rows.length, 2, 'a repeated create must not append another row')
assert.equal(send({ action: 'aws_clicked', registration_id: registration.registration_id }).success, true)
assert.equal(rows[1][9], 'aws_opened')
assert.equal(send({ action: 'complete', registration_id: registration.registration_id, aws_builder_alias: 'student-alias' }).success, true)
assert.equal(rows[1][7], "'@student-alias")
assert.equal(rows[1][8], '')
assert.equal(rows[1][9], 'completed')
send({ action: 'aws_clicked', registration_id: registration.registration_id })
assert.equal(rows[1][9], 'completed', 'a delayed click must not regress the status')
assert.equal(send({ action: 'complete', registration_id: 'AWS-Z9Z9Z9', aws_builder_alias: 'x' }).message, 'Registration not found.')
console.log('Apps Script create, duplicate, click, completion, and delayed click checks passed.')
