import { Form, useFetcher, useNavigate, redirect } from "react-router"
import type { Route } from "../+types/root";
import { getMember, deleteMember, getMemberCoupons } from "../data";

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
  const { member, coupons } = loaderData;
  const navigate = useNavigate();

  const beltColors = {
    white: '#ffffff',
    blue: '#0066cc',
    purple: '#800080',
    brown: '#8b4513',
    black: '#000000'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getActiveCoupons = () => {
    return coupons.filter(coupon => coupon.classes_used < coupon.classes_total);
  };

  const getUsedCoupons = () => {
    return coupons.filter(coupon => coupon.classes_used >= coupon.classes_total);
  };

  return (
    <div id="member">
      <div>
        <img
          alt={`${member.first_name} ${member.last_name} avatar`}
          key={member.id}
          src={`https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`}
        />
      </div>

      <div>
        <h1>
          {member.first_name && member.last_name ? (
            <>
              {member.first_name} {member.last_name}
            </>
          ) : (
            <>No Name</>
          )}
        </h1>

        <div className="member-details">
          <div className="belt-info">
            <span 
              className="belt-rank"
              style={{ 
                backgroundColor: beltColors[member.belt_rank], 
                color: member.belt_rank === 'white' ? '#000' : '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              {member.belt_rank.charAt(0).toUpperCase() + member.belt_rank.slice(1)} Belt
            </span>
            {member.stripes > 0 && (
              <span className="stripes">
                {Array.from({ length: member.stripes }, (_, i) => (
                  <span key={i} className="stripe">█</span>
                ))}
              </span>
            )}
          </div>

          <div className="payment-status">
            <span 
              className={`status ${member.payment_status}`}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 'bold',
                backgroundColor: 
                  member.payment_status === 'current' ? '#28a745' :
                  member.payment_status === 'overdue' ? '#ffc107' : '#dc3545',
                color: member.payment_status === 'overdue' ? '#000' : '#fff'
              }}
            >
              {member.payment_status.charAt(0).toUpperCase() + member.payment_status.slice(1)}
            </span>
          </div>
        </div>

        {member.email && (
          <p>
            <a href={`mailto:${member.email}`}>
              {member.email}
            </a>
          </p>
        )}

        {member.phone && (
          <p>
            <a href={`tel:${member.phone}`}>
              {member.phone}
            </a>
          </p>
        )}

        <p>
          <strong>Join Date:</strong> {formatDate(member.join_date)}
        </p>

        {member.notes && (
          <div>
            <h3>Notes</h3>
            <p>{member.notes}</p>
          </div>
        )}

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
            <div className="used-coupons">
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
            </div>
          )}

          {coupons.length === 0 && (
            <p>No coupons purchased yet.</p>
          )}
        </div>

        <div className="member-actions">
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
        </div>
      </div>
    </div>
  );
}