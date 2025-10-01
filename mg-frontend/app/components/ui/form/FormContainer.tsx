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
