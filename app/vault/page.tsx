import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getVault } from "@/app/actions/vault";
import VaultView from "@/app/components/VaultView";

export default async function VaultPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  const vault = await getVault();

  return <VaultView vault={vault} />;
}

