import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectOption } from './Select';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
  it('should render select element', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={mockOptions} />);
    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('should render with label', () => {
    render(<Select label="Status" id="status" options={mockOptions} />);
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should show required asterisk when required prop is true', () => {
    render(<Select label="Category" id="category" options={mockOptions} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Select options={mockOptions} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should display helper text', () => {
    render(<Select options={mockOptions} helperText="Choose one option" />);
    expect(screen.getByText('Choose one option')).toBeInTheDocument();
  });

  it('should not display helper text when error is present', () => {
    render(
      <Select
        options={mockOptions}
        error="Error message"
        helperText="Helper text"
      />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should call onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should update value when selecting option', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(select.value).toBe('option2');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select options={mockOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should support fullWidth prop', () => {
    render(<Select options={mockOptions} fullWidth />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should support custom className', () => {
    render(<Select options={mockOptions} className="custom-select" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('custom-select');
  });

  it('should forward ref to select element', () => {
    const ref = { current: null } as React.RefObject<HTMLSelectElement>;
    render(<Select options={mockOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('should link label to select with id', () => {
    render(<Select label="Test Label" id="test-select" options={mockOptions} />);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-select');
  });

  it('should support default value', () => {
    render(<Select options={mockOptions} defaultValue="option2" />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('should render with controlled value', () => {
    render(<Select options={mockOptions} value="option3" onChange={() => {}} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('option3');
  });

  it('should render options with correct values', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(mockOptions.length);
    options.forEach((option, index) => {
      expect(option.value).toBe(mockOptions[index].value);
      expect(option.textContent).toBe(mockOptions[index].label);
    });
  });
});

