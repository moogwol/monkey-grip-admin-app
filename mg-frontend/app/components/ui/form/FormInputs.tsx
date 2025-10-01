import styled from "styled-components";

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
        appearance: textfield;
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
