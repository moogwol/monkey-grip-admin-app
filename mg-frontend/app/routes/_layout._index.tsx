import { getMemberStats } from "../data";
import type { Route } from "../+types/root";

export async function loader() {
  const stats = await getMemberStats();
  return { stats };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData || { stats: null };

  return (
    <div id="index-page">
      <h1>BJJ Club Management System</h1>
      <p>
        Welcome to the BJJ Club Management System. Select a member from the sidebar to view their details, 
        or click "New Member" to add a new member to the club.
      </p>

      {stats && (
        <div className="club-stats">
          <h2>Club Statistics</h2>
          
          <div className="stats-summary">
            <div className="stat-item">
              <strong>Total Members:</strong> {stats.total_members}
            </div>

            <div className="stat-item">
              <strong>Belt Distribution:</strong>
              <ul>
                {(stats.belt_distribution || []).map((item) => (
                  <li key={item.belt_rank}>
                    {item.belt_rank.charAt(0).toUpperCase() + item.belt_rank.slice(1)}: {item.count}
                  </li>
                ))}
              </ul>
            </div>

            <div className="stat-item">
              <strong>Payment Status:</strong>
              <ul>
                {(stats.payment_status_summary || []).map((item) => (
                  <li key={item.payment_status}>
                    {item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1)}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <ul>
          <li><a href="#" onClick={() => alert('Feature coming soon!')}>View All Members</a></li>
          <li><a href="#" onClick={() => alert('Feature coming soon!')}>Manage Class Coupons</a></li>
          <li><a href="#" onClick={() => alert('Feature coming soon!')}>Generate Reports</a></li>
        </ul>
      </div>
    </div>
  );
}
