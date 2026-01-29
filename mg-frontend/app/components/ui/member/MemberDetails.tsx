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

export const PaymentStatusBadge = styled.div<{ $status: 'outstanding_coupon' | 'half_month' | 'morning_45' | 'afternoon_45' | 'full_55' | 'full_60' | 'coupon_65' | 'coupon_70' | 'overdue' }>`
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
      case 'overdue': return '#ff0707ff';
      case 'half_month': return '#ffc107';
      case 'outstanding_coupon':
      case 'morning_45':
      case 'afternoon_45':
      case 'full_55':
      case 'full_60':
      case 'coupon_65':
      case 'coupon_70':
        return '#28a745';
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
