import styled from "styled-components";

export const NewMemberForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
    padding: 16px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #f9f9f9;
`;

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

export const FormLabel = styled.label`
    font-weight: 500;
    color: #333;
    font-size: 20px;
`;

export const FormInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

export const FormSelect = styled.select`
    padding: 8px 12px;
    max-width: 8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    height: 40px;
    box-sizing: border-box;

    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

export const FormNumberInput = styled.input.attrs({ type: 'number' })`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 80px;
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
    
    /* Style the spinner buttons */
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

export const EmailInput = styled(FormInput).attrs({ type: 'email' })``;

export const Actions = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
`;

export const SubmitButton = styled.button`
    flex: 1;
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    
    &:hover {
        background-color: #0056b3;
    }
    
    &:active {
        background-color: #004085;
    }
`;

export const CancelButton = styled.button`
    flex: 1;
    padding: 12px 24px;
    background-color: #ff1e00e7;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    
    &:hover {
        background-color: #e63946;
    }
    
    &:active {
        background-color: #c72c3b;
    }
`