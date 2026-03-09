import type { IconType } from "react-icons";
import styled from "styled-components";
import { STATUS_COLOURS } from "../statusColours";

// Icons
import { IoIosWarning } from "react-icons/io";
import { FaTicketSimple, FaSquareCheck } from "react-icons/fa6";
import { RiPoliceBadgeFill } from "react-icons/ri";

type PaymentStatusIconProps = {
  $status?: string;
  isCouponPlan?: boolean;
};

// type StatusColour = "success" | "warning" | "danger";
type StatusVisual = { icon: IconType; color: keyof typeof STATUS_COLOURS; title: string };

  // const STATUS_COLORS: Record<StatusColour, string> = {
  //   danger: STATUS_COLOURS.danger,
  //   warning: STATUS_COLOURS.warning,
  //   success: STATUS_COLOURS.success,
  // };

const IconWrapper = styled.span<{ $color: keyof typeof STATUS_COLOURS }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.9;
  color: ${({ $color }) => STATUS_COLOURS[$color]};
`;

// Define the mapping of status values to their corresponding visuals
// Statuses are : "overdue",
//  "bono anterior",
//  "bono estandar",
//  "bono policial",
//  and any other value defaults to "paid"
export const STATUS_VISUALS: Record<string, StatusVisual> = {
  overdue: { icon: IoIosWarning, color: "danger", title: "Overdue" },
  oldCoupon: { icon: FaTicketSimple, color: "secondary", title: "Old Coupon Package" },
  newCoupon: { icon: FaTicketSimple, color: "warning", title: "New Coupon Package" },
  policeCoupon: { icon: RiPoliceBadgeFill, color: "primary", title: "Police Coupon" },
  paid: { icon: FaSquareCheck, color: "success", title: "Paid" },
};

const getStatusVisual = (status?: string, isCouponPlan?: boolean): StatusVisual => {
  const normalizedStatus = (status || "").toLowerCase();

  if (isCouponPlan && normalizedStatus === "bono anterior") {
    return STATUS_VISUALS.oldCoupon;
  }

  if (isCouponPlan && normalizedStatus === "bono estandar") {
    return STATUS_VISUALS.newCoupon;
  }

  if (normalizedStatus === "bono policial") {
    return STATUS_VISUALS.policeCoupon;
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