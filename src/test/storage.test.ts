import { describe, it, expect, beforeEach } from 'vitest'
import { getEmployees, saveEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/storage'
import type { Employee } from '../types'

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getEmployees', () => {
    it('should return empty array when no employees are stored', () => {
      const result = getEmployees()
      expect(result).toEqual([])
    })

    it('should return stored employees', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Developer' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'Manager' }
      ]
      saveEmployees(employees)
      const result = getEmployees()
      expect(result).toEqual(employees)
    })

    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem('employees', 'invalid json')
      const result = getEmployees()
      expect(result).toEqual([])
    })

    it('should handle JSON parsing errors', () => {
      localStorage.setItem('employees', '{incomplete')
      const result = getEmployees()
      expect(result).toEqual([])
    })
  })

  describe('saveEmployees', () => {
    it('should save employees to localStorage', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' }
      ]
      saveEmployees(employees)
      const stored = JSON.parse(localStorage.getItem('employees') || '[]') as Employee[]
      expect(stored).toEqual(employees)
    })

    it('should overwrite existing employees', () => {
      const initial = [{ id: '1', firstName: 'John', lastName: 'Doe' }]
      const updated = [{ id: '2', firstName: 'Jane', lastName: 'Smith' }]
      saveEmployees(initial)
      saveEmployees(updated)
      const result = getEmployees()
      expect(result).toEqual(updated)
    })

    it('should save empty array', () => {
      saveEmployees([])
      const result = getEmployees()
      expect(result).toEqual([])
    })
  })

  describe('addEmployee', () => {
    it('should add a new employee', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      addEmployee(emp)
      const employees = getEmployees()
      expect(employees).toHaveLength(1)
      expect(employees[0]).toEqual(emp)
    })

    it('should add multiple employees', () => {
      const emp1: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const emp2: Employee = { id: '2', firstName: 'Jane', lastName: 'Smith' }
      addEmployee(emp1)
      addEmployee(emp2)
      const employees = getEmployees()
      expect(employees).toHaveLength(2)
    })

    it('should preserve existing employees when adding new ones', () => {
      const emp1: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const emp2: Employee = { id: '2', firstName: 'Jane', lastName: 'Smith' }
      addEmployee(emp1)
      addEmployee(emp2)
      const employees = getEmployees()
      expect(employees).toContainEqual(emp1)
      expect(employees).toContainEqual(emp2)
    })
  })

  describe('updateEmployee', () => {
    it('should update an existing employee', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe', role: 'Developer' }
      addEmployee(emp)
      const updated: Employee = { id: '1', firstName: 'John', lastName: 'Smith', role: 'Manager' }
      updateEmployee(updated)
      const employees = getEmployees()
      expect(employees).toHaveLength(1)
      expect(employees[0]).toEqual(updated)
    })

    it('should not affect other employees when updating', () => {
      const emp1: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const emp2: Employee = { id: '2', firstName: 'Jane', lastName: 'Smith' }
      addEmployee(emp1)
      addEmployee(emp2)
      const updated: Employee = { id: '1', firstName: 'John', lastName: 'Updated' }
      updateEmployee(updated)
      const employees = getEmployees()
      expect(employees[0]).toEqual(updated)
      expect(employees[1]).toEqual(emp2)
    })

    it('should handle update of non-existing employee gracefully', () => {
      const emp: Employee = { id: '999', firstName: 'Ghost', lastName: 'Employee' }
      updateEmployee(emp)
      const employees = getEmployees()
      expect(employees).toHaveLength(0)
    })
  })

  describe('deleteEmployee', () => {
    it('should delete an employee by id', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      addEmployee(emp)
      deleteEmployee('1')
      const employees = getEmployees()
      expect(employees).toHaveLength(0)
    })

    it('should not affect other employees when deleting', () => {
      const emp1: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const emp2: Employee = { id: '2', firstName: 'Jane', lastName: 'Smith' }
      addEmployee(emp1)
      addEmployee(emp2)
      deleteEmployee('1')
      const employees = getEmployees()
      expect(employees).toHaveLength(1)
      expect(employees[0]).toEqual(emp2)
    })

    it('should handle deletion of non-existing employee gracefully', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      addEmployee(emp)
      deleteEmployee('999')
      const employees = getEmployees()
      expect(employees).toHaveLength(1)
      expect(employees[0]).toEqual(emp)
    })

    it('should handle deleting from empty list', () => {
      deleteEmployee('1')
      const employees = getEmployees()
      expect(employees).toHaveLength(0)
    })
  })
})
