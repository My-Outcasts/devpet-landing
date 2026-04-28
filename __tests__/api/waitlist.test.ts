/**
 * @jest-environment node
 */
import { POST } from '@/app/api/waitlist/route'
import { NextRequest } from 'next/server'

// Mock googleapis. Each test sets up jest.fn return values via the
// shared mocks below. The default implementation simulates an empty
// sheet (no dedup hit) and a successful append.
const valuesGet = jest.fn().mockResolvedValue({ data: { values: [] } })
const valuesAppend = jest.fn().mockResolvedValue({ data: {} })

jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn().mockImplementation(() => ({})),
    },
    sheets: jest.fn().mockReturnValue({
      spreadsheets: {
        values: {
          get: (...args: unknown[]) => valuesGet(...args),
          append: (...args: unknown[]) => valuesAppend(...args),
        },
      },
    }),
  },
}))

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/waitlist', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  valuesGet.mockReset().mockResolvedValue({ data: { values: [] } })
  valuesAppend.mockReset().mockResolvedValue({ data: {} })
  process.env.GOOGLE_SHEET_ID = 'sheet-id'
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'svc@iam.gserviceaccount.com'
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY =
    '-----BEGIN PRIVATE KEY-----\\nfake\\n-----END PRIVATE KEY-----\\n'
})

test('returns 400 for missing email', async () => {
  const res = await POST(makeRequest({}))
  expect(res.status).toBe(400)
  const json = await res.json()
  expect(json.error).toMatch(/invalid email/i)
})

test('returns 400 for invalid email format', async () => {
  const res = await POST(makeRequest({ email: 'notanemail' }))
  expect(res.status).toBe(400)
})

test('returns status:ok and appends row for fresh email', async () => {
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ status: 'ok' })
  expect(valuesAppend).toHaveBeenCalledTimes(1)
})

test('returns status:duplicate when email already in sheet', async () => {
  valuesGet.mockResolvedValueOnce({
    data: { values: [['User@Example.com', 'other@example.com']] },
  })
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ status: 'duplicate' })
  expect(valuesAppend).not.toHaveBeenCalled()
})

test('returns 500 when env vars are missing', async () => {
  delete process.env.GOOGLE_SHEET_ID
  const res = await POST(
    makeRequest({ email: 'user@example.com', locale: 'en' })
  )
  expect(res.status).toBe(500)
})
