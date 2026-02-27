import { getMemberStats } from "../data";
import type { Route } from "../+types/root";
import {
  IndexPageContainer,
  IndexPageHeader,
  IndexPageTitle,
  IndexPageLogo,
  IndexPageSubtitle,
  StatsSection,
  StatsSectionTitle,
  StatsGrid,
  StatCard,
  StatTitle,
  StatValue,
  StatList,
  StatListItem,
  StatLabel,
  StatCount,
  QuickActionsSection,
  QuickActionsTitle,
  QuickActionsList,
  QuickActionItem,
  QuickActionButton,
} from "../components";


export async function loader() {
  const stats = await getMemberStats();
  return { stats };
}




export default function Home({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData || { stats: null };
  const currentMonthTotalPaid = Number((stats as any)?.current_month_total_paid || 0);

  

  return (
    <IndexPageContainer>
      <IndexPageHeader>
        <IndexPageTitle>
          <IndexPageLogo src="/mg_logo_vectorised.svg" alt="MG Logo" />
          Monkey Grip Admin
        </IndexPageTitle>
        <IndexPageSubtitle>
          Welcome to the BJJ Club Management System. Select a member from the sidebar to view their details,
          or click "New Member" to add a new member to the club.
        </IndexPageSubtitle>
      </IndexPageHeader>

      {stats && (
        <StatsSection>
          <StatsSectionTitle>Club Statistics</StatsSectionTitle>
          <StatsGrid>
            <StatCard>
              <StatTitle>Total Members</StatTitle>
              <StatValue>{(stats as any).total_members}</StatValue>
            </StatCard>

            <StatCard>
              <StatTitle>Paid This Month</StatTitle>
              <StatValue>EUR {currentMonthTotalPaid.toFixed(2)}</StatValue>
            </StatCard>

            <StatCard>
              <StatTitle>Belt Distribution</StatTitle>
              <StatList>
                {((stats as any).belt_distribution || []).map((item: any) => (
                  <StatListItem key={item.belt_rank}>
                    <StatLabel>
                      {item.belt_rank.charAt(0).toUpperCase() + item.belt_rank.slice(1)}
                    </StatLabel>
                    <StatCount>{item.count}</StatCount>
                  </StatListItem>
                ))}
              </StatList>
            </StatCard>

            <StatCard>
              <StatTitle>Payment Status</StatTitle>
              <StatList>
                {((stats as any).payment_status_summary || []).map((item: any) => (
                  <StatListItem key={item.payment_status}>
                    <StatLabel>
                      {item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1)}
                    </StatLabel>
                    <StatCount>{item.count}</StatCount>
                  </StatListItem>
                ))}
              </StatList>
            </StatCard>
          </StatsGrid>
        </StatsSection>
      )}

      <QuickActionsSection>
        <QuickActionsTitle>Quick Actions</QuickActionsTitle>
        <QuickActionsList>
          <QuickActionItem>
            <QuickActionButton onClick={() => alert('Feature coming soon!')}>
              View All Members
            </QuickActionButton>
          </QuickActionItem>
          <QuickActionItem>
            <QuickActionButton onClick={() => alert('Feature coming soon!')}>
              Manage Class Coupons
            </QuickActionButton>
          </QuickActionItem>
          <QuickActionItem>
            <QuickActionButton onClick={() => alert('Feature coming soon!')}>
              Generate Reports
            </QuickActionButton>
          </QuickActionItem>
        </QuickActionsList>
      </QuickActionsSection>
    </IndexPageContainer>
  );
}
