import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Survey from '../components/Survey'

export const Route = createFileRoute('/')({
  component: Home,
})

const AUTH_TOKENS = ['invite_token', 'recovery_token', 'confirmation_token', 'email_change_token']

function Home() {
  // Identity emails (admin invites / password recovery) link to the site root; hand them to the admin area.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    if (AUTH_TOKENS.some((t) => hash.has(t))) window.location.replace(`/admin${window.location.hash}`)
  }, [])

  return <Survey />
}
