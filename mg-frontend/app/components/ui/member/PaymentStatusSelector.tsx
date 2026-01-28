import styled from "styled-components";

export const PaymentStatusSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1.25rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
`;

export const PaymentStatusLabel = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 0.25rem;
`;

export const PaymentStatusSelect = styled.select`
  padding: 0.6rem 0.75rem;
  border: 2px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #80bdff;
  }
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.15);
  }

  option {
    padding: 0.5rem;
  }
`;

export const PaymentStatusButton = styled.button`
  padding: 0.6rem 1.25rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    background-color: #004085;
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const PaymentStatusForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
