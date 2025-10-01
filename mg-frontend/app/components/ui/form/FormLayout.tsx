import styled from "styled-components";

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
