import { error } from "console";
import { authConfig } from "lib/auth";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface CustomerSession {
  user: {
    id: string;
    googleId?: string;
    email: string;
    name: string | null;
    image: string | null;
    provider?: string;
  };
}

async function getAuthenticatedUser(req: NextRequest) {
  const session = await getServerSession({ req, ...authConfig }) as CustomerSession | null;
  if (!session || !session.user || !session.user.id) {
    return { user: null, status: 401, message: "User not Authenticated" };
  } else {
    return { user: session.user, status: 200 };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { user, status, message } = await getAuthenticatedUser(req);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: message }), { status });
    }

    if (!req.body) {
      return new NextResponse(JSON.stringify({ error: "Request body is null" }), { status: 400 });
    }

    // Get the request body data
    const body = await req.json();
    const { description, amount, targetDate, amountSaved, percentageSaved } = body;

    // Validate required fields
    if (!description || !amount || !targetDate || percentageSaved === undefined || amountSaved === undefined) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields in payload" }), { status: 400 });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return new NextResponse(JSON.stringify({ error: "Invalid amount" }), { status: 400 });
    }

    // Validate target date
    const parsedDate = new Date(targetDate);
    if (isNaN(parsedDate.getTime())) {
      return new NextResponse(JSON.stringify({ error: "Invalid target date" }), { status: 400 });
    }

    // Fetch user from the database based on email or Google ID
    let existingUser = await prisma.user.findFirst({
      where: user.provider === "google"
        ? { googleId: user.googleId }
        : { email: user.email },
    });

    if (!existingUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Calculate amount saved based on the percentage saved
    const calculatedAmountSaved = (amount * percentageSaved) / 100;

    // Insert the new saving record into the database
    const newSaving = await prisma.savings.create({
      data: {
        description,
        amount,
        targetDate: parsedDate,
        amountSaved: calculatedAmountSaved,
        percentageSaved,
        userId: existingUser.id,
      },
    });

    return new NextResponse(JSON.stringify({ ...newSaving, id: newSaving.id }), { status: 200 });

  } catch (error) {
    console.error("Error saving the data:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { user, status, message } = await getAuthenticatedUser(req);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: message }), { status });
    }

    const lookupCriteria = user.googleId
      ? { googleId: user.googleId }
      : { email: user.email };

    const existingUser = await prisma.user.findFirst({ where: lookupCriteria });

    if (!existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    const getsavings = await prisma.savings.findMany({
      where: { userId: existingUser.id },
      orderBy: { targetDate: "desc" },
    });

    return new NextResponse(JSON.stringify(getsavings), { status: 200 });

  } catch (error) {
    console.error("Error fetching savings:", error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}
