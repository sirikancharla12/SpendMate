export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authConfig } from "../../../../lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession({ req, ...authConfig });

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range");

    const now = new Date();
    let startDate;

    if (range === "THIS_MONTH") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "LAST_6_MONTHS") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else if (range === "THIS_YEAR") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid range" }),
        { status: 400 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: { date: "asc" },
    });

    const csv = [
      ["Date", "Category", "Type", "Amount"].join(","),
      ...expenses.map(e =>
        [
          e.date.toISOString().split("T")[0],
          e.category,
          e.type,
          e.amount,
        ].join(",")
      ),
    ].join("\n");

    const filename = `spendmate-${range.toLowerCase()}.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to export report" }),
      { status: 500 }
    );
  }
}
