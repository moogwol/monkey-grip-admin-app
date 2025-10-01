import styled from "styled-components";

export const MemberProfile = styled.div`
  display: flex;
  flex-direction: column;
  // gap: 2rem;
  max-width: 40rem;
`;

export const MemberContent = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid #e3e3e3;
  padding: 2rem;
  // gap: 1.5rem;
`;

export const MemberHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  
  h1 {
    font-size: 4rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }
`;
