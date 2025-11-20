import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" id="username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should show required asterisk when required prop is true', () => {
    render(<Input label="Email" id="email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should display helper text', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('should not display helper text when error is present', () => {
    render(<Input error="Error message" helperText="Helper text" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should call onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should update value when typing', () => {
    render(<Input />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input.value).toBe('new value');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should support different input types', () => {
    render(<Input type="email" placeholder="Email input" />);
    const input = screen.getByPlaceholderText('Email input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should support date input type', () => {
    const { container } = render(<Input type="date" />);
    const input = container.querySelector('input[type="date"]');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('should support fullWidth prop', () => {
    render(<Input fullWidth placeholder="Full width input" />);
    const input = screen.getByPlaceholderText('Full width input');
    expect(input).toBeInTheDocument();
  });

  it('should support custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-input');
  });

  it('should forward ref to input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should link label to input with id', () => {
    render(<Input label="Test Label" id="test-input" />);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('should support min and max attributes for number inputs', () => {
    render(<Input type="number" min="0" max="100" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });
});

