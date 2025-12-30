import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getJournal } from "@/app/actions/journal";
import JournalView from "@/app/components/JournalView";

export default async function JournalPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  const slots = await getJournal();

  return <JournalView slots={slots} />;
}

