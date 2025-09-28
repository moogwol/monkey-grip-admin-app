import styled from "styled-components";

// Legacy alias for StyledForm - keeping for backward compatibility
// TODO: Update imports to use StyledForm from StyledFormComponents instead
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

// Legacy alias for FormActions - keeping for backward compatibility  
// TODO: Update imports to use FormActions from StyledFormComponents instead
export const Actions = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
`;