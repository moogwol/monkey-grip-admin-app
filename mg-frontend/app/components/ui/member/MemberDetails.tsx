import styled from "styled-components";

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
