'use client'

import { useState } from 'react'

interface AddCardFormProps {
  onSave: (title: string, details: string) => void
  onCancel: () => void
}

export default function AddCardForm({ onSave, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave(title.trim(), details.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
      <input
        autoFocus
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Card title"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy placeholder:text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <textarea
        value={details}
        onChange={e => setDetails(e.target.value)}
        placeholder="Details (optional)"
        rows={2}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy placeholder:text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-secondary py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-navy hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
