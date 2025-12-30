import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getActiveRun } from "@/app/actions/game";
import RunDashboard from "@/app/components/RunDashboard";

export default async function RunPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  const run = await getActiveRun();

  return <RunDashboard run={run} />;
}

