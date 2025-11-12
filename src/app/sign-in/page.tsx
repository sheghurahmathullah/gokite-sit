import { redirect } from "next/navigation";

export default function SignInPage() {
  // Redirect to home page immediately
  redirect("/master-landing-page");
}
