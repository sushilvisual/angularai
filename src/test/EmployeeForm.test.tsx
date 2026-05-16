import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeeForm from '../components/EmployeeForm'
import type { Employee } from '../types'

describe('EmployeeForm', () => {
  describe('Add mode (no initial employee)', () => {
    it('should render form with empty fields', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(4)
      inputs.forEach(input => expect(input).toHaveValue(''))
    })

    it('should render form labels', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      expect(screen.getByText('First name')).toBeInTheDocument()
      expect(screen.getByText('Last name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
    })

    it('should call onSave with new employee data', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      const saveButton = screen.getByRole('button', { name: /save/i })
      
      fireEvent.change(inputs[0], { target: { value: 'John' } })
      fireEvent.change(inputs[1], { target: { value: 'Doe' } })
      fireEvent.click(saveButton)
      
      expect(onSave).toHaveBeenCalledOnce()
      const emp = onSave.mock.calls[0][0] as Employee
      expect(emp.firstName).toBe('John')
      expect(emp.lastName).toBe('Doe')
      expect(emp.id).toBeDefined()
    })

    it('should generate unique UUID for new employee', () => {
      const onSave1 = vi.fn()
      const onCancel1 = vi.fn()
      const { unmount: unmount1 } = render(
        <EmployeeForm onSave={onSave1} onCancel={onCancel1} />
      )
      
      const inputs1 = screen.getAllByRole('textbox')
      const saveButton1 = screen.getByRole('button', { name: /save/i })
      
      fireEvent.change(inputs1[0], { target: { value: 'John' } })
      fireEvent.change(inputs1[1], { target: { value: 'Doe' } })
      fireEvent.click(saveButton1)
      
      const id1 = (onSave1.mock.calls[0][0] as Employee).id
      
      unmount1()
      
      const onSave2 = vi.fn()
      const onCancel2 = vi.fn()
      render(<EmployeeForm onSave={onSave2} onCancel={onCancel2} />)
      
      const inputs2 = screen.getAllByRole('textbox')
      const saveButton2 = screen.getByRole('button', { name: /save/i })
      
      fireEvent.change(inputs2[0], { target: { value: 'Jane' } })
      fireEvent.change(inputs2[1], { target: { value: 'Smith' } })
      fireEvent.click(saveButton2)
      
      const id2 = (onSave2.mock.calls[0][0] as Employee).id
      
      expect(id1).not.toBe(id2)
    })

    it('should trim whitespace from input values', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      const saveButton = screen.getByRole('button', { name: /save/i })
      
      fireEvent.change(inputs[0], { target: { value: '  John  ' } })
      fireEvent.change(inputs[1], { target: { value: '  Doe  ' } })
      fireEvent.click(saveButton)
      
      const emp = onSave.mock.calls[0][0] as Employee
      expect(emp.firstName).toBe('John')
      expect(emp.lastName).toBe('Doe')
    })

    it('should require first and last name', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      const firstNameInput = inputs[0] as HTMLInputElement
      const lastNameInput = inputs[1] as HTMLInputElement
      
      expect((firstNameInput as HTMLInputElement).required).toBe(true)
      expect((lastNameInput as HTMLInputElement).required).toBe(true)
    })

    it('should allow optional email and role', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      const saveButton = screen.getByRole('button', { name: /save/i })
      
      fireEvent.change(inputs[0], { target: { value: 'John' } })
      fireEvent.change(inputs[1], { target: { value: 'Doe' } })
      fireEvent.click(saveButton)
      
      const emp = onSave.mock.calls[0][0] as Employee
      expect(emp.email).toBeUndefined()
      expect(emp.role).toBeUndefined()
    })

    it('should call onCancel when cancel button is clicked', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
      
      expect(onCancel).toHaveBeenCalledOnce()
      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('Edit mode (with initial employee)', () => {
    it('should populate form fields with initial employee data', () => {
      const initial: Employee = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Developer'
      }
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm initial={initial} onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      expect((inputs[0] as HTMLInputElement).value).toBe('John')
      expect((inputs[1] as HTMLInputElement).value).toBe('Doe')
      expect((inputs[2] as HTMLInputElement).value).toBe('john@example.com')
      expect((inputs[3] as HTMLInputElement).value).toBe('Developer')
    })

    it('should preserve employee id when updating', () => {
      const initial: Employee = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe'
      }
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm initial={initial} onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      const saveButton = screen.getByRole('button', { name: /save/i })
      
      fireEvent.change(inputs[0], { target: { value: 'Jane' } })
      fireEvent.click(saveButton)
      
      const emp = onSave.mock.calls[0][0] as Employee
      expect(emp.id).toBe('123')
    })

    it('should clear form when initial is removed', () => {
      const initial: Employee = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      }
      const onSave = vi.fn()
      const onCancel = vi.fn()
      const { rerender } = render(
        <EmployeeForm initial={initial} onSave={onSave} onCancel={onCancel} />
      )
      
      let inputs = screen.getAllByRole('textbox')
      expect((inputs[0] as HTMLInputElement).value).toBe('John')
      
      rerender(<EmployeeForm initial={null} onSave={onSave} onCancel={onCancel} />)
      
      inputs = screen.getAllByRole('textbox')
      expect((inputs[0] as HTMLInputElement).value).toBe('')
    })

    it('should handle partial employee data', () => {
      const initial: Employee = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      }
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm initial={initial} onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      expect((inputs[2] as HTMLInputElement).value).toBe('')
      expect((inputs[3] as HTMLInputElement).value).toBe('')
    })
  })

  describe('Form submission', () => {
    it('should include email and role in saved data', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: 'John' } })
      fireEvent.change(inputs[1], { target: { value: 'Doe' } })
      fireEvent.change(inputs[2], { target: { value: 'john@example.com' } })
      fireEvent.change(inputs[3], { target: { value: 'Developer' } })
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }))
      
      const emp = onSave.mock.calls[0][0] as Employee
      expect(emp.email).toBe('john@example.com')
      expect(emp.role).toBe('Developer')
    })

    it('should not include empty optional fields', () => {
      const onSave = vi.fn()
      const onCancel = vi.fn()
      render(<EmployeeForm onSave={onSave} onCancel={onCancel} />)
      
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: 'John' } })
      fireEvent.change(inputs[1], { target: { value: 'Doe' } })
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }))
      
      const emp = onSave.mock.calls[0][0] as Employee
      expect(emp.email).toBeUndefined()
      expect(emp.role).toBeUndefined()
    })
  })
})
