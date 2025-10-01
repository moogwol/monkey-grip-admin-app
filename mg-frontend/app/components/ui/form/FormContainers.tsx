import styled from 'styled-components';

// Page-specific form containers
export const EditMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const NewMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

// Page-specific form titles
export const EditMemberTitle = styled.h2`
  font-size: 24px;
`;

export const NewMemberTitle = styled.h2`
  font-size: 24px;
`;

// Legacy form components - TODO: Migrate to use generic form components
export const EditMemberForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
    padding: 16px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #f9f9f9;
`;

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