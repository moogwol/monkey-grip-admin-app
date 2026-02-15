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
import { useEffect } from "react";
import type { Route } from "../+types/root";

import appStylesHref from "../app.css?url";

import { getMembers, createEmptyMember } from "../data"
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
} from "../components";


// Loader function to fetch members data and check authentication
export async function loader({ request }: Route.LoaderArgs) {
    // Check if user is authenticated
    await requireAuth();

    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const members = await getMembers(q);
    return { members, q };
}

type Member = {
    id: string;
    first_name: string;
    last_name: string;
    belt_rank: string;
    payment_status: string;
    stripes: number;
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
    const { members, q }: { members: Member[]; q: string | null } = loaderData ?? { members: [], q: null };

    const navigation = useNavigation();
    const location = useLocation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

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
                <Form method="post" action="/logout" style={{ padding: '1rem 0' }}>
                    <button 
                        type="submit" 
                        style={{
                            width: '100%',
                            padding: '0.5rem 1rem',
                            background: '#f0f0f0',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#666'
                        }}
                    >
                        🚪 Logout
                    </button>
                </Form>
                <StyledNav>
                    {members.length ? (
                        <ul>
                            {members.map((member) => {
                                const isActive = location.pathname === `/members/${member.id}`;
                                const isPending = navigation.state === "loading";

                                return (
                                    <li key={member.id}>
                                        <StyledNavLink
                                            $isActive={isActive}
                                            $isPending={isPending}
                                            to={`members/${member.id}`}>
                                            {member.first_name || member.last_name ? (
                                                <>
                                                    {member.first_name} {member.last_name}
                                                    <PaymentStatusIcon $status={member.payment_status} />
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

