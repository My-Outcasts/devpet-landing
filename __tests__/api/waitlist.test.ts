/**
 * @jest-environment node
 */
import { POST } from '@/app/api/waitlist/route'
import { NextRequest } from 'next/server'

// Mock fetch — the route forwards to GOOGLE_SHEET_WEBHOOK_URL and follows
// a 302 redirect to a script.googleusercontent.com URL. Tests stub both
// hops via a sequenced mock.
const fetchMock = jest.fn() as jest.Mock
global.fetch = fetchMock as unknown as typeof fetch

function mockAppsScriptResponse(payload: unknown) {
  // First hop: 302 redirect with a Location header
  fetchMock.mockResolvedValueOnce({
    status: 302,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === 'location'
          ? 'https://script.googleusercontent.com/echo'
          : null,
    },
    text: async () => '',
  } as unknown as Response)
  // Second hop: 200 with JSON body
  fetchMock.mockResolvedValueOnce({
    status: 200,
    headers: { get: () => null },
    text: async () => JSON.stringify(payload),
  } as unknown as Response)
}

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/waitlist', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  fetchMock.mockReset()
  process.env.GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/test/exec'
})

test('returns 400 for missing email', async () => {
  const res = await POST(makeRequest({}))
  expect(res.status).toBe(400)
})

test('returns 400 for invalid email format', async () => {
  const res = await POST(makeRequest({ email: 'notanemail' }))
  expect(res.status).toBe(400)
})

test('returns 200 status:ok when Apps Script returns result:ok', async () => {
  mockAppsScriptResponse({ result: 'ok' })
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ status: 'ok' })
})

test('returns 200 status:duplicate when Apps Script reports duplicate', async () => {
  mockAppsScriptResponse({ result: 'duplicate' })
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ status: 'duplicate' })
})

test('returns 502 when Apps Script reports an error', async () => {
  mockAppsScriptResponse({ result: 'error', message: 'permission denied' })
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(502)
})

test('returns 500 when env var is missing', async () => {
  delete process.env.GOOGLE_SHEET_WEBHOOK_URL
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(500)
})
