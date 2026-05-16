import type { Employee } from '../types'

const KEY = 'employees'

export function getEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Employee[]
  } catch (e) {
    console.error('Failed to read employees', e)
    return []
  }
}

export function saveEmployees(list: Employee[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function addEmployee(emp: Employee) {
  const list = getEmployees()
  list.push(emp)
  saveEmployees(list)
}

export function updateEmployee(emp: Employee) {
  const list = getEmployees().map(e => (e.id === emp.id ? emp : e))
  saveEmployees(list)
}

export function deleteEmployee(id: string) {
  const list = getEmployees().filter(e => e.id !== id)
  saveEmployees(list)
}
