import {
    Form,
    Link,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useNavigation,
    useNavigate,
    redirect,
    useSubmit,
} from "react-router";
import { useEffect } from "react";
import type { Route } from "../+types/root";

import appStylesHref from "../app.css?url";

import { getContacts, createEmptyContact } from "../data"

// Loader function to fetch contacts data
export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

// Action function to handle form submissions (create contact)
export async function action({ request }: Route.ActionArgs) {
    const contact = await createEmptyContact();
    return redirect(`/contacts/${contact.id}/edit`);
}




type Contact = {
    id: string;
    first: string;
    last: string;
    favorite: boolean;
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
    const { contacts, q }: { contacts: Contact[]; q: string | null } = loaderData ?? { contacts: [], q: null };

    const navigation = useNavigation();
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
            <div id="sidebar">
                <h1>
                    <Link to="/about">React Router</Link>
                </h1>
                <div>
                    <Form
                        id="search-form"
                        role="search"
                        onChange={(event) =>
                            submit(event.currentTarget)
                        }
                    >
                        <input
                            aria-label="Search contacts"
                            className={searching ? "loading" : ""}
                            defaultValue={q || ""}
                            id="q"
                            name="q"
                            placeholder="Search"
                            type="search"
                        />
                        <div
                            aria-hidden
                            hidden={!searching}
                            id="search-spinner"
                        />
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }

                                        to={`contacts/${contact.id}`}>
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}
                                        {contact.favorite ? (
                                            <span>★</span>
                                        ) : null}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
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
                ? "The requested page could not be found."
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

