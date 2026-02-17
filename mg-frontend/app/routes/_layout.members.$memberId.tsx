import { Form, useFetcher, useNavigate, redirect, Outlet } from "react-router";
import type { Route } from "../+types/root";
import { getMember, deleteMember, getMemberCoupons, getPaymentPlans, createMemberPayment, getMemberPayments } from "../data";
import {
  MemberProfile,
  MemberBanner,
  MemberAvatar,
  MemberHeader,
  MemberContent,
  MemberDetails,
  ContactDetails,
  CouponsSection,
  MemberActions,
  MemberInfo,
  BeltGraphic,
  PaymentStatusBadge,
  PaymentStatusSelector,
  PaymentStatusSelect,
  PaymentStatusLabel,
  PaymentStatusForm,
  PaymentStatusButton,
} from "../components";


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

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const planIdValue = formData.get('membership_plan_id') as string;
  const memberId = params.memberId;
  if (!memberId) {
    throw new Response("Member ID is required", { status: 400 });
  }
  if (!planIdValue) {
    throw new Response("Membership plan is required", { status: 400 });
  }
  await createMemberPayment(memberId, {
    membership_plan_id: Number(planIdValue)
  });
  return redirect(`/members/${memberId}`);
}

export default function Member({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    throw new Response("Member not found", { status: 404 });
  }

  const data = loaderData as any;
  const { member, coupons = [], plans = [], payments = [] } = data;
  const navigate = useNavigate();



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

  const getApiOrigin = () => {
    const envApiUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
    if (envApiUrl) {
      if (envApiUrl.startsWith('http://') || envApiUrl.startsWith('https://')) {
        const parsed = new URL(envApiUrl);
        if (parsed.hostname !== 'mg-api') {
          return parsed.origin;
        }
      }
    }

    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}:3000`;
    }

    return 'http://localhost:3000';
  };

  const resolveAvatarUrl = (avatarUrl?: string | null) => {
    if (!avatarUrl) return '';

    if (avatarUrl.startsWith('/api/')) {
      const isDev = Boolean((import.meta as any).env?.DEV);
      return isDev ? avatarUrl : `${getApiOrigin()}${avatarUrl}`;
    }

    if (avatarUrl.startsWith('/')) {
      return `${getApiOrigin()}${avatarUrl}`;
    }

    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      try {
        const parsed = new URL(avatarUrl);
        if (parsed.hostname === 'mg-api') {
          parsed.protocol = typeof window !== 'undefined' ? window.location.protocol : parsed.protocol;
          parsed.hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
          parsed.port = '3000';
          return parsed.toString();
        }
      } catch {
        return avatarUrl;
      }
    }

    return avatarUrl;
  };



  return (
    <MemberProfile>
      <MemberBanner>
        <PaymentStatusBadge $status={member.payment_status || 'overdue'}>
          {((member.payment_status || 'overdue').charAt(0).toUpperCase() +
            (member.payment_status || 'overdue').slice(1))}
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

          <ContactDetails>
            {member.email && (
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${member.email}`}>
                  {member.email}
                </a>
              </p>
            )}

            {member.phone && (
              <p>
                <strong>Phone: </strong>
                <a href={`tel:${member.phone}`}>
                  {member.phone}
                </a>
              </p>
            )}
          </ContactDetails>

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
          <PaymentStatusForm as="form" method="post">
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

        <div className="coupons-section">
          <h3>Class Coupons</h3>

          {getActiveCoupons().length > 0 && (
            <div className="active-coupons">
              <h4>Active Coupons</h4>
              <ul>
                {getActiveCoupons().map(coupon => (
                  <li key={coupon.id} className="coupon-item">
                    <div className="coupon-info">
                      <span className="coupon-type">
                        {coupon.coupon_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="coupon-usage">
                        {coupon.classes_used} / {coupon.classes_total} classes used
                      </span>
                      {coupon.expiry_date && (
                        <span className="expiry-date">
                          Expires: {formatDate(coupon.expiry_date)}
                        </span>
                      )}
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{
                          width: `${(coupon.classes_used / coupon.classes_total) * 100}%`,
                          backgroundColor: '#007bff',
                          height: '8px',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {getUsedCoupons().length > 0 && (
            <CouponsSection>
              <h4>Used Coupons</h4>
              <ul>
                {getUsedCoupons().map(coupon => (
                  <li key={coupon.id} className="coupon-item used">
                    <div className="coupon-info">
                      <span className="coupon-type">
                        {coupon.coupon_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="coupon-usage">
                        Completed ({coupon.classes_total} classes)
                      </span>
                      <span className="purchase-date">
                        Purchased: {formatDate(coupon.purchase_date)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CouponsSection>
          )}

          {coupons.length === 0 && (
            <p>No coupons purchased yet.</p>
          )}
        </div>

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