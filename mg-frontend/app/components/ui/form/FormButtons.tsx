import styled from "styled-components";

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
