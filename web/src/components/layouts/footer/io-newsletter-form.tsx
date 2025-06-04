'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NewsletterFormProps {
  title?: string
  placeholder?: string
  buttonText?: string
  successMessage?: string
  onSubscribe?: (email: string) => void
  className?: string
}

export default function NewsletterForm({
  title = 'Join our newsletter',
  placeholder = 'Your email address',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  onSubscribe,
  className = '',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubscribe?.(email)
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className={`w-full max-w-xl mx-auto text-center ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {submitted ? (
        <p className="text-green-600">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border rounded-md"
            required
          />
          <Button type="submit" className="px-4 py-2 rounded-md">
            {buttonText}
          </Button>
        </form>
      )}
    </div>
  )
}