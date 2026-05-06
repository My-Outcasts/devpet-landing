// The current canonical landing page is the V2 landing. We re-export
// it here so it serves at the base domain (`/`) instead of `/v2`.
// The previous `Home` component (and its imports) lives in git history
// if we ever need to roll back.
export { default } from './v2/page'
