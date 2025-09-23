import { redirect } from "react-router";
import type { Route } from "./+types/contacts.$contactId.destroy"

import { deleteContact } from "../data";

export async function action({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);
  return redirect("/");
}
