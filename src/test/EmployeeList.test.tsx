import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmployeeList from '../components/EmployeeList'
import type { Employee } from '../types'

describe('EmployeeList', () => {
  describe('Empty list', () => {
    it('should show empty message when no employees', () => {
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={[]} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.getByText('No employees yet.')).toBeInTheDocument()
    })

    it('should not render table when empty', () => {
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={[]} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('Employee display', () => {
    it('should render table with single employee', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should render multiple employees', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' },
        { id: '3', firstName: 'Bob', lastName: 'Johnson' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('should display all table columns', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Developer' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('should display email when present', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('should display dash when email is missing', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      const { container } = render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const cells = container.querySelectorAll('td')
      expect(cells[1].textContent).toBe('-')
    })

    it('should display role when present', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', role: 'Developer' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      expect(screen.getByText('Developer')).toBeInTheDocument()
    })

    it('should display dash when role is missing', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      const { container } = render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const cells = container.querySelectorAll('td')
      expect(cells[2].textContent).toBe('-')
    })
  })

  describe('Edit functionality', () => {
    it('should call onEdit when edit button is clicked', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={[emp]} onEdit={onEdit} onDelete={onDelete} />)
      
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)
      
      expect(onEdit).toHaveBeenCalledOnce()
      expect(onEdit).toHaveBeenCalledWith(emp)
    })

    it('should pass correct employee to onEdit', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      fireEvent.click(editButtons[1])
      
      expect(onEdit).toHaveBeenCalledWith(employees[1])
    })

    it('should have correct number of edit buttons', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' },
        { id: '3', firstName: 'Bob', lastName: 'Johnson' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons).toHaveLength(3)
    })
  })

  describe('Delete functionality', () => {
    it('should call onDelete when delete button is clicked', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={[emp]} onEdit={onEdit} onDelete={onDelete} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
      
      expect(onDelete).toHaveBeenCalledOnce()
      expect(onDelete).toHaveBeenCalledWith('1')
    })

    it('should pass correct id to onDelete', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      fireEvent.click(deleteButtons[1])
      
      expect(onDelete).toHaveBeenCalledWith('2')
    })

    it('should have correct number of delete buttons', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons).toHaveLength(2)
    })

    it('should have danger class on delete buttons', () => {
      const emp: Employee = { id: '1', firstName: 'John', lastName: 'Doe' }
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={[emp]} onEdit={onEdit} onDelete={onDelete} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toHaveClass('danger')
    })
  })

  describe('Table rendering', () => {
    it('should render correct table structure', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Developer' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      const { container } = render(
        <EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />
      )
      
      expect(container.querySelector('thead')).toBeInTheDocument()
      expect(container.querySelector('tbody')).toBeInTheDocument()
    })

    it('should have correct table headers', () => {
      const employees: Employee[] = [
        { id: '1', firstName: 'John', lastName: 'Doe' }
      ]
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      render(<EmployeeList employees={employees} onEdit={onEdit} onDelete={onDelete} />)
      
      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(4)
      expect(headers[0]).toHaveTextContent('Name')
      expect(headers[1]).toHaveTextContent('Email')
      expect(headers[2]).toHaveTextContent('Role')
      expect(headers[3]).toHaveTextContent('Actions')
    })
  })
})
