import {
    Form,
    Link,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useNavigation,
    useNavigate,
    redirect,
    useSubmit,
    useLocation,
} from "react-router";
import { useEffect, useMemo } from "react";
import type { Route } from "../+types/root";

import appStylesHref from "../app.css?url";

import { getMembers, createEmptyMember, getPaymentPlans } from "../data"
import type { MembershipPlanRecord } from "../api";
import { requireAuth } from "../auth";
import {
    StyledNavLink,
    Sidebar,
    SidebarTitle,
    SidebarControls,
    SearchSpinner,
    StyledNav,
    BeltGraphic,
    PaymentStatusIcon,
    LogoutButton,
    LogoutButtonContainer,
} from "../components";




export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get("cookie") || "";

    // Check if user is authenticated
    await requireAuth(cookie);

    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const members = await getMembers(q, cookie);
    // Get the list of payment plans
    const paymentPlans = await getPaymentPlans(false);

    return { members, q, paymentPlans };
}


type Member = {
    id: string;
    first_name: string;
    last_name: string;
    belt_rank: string;
    payment_status: string;
    latest_membership_plan_id?: number | null;
    stripes: number;
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
    const { members, q, paymentPlans }: { members: Member[]; q: string | null; paymentPlans: MembershipPlanRecord[] } = loaderData ?? { members: [], q: null, paymentPlans: [] };

    const navigation = useNavigation();
    const location = useLocation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    const couponPlanById = useMemo(
        () =>
            new Map(
                paymentPlans.map((plan) => [Number(plan.id), Boolean(plan.is_coupon_plan)])
            ),
        [paymentPlans]
    );

    useEffect(() => {
        const searchfield = document.getElementById("q");
        if (searchfield instanceof HTMLInputElement) {
            searchfield.value = q || "";
        }
    }, [q]);


    return (
        <>
            <Sidebar>
                <SidebarTitle>
                    <Link to="/">Monkey Grip Admin</Link>
                </SidebarTitle>
                <SidebarControls>
                    <Form
                        id="search-form"
                        role="search"
                        onChange={(event) =>
                            submit(event.currentTarget)
                        }
                    >
                        <input
                            aria-label="Search members"
                            className={searching ? "loading" : ""}
                            defaultValue={q || ""}
                            id="q"
                            name="q"
                            placeholder="Search members"
                            type="search"
                        />
                        <SearchSpinner
                            aria-hidden
                            hidden={!searching}
                        />
                    </Form>
                    <Link to="/members/new" >
                        <button type="submit">New</button>
                    </Link>
                </SidebarControls>             
                <LogoutButtonContainer as="Form" method="post" action="/logout">
                    <LogoutButton type="submit">Logout</LogoutButton>
                </LogoutButtonContainer>
                <StyledNav>
                    {members.length ? (
                        <ul>
                            {members.map((member) => {
                                const isActive = location.pathname === `/members/${member.id}`;
                                const isPending = navigation.state === "loading";
                                const isCouponPlan =
                                    member.latest_membership_plan_id != null &&
                                    couponPlanById.get(Number(member.latest_membership_plan_id)) === true;

                                return (
                                    <li key={member.id}>
                                        <StyledNavLink
                                            $isActive={isActive}
                                            $isPending={isPending}
                                            to={`members/${member.id}`}>
                                            {member.first_name || member.last_name ? (
                                                <>
                                                    {member.first_name} {member.last_name}
                                                    <PaymentStatusIcon
                                                        $status={member.payment_status}
                                                        isCouponPlan={isCouponPlan}
                                                    />
                                                    <BeltGraphic
                                                        beltColor={member.belt_rank}
                                                        stripes={member.stripes}
                                                        size="small"
                                                    />
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}
                                        </StyledNavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>
                            <i>No members</i>
                        </p>
                    )}
                </StyledNav>
            </Sidebar>
            <div
                className={
                    navigation.state === "loading" ? "loading" : ""
                }
                id="detail">
                <Outlet />
            </div>
        </>
    );
}

// The Layout component is a special export for the root route.
// It acts as your document's "app shell" for all route components, HydrateFallback, and ErrorBoundary
// For more information, see https://reactrouter.com/explanation/special-files#layout-export
export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href={appStylesHref} />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

// The top most error boundary for the app, rendered when your app throws an error
// For more information, see https://reactrouter.com/start/framework/route-module#errorboundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const navigate = useNavigate();

    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? error.data || error.statusText || "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main id="error-page">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre>
                    <code>{stack}</code>
                </pre>
            )}
            {isRouteErrorResponse(error) && error.status === 404 && (
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer'
                        }}
                    >
                        ← Go Back
                    </button>
                </div>
            )}
        </main>
    );
}

