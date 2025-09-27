import { redirect } from "react-router";
import { deleteMember } from "../data";
import type { Route } from "./+types/_layout.members.$memberId.destroy";

export async function action({ params }: Route.LoaderArgs) {
  await deleteMember(params.memberId);
  return redirect("/");
}
