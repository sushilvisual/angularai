import React from 'react'
import type { Employee } from '../types'

type Props = {
  employees: Employee[]
  onEdit: (emp: Employee) => void
  onDelete: (id: string) => void
}

export default function EmployeeList({ employees, onEdit, onDelete }: Props) {
  if (employees.length === 0) return <p>No employees yet.</p>

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.firstName} {emp.lastName}</td>
            <td>{emp.email || '-'}</td>
            <td>{emp.role || '-'}</td>
            <td>
              <button onClick={() => onEdit(emp)}>Edit</button>
              <button className="danger" onClick={() => onDelete(emp.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
