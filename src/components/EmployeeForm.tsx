import React, { useState, useEffect } from 'react'
import type { Employee } from '../types'

type Props = {
  initial?: Employee | null
  onSave: (emp: Employee) => void
  onCancel: () => void
}

export default function EmployeeForm({ initial, onSave, onCancel }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (initial) {
      setFirstName(initial.firstName)
      setLastName(initial.lastName)
      setEmail(initial.email || '')
      setRole(initial.role || '')
    } else {
      setFirstName('')
      setLastName('')
      setEmail('')
      setRole('')
    }
  }, [initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const emp: Employee = {
      id: initial?.id || crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || undefined,
      role: role.trim() || undefined
    }
    onSave(emp)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="row">
        <label>First name</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
      </div>
      <div className="row">
        <label>Last name</label>
        <input value={lastName} onChange={e => setLastName(e.target.value)} required />
      </div>
      <div className="row">
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="row">
        <label>Role</label>
        <input value={role} onChange={e => setRole(e.target.value)} />
      </div>
      <div className="actions">
        <button type="submit">Save</button>
        <button type="button" className="muted" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
