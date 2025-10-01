import styled from "styled-components";

export const MemberBanner = styled.div`
  position: relative;
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  // border: 1px solid black;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

export const MemberAvatar = styled.div`
  img {
    width: 12rem;
    height: 12rem;
    background: #c8c8c8;
    border: 2px solid #fff;
    border-radius: 1.5rem;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    align-self: center;
    
    img {
      width: 8rem;
      height: 8rem;
    }
  }
`;

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
