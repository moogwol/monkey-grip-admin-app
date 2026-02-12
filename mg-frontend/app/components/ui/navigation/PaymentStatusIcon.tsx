import styled from "styled-components";

type PaymentStatusIconProps = {
  $status?: string;
};

const IconWrapper = styled.span<PaymentStatusIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.9;
  
  ${(props) => {
    const status = (props.$status || "").toLowerCase();
    if (status === "overdue") {
      return `color: #dc3545;`; // Red for overdue
    }
    if (status.includes("coupon")) {
      return `color: #ffc107;`; // Yellow for coupon
    }
    return `color: #28a745;`; // Green for paid statuses
  }}
`;

export const PaymentStatusIcon = ({ $status }: PaymentStatusIconProps) => {
  const status = ($status || "").toLowerCase();
  
  if (status === "overdue") {
    return (
      <IconWrapper $status={$status} title="Overdue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
      </IconWrapper>
    );
  }
  if (status.includes("coupon")) {
    return (
      <IconWrapper $status={$status} title="Coupon Package">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.55 3.95 4.24.25-3.29 2.69 1.08 4.11z"/>
        </svg>
      </IconWrapper>
    );
  }
  return (
    <IconWrapper $status={$status} title="Paid">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </IconWrapper>
  );
};
