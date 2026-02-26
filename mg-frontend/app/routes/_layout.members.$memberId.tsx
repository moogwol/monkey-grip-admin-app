import { Form, useNavigate, useRevalidator } from "react-router";
import type { Route } from "../+types/root";
import { getMember, getMemberCoupons, getPaymentPlans, getMemberPayments } from "../data";
import {
  MemberProfile,
  MemberBanner,
  MemberAvatar,
  MemberHeader,
  MemberContent,
  MemberDetails,
  CouponsSection,
  MemberActions,
  BeltGraphic,
  PaymentStatusBadge,
  PaymentStatusSelector,
  PaymentStatusSelect,
  PaymentStatusLabel,
  PaymentStatusForm,
  PaymentStatusButton,
  CouponActions,
  CouponInfo,
} from "../components";

// Icons
import { FaPlus, FaMinus } from "react-icons/fa6";

import { addClasses, useClass } from "../data";

export async function loader({ params }: Route.LoaderArgs) {
  const memberId = params.memberId;
  if (!memberId) {
    throw new Response("Member ID is required", { status: 400 });
  }

  const member = await getMember(memberId);
  if (!member) {
    throw new Response("Member not found", { status: 404 });
  }

  // Load member's coupons and active payment plans
  const [coupons, plans, payments] = await Promise.all([
    getMemberCoupons(memberId),
    getPaymentPlans(true),
    getMemberPayments(memberId)
  ]);

  return { member, coupons, plans, payments };
}



export default function Member({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    throw new Response("Member not found", { status: 404 });
  }

  const data = loaderData as any;
  const { member, coupons = [], plans = [], payments = [] } = data;
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getActiveCoupons = () => {
    if (!Array.isArray(coupons)) return [];
    return coupons.filter((coupon: any) => coupon.classes_used < coupon.classes_total);
  };

  const getUsedCoupons = () => {
    if (!Array.isArray(coupons)) return [];
    return coupons.filter((coupon: any) => coupon.classes_used >= coupon.classes_total);
  };

  const resolveAvatarUrl = (avatarUrl?: string | null) => {
    if (!avatarUrl) return '';

    if (avatarUrl.startsWith('/api/')) {
      return avatarUrl;
    }

    if (avatarUrl.startsWith('/')) {
      return avatarUrl;
    }

    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      try {
        const parsed = new URL(avatarUrl);
        if (parsed.pathname.startsWith('/api/')) {
          return typeof window !== 'undefined' ? `${window.location.origin}${parsed.pathname}` : parsed.pathname;
        }
        if (parsed.hostname === 'mg-api') {
          return parsed.pathname;
        }
      } catch {
        return avatarUrl;
      }
    }

    return avatarUrl;
  };

  const handleUseOneClass = async () => {
    if (!coupons.length) return;
    await useClass(String(coupons[0].id), 1);
    revalidate();
  };

  const handleAddOneClass = async () => {
    if (!coupons.length) return;
    await addClasses(String(coupons[0].id), 1);
    revalidate();
  };

  console.log("Latest payment status:", member.latest_payment_status);


  return (
    <MemberProfile>
      <MemberBanner>
        <PaymentStatusBadge $status={member.latest_payment_status || 'overdue'}>
          {((member.latest_payment_status || 'overdue').charAt(0).toUpperCase() +
            (member.latest_payment_status || 'overdue').slice(1))}
        </PaymentStatusBadge>

        <MemberAvatar>
          <img
            alt={`${member.first_name} ${member.last_name} avatar`}
            key={member.id}
            src={
              resolveAvatarUrl(member.avatar_url) ||
              `https://robohash.org/${member.first_name}+${member.last_name}`
            }
            onError={(e) => {
              // Fallback to generated avatar if the avatar_url fails to load
              if (e.currentTarget.src !== `https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`) {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`;
              }
            }}
          />
        </MemberAvatar>
        <MemberHeader>

          <h1>
            {member.first_name && member.last_name ? (
              <>
                {member.first_name} {member.last_name}
              </>
            ) : (
              <>No Name</>
            )}
          </h1>
        </MemberHeader>
      </MemberBanner>
      <MemberContent>

        <MemberDetails>
          <BeltGraphic
            beltColor={member.belt_rank}
            stripes={member.stripes}
            size="large"
          />

          <p>
            <strong>Join Date:</strong> {formatDate(member.join_date)}
          </p>

          {member.notes && (
            <div>
              <h3>Notes</h3>
              <p>{member.notes}</p>
            </div>
          )}
        </MemberDetails>
        <PaymentStatusSelector>
          {/* <PaymentStatusForm as="form" method="post"> */}
          <PaymentStatusForm as={Form}
           action="record-payment"
           method="post">
            <PaymentStatusLabel htmlFor="payment-status-select">Record Payment Plan:</PaymentStatusLabel>
            <PaymentStatusSelect
              id="payment-status-select"
              name="membership_plan_id"
              defaultValue={member.latest_membership_plan_id ?? ""}
            >
              {Array.isArray(plans) && plans.length > 0 ? (
                plans.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}{plan.price !== null && plan.price !== undefined ? ` -  €${plan.price}` : ''}
                  </option>
                ))
              ) : (
                <option value="">No plans available</option>
              )}
            </PaymentStatusSelect>
            <PaymentStatusButton type="submit">Record Payment</PaymentStatusButton>
          </PaymentStatusForm>
        </PaymentStatusSelector>

        <div className="payments-section">
          <h3>Payments</h3>
          {Array.isArray(payments) && payments.length > 0 ? (
            <ul>
              {payments.map((payment: any) => (
                <li key={payment.id} className="payment-item">
                  <strong>{payment.plan_name || 'Unassigned Plan'}</strong>
                  {payment.amount_paid !== null && payment.amount_paid !== undefined ? (
                    <span> - €{payment.amount_paid}</span>
                  ) : null}
                  {payment.payment_date ? (
                    <span> ({formatDate(payment.payment_date)})</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>No payments recorded yet.</p>
          )}
        </div>

        <CouponsSection>
          <h3>Class Coupons</h3>
          {coupons.length > 0 ? (
            <CouponInfo>
              <FaMinus onClick={handleUseOneClass} size={30} />
              <h1>{coupons[0].classes_remaining}</h1>
              <FaPlus onClick={handleAddOneClass} size={30} />
            </CouponInfo>

          ) : (
            <p>No coupons available.</p>
          )
          }
        </CouponsSection>



        <MemberActions>
          {/* <Form action={`/members/${member.id}/edit`} */}
          <Form action="edit"  // redirects to members/:id/edit where the editing is handled
            method="get">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy" // redirects to members/:id/destroy where the deletion is handled
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this member."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </MemberActions>
      </MemberContent>
    </MemberProfile>
  );
}