import styled from "styled-components";

export const MemberProfile = styled.div`
  display: flex;
  flex-direction: column;
  // gap: 2rem;
  max-width: 40rem;
`;

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

export const MemberDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  // border: 1px solid #e3e3e3;
  gap: 1rem;
  margin: 1rem 0;
`;

export const BeltInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const PaymentStatus = styled.div`
  display: flex;
  align-items: center;
`;

export const PaymentStatusBadge = styled.div<{ $status: 'current' | 'overdue' | 'suspended' | 'paid' | 'trial' }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.875rem;
  text-transform: capitalize;
  
  background-color: ${props => {
    switch (props.$status) {
      case 'current': return '#28a745';
      case 'paid': return '#28a745';
      case 'trial': return '#71e3ffff';
      case 'overdue': return '#ff0707ff';
      case 'suspended': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  
  color: ${props => props.$status === 'overdue' ? '#000' : '#fff'};
  
  @media (max-width: 768px) {
    position: static;
    align-self: center;
    margin-top: 0.5rem;
  }
`;

export const ContactDetails = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem; 
  font-size: 1.2rem;
  `;

export const CouponsSection = styled.div`
  margin-top: 2rem;
  
  h3 {
    margin-bottom: 1rem;
  }
`;

export const CouponsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CouponItem = styled.li`
  padding: 1rem;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  
  &.used {
    opacity: 0.6;
    background-color: #f8f9fa;
  }
`;

export const CouponInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e3e3e3;
  border-radius: 4px;
  overflow: hidden;
`;

export const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: #007bff;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

export const MemberActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
`;