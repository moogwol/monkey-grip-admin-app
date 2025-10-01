import styled from "styled-components";

export const IndexPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const IndexPageHeader = styled.header`
  text-align: center;
  padding: 2rem 0;
`;

export const IndexPageTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #2c3e50;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const IndexPageLogo = styled.img`
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

export const IndexPageSubtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;
