import { getServerSession } from "next-auth";
import { authConfig } from "./auth";
import { redirect } from "next/navigation";

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) redirect("/");
}
