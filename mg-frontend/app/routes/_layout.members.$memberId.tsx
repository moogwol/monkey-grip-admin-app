import { Form, useFetcher, useNavigate, redirect } from "react-router";
import type { Route } from "../+types/root";
import { getMember, deleteMember, getMemberCoupons } from "../data";
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

  // Load member's coupons as well
  const coupons = await getMemberCoupons(memberId);

  return { member, coupons };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const memberId = params.memberId;
  if (!memberId) {
    throw new Response("Member ID is required", { status: 400 });
  }

  if (intent === "delete") {
    await deleteMember(memberId);
    return redirect("/");
  }

  return null;
}

export default function Member({ loaderData }: Route.ComponentProps) {
  console.log("Loader data:", loaderData);

  if (!loaderData) {
    throw new Response("Member not found", { status: 404 });
  }

  const data = loaderData as any;
  const { member, coupons = [] } = data;
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

  return (
    <MemberProfile>
      <MemberBanner>
        <PaymentStatusBadge $status={member.payment_status}>
          {member.payment_status.charAt(0).toUpperCase() + member.payment_status.slice(1)}
        </PaymentStatusBadge>
        
        <MemberAvatar>
          <img
            alt={`${member.first_name} ${member.last_name} avatar`}
            key={member.id}
            src={
              member.avatar_url || 
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
          {/* <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
            {member.belt_rank.charAt(0).toUpperCase() + member.belt_rank.slice(1)} Belt
          </span> */}

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
          <Form action={`/members/${member.id}/edit`} method="get">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action={`/members/${member.id}/destroy`}
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