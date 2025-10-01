import styled from "styled-components";

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
