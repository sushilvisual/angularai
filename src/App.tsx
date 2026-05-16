import React, { useEffect, useState } from 'react'
import type { Employee } from './types'
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from './services/storage'
import EmployeeList from './components/EmployeeList'
import EmployeeForm from './components/EmployeeForm'

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Employee | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setEmployees(getEmployees())
  }, [])

  function refresh() {
    setEmployees(getEmployees())
  }

  function handleAdd(emp: Employee) {
    addEmployee(emp)
    refresh()
    setShowForm(false)
  }

  function handleUpdate(emp: Employee) {
    updateEmployee(emp)
    refresh()
    setEditing(null)
    setShowForm(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this employee?')) return
    deleteEmployee(id)
    refresh()
  }

  const filtered = employees.filter(e => {
    const q = query.toLowerCase()
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.role || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="container">
      <header>
        <h1>Employee Manager</h1>
      </header>

      <div className="toolbar">
        <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
        <div>
          <button onClick={() => { setEditing(null); setShowForm(true); }}>Add Employee</button>
        </div>
      </div>

      <main>
        <EmployeeList employees={filtered} onEdit={(emp) => { setEditing(emp); setShowForm(true) }} onDelete={handleDelete} />
      </main>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing ? 'Edit' : 'Add'} Employee</h2>
            <EmployeeForm initial={editing} onSave={editing ? handleUpdate : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />
          </div>
        </div>
      )}
    </div>
  )
}
