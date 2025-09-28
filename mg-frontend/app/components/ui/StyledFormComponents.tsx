import styled from "styled-components";

// Main form container
export const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
    padding: 16px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #f9f9f9;
`;

// Field containers
export const FormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const FormRow = styled.div`
    display: flex;
    gap: 16px;
    align-items: end;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

// Labels
export const FormLabel = styled.label`
    font-weight: 500;
    color: #333;
    font-size: 20px;
`;

// Base input styling (shared properties)
const baseInputStyles = `
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    height: 40px;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

// Input elements
export const FormInput = styled.input`
    ${baseInputStyles}
`;

export const EmailInput = styled.input.attrs({ type: 'email' })`
    ${baseInputStyles}
`;

export const FormSelect = styled.select`
    ${baseInputStyles}
    max-width: 8rem;
`;

export const FormNumberInput = styled.input.attrs({ type: 'number' })`
    ${baseInputStyles}
    width: 80px;
    
    /* Hide spinner buttons */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    /* For Firefox */
    &[type=number] {
        -moz-appearance: textfield;
    }
`;

export const FormTextarea = styled.textarea`
    ${baseInputStyles}
    height: auto;
    min-height: 80px;
    resize: vertical;
    font-family: inherit;
`;

// Button containers
export const FormActions = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
`;

// Base button styling
const baseButtonStyles = `
    flex: 1 1 0;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    transition: background-color 0.2s ease;
`;

// Button variants
export const SubmitButton = styled.button`
    ${baseButtonStyles}
    background-color: #007bff;
    color: white;
    
    &:hover {
        background-color: #0056b3;
    }
    
    &:active {
        background-color: #004085;
    }
    
    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;

export const CancelButton = styled.button`
    ${baseButtonStyles}
    background-color: #ff1e00e7;
    color: white;
    
    &:hover {
        background-color: #e63946;
    }
    
    &:active {
        background-color: #c72c3b;
    }
    
    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;

export const SecondaryButton = styled.button`
    ${baseButtonStyles}
    background-color: #6c757d;
    color: white;
    
    &:hover {
        background-color: #545b62;
    }
    
    &:active {
        background-color: #495057;
    }
    
    &:disabled {
        background-color: #adb5bd;
        cursor: not-allowed;
    }
`;

// Form validation and feedback
export const FormError = styled.div`
    color: #dc3545;
    font-size: 14px;
    margin-top: 4px;
`;

export const FormHelperText = styled.div`
    color: #6c757d;
    font-size: 12px;
    margin-top: 4px;
`;

// Form sections
export const FormSection = styled.div`
    margin-bottom: 20px;
    
    &:last-child {
        margin-bottom: 0;
    }
`;

export const FormSectionTitle = styled.h3`
    margin: 0 0 12px 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
`;