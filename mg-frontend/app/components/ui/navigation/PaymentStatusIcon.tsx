import type { IconType } from "react-icons";
import styled from "styled-components";

// Icons
import { IoIosWarning } from "react-icons/io";
import { FaTicketSimple, FaSquareCheck } from "react-icons/fa6";

type PaymentStatusIconProps = {
  $status?: string;
  isCouponPlan?: boolean;
};

type StatusColour = "success" | "warning" | "danger";
type StatusVisual = { icon: IconType; color: StatusColour; title: string };

const STATUS_COLORS: Record<StatusColour, string> = {
  danger: "#dc3545",
  warning: "#ffc107",
  success: "#28a745",
};

const IconWrapper = styled.span<{ $color: StatusColour }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.9;
  color: ${({ $color }) => STATUS_COLORS[$color]};
`;

export const STATUS_VISUALS: Record<string, StatusVisual> = {
  overdue: { icon: IoIosWarning, color: "danger", title: "Overdue" },
  coupon: { icon: FaTicketSimple, color: "warning", title: "Coupon Package" },
  paid: { icon: FaSquareCheck, color: "success", title: "Paid" },
};

const getStatusVisual = (status?: string, isCouponPlan?: boolean): StatusVisual => {
  const normalizedStatus = (status || "").toLowerCase();

  if (isCouponPlan) {
    return STATUS_VISUALS.coupon;
  }

  if (normalizedStatus === "overdue") {
    return STATUS_VISUALS.overdue;
  }

  return STATUS_VISUALS.paid;
};

export const PaymentStatusIcon = ({ $status, isCouponPlan }: PaymentStatusIconProps) => {
  const { icon: Icon, color, title } = getStatusVisual($status, isCouponPlan);

  return (
    <IconWrapper $color={color} title={title} aria-label={title}>
      <Icon size={16} />
    </IconWrapper>
  );
};