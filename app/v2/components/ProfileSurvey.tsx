'use client'

import { FormEvent, useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * ProfileSurvey — Optional 5-field survey shown after a successful
 * email submit on either the Product or FinalCta forms.
 *
 * Drives the post-submit progressive-profiling flow:
 *   1. Email captured (parent component)
 *   2. Parent renders <ProfileSurvey email=... onComplete=... />
 *   3. User fills + submits OR skips → onComplete fires
 *   4. Parent swaps to its terminal "thanks" state
 *
 * All five fields are optional. The form is wrapped in v2-survey-*
 * classes that mirror the Codepet pixel-art system (see fonts.css).
 *
 * For now the submit posts to /api/waitlist/profile. If the env
 * webhook isn't set the route logs the payload and returns ok, so
 * the preview deploy works without any backend wiring.
 */

type SurveyState = 'idle' | 'submitting' | 'error'

type SignupFor = 'self' | 'family'

type Props = {
  email: string
  /** Whether the parent's surface is dark (FinalCta purple) or light
   *  (Product green band). Drives label / input contrast. */
  variant?: 'light' | 'dark'
  onComplete: () => void
}

export default function ProfileSurvey({ email, variant = 'dark', onComplete }: Props) {
  const { t } = useLocale()
  const survey = t.v2.survey
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [source, setSource] = useState('')
  const [sourceOther, setSourceOther] = useState('')
  const [signupFor, setSignupFor] = useState<SignupFor>('self')
  const [familyAge, setFamilyAge] = useState('')
  const [state, setState] = useState<SurveyState>('idle')

  const submitting = state === 'submitting'
  const submitLabel = submitting ? survey.submitting : survey.submit

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    try {
      const res = await fetch('/api/waitlist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          age: age || undefined,
          gender: gender || undefined,
          source: source || undefined,
          sourceOther: source === 'Other' || source === 'Khác' ? sourceOther : undefined,
          signupFor,
          familyAge: signupFor === 'family' ? familyAge || undefined : undefined,
        }),
      })
      if (!res.ok) throw new Error('profile post failed')
      onComplete()
    } catch {
      setState('error')
    }
  }

  function handleSkip() {
    onComplete()
  }

  // Source "Other" is the LAST option in both vi.json and en.json.
  // Compare against the localized last entry rather than hardcoding.
  const otherOption = survey.sourceOptions[survey.sourceOptions.length - 1]
  const showSourceOther = source === otherOption

  const fam = signupFor === 'family'

  return (
    <div className={`v2-survey v2-survey--${variant}`} role="region" aria-label={survey.title}>
      <div className="v2-survey-banner">
        <span className="v2-survey-tick" aria-hidden="true">✓</span>
        <div>
          <p className="v2-survey-banner-title">{survey.title}</p>
          <p className="v2-survey-banner-subtitle">{survey.subtitle}</p>
        </div>
      </div>

      <form className="v2-survey-form" onSubmit={handleSubmit}>
        <div className="v2-survey-field">
          <label className="v2-survey-label" htmlFor="survey-age">{survey.ageLabel}</label>
          <select
            id="survey-age"
            className="v2-survey-input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">{survey.agePlaceholder}</option>
            {survey.ageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="v2-survey-field">
          <label className="v2-survey-label">{survey.genderLabel}</label>
          <div className="v2-survey-grid2">
            {survey.genderOptions.map((opt) => (
              <label
                key={opt}
                className={`v2-survey-tile${gender === opt ? ' v2-survey-tile--on' : ''}`}
              >
                <input
                  type="radio"
                  name="survey-gender"
                  value={opt}
                  checked={gender === opt}
                  onChange={() => setGender(opt)}
                  className="v2-survey-radio-input"
                />
                <span className="v2-survey-radio" aria-hidden="true" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="v2-survey-field">
          <label className="v2-survey-label" htmlFor="survey-source">{survey.sourceLabel}</label>
          <select
            id="survey-source"
            className="v2-survey-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">{survey.sourcePlaceholder}</option>
            {survey.sourceOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {showSourceOther && (
            <input
              type="text"
              className="v2-survey-input v2-survey-input--inline"
              placeholder={survey.sourceOtherPlaceholder}
              value={sourceOther}
              onChange={(e) => setSourceOther(e.target.value)}
              maxLength={120}
            />
          )}
        </div>

        <div className="v2-survey-field">
          <label className="v2-survey-label">{survey.signupForLabel}</label>
          <div className="v2-survey-toggle" role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={signupFor === 'self'}
              className={`v2-survey-toggle-opt${signupFor === 'self' ? ' v2-survey-toggle-opt--on' : ''}`}
              onClick={() => setSignupFor('self')}
            >
              {survey.signupForSelf}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={signupFor === 'family'}
              className={`v2-survey-toggle-opt${signupFor === 'family' ? ' v2-survey-toggle-opt--on' : ''}`}
              onClick={() => setSignupFor('family')}
            >
              {survey.signupForFamily}
            </button>
          </div>
        </div>

        <div className={`v2-survey-field v2-survey-field--family${fam ? '' : ' v2-survey-field--off'}`}>
          <label className="v2-survey-label" htmlFor="survey-family-age">{survey.familyAgeLabel}</label>
          <select
            id="survey-family-age"
            className="v2-survey-input"
            value={familyAge}
            onChange={(e) => setFamilyAge(e.target.value)}
            disabled={!fam}
          >
            <option value="">{survey.familyAgePlaceholder}</option>
            {survey.ageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {state === 'error' && (
          <p className="v2-survey-error" role="alert">{survey.errorServer}</p>
        )}

        <div className="v2-survey-actions">
          <button
            type="button"
            className="v2-survey-skip"
            onClick={handleSkip}
            disabled={submitting}
          >
            {survey.skip}
          </button>
          <button type="submit" className="v2-survey-submit" disabled={submitting}>
            <span className="v2-survey-submit-body">{submitLabel}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
