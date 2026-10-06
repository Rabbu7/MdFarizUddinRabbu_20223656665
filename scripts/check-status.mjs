import assert from 'node:assert/strict'
import { getStatus } from '../src/lib/status.js'

const deadline = '2026-10-20'
const mandatory = { mandatory: true, has_expiry: true }
const optional = { mandatory: false, has_expiry: true }

assert.equal(getStatus(mandatory, false, '', deadline), 'missing')
assert.equal(getStatus(optional, false, '', deadline), 'notProvided')
assert.equal(getStatus(mandatory, true, '', deadline), 'expiryNeeded')
assert.equal(getStatus(mandatory, true, '2026-10-19', deadline), 'expired')
assert.equal(getStatus(mandatory, true, deadline, deadline), 'ok')
assert.equal(getStatus(mandatory, true, '2026-10-21', deadline), 'ok')
assert.equal(getStatus(optional, true, '', deadline), 'expiryNeeded')

console.log('Status self-check passed: 7 cases')
