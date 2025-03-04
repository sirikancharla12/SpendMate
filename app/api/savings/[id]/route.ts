import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "lib/auth";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";

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

// PUT (Update)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Incoming PUT request:", { id: params.id });

    const { user, status, message } = await getAuthenticatedUser(req);
    if (!user) {
      console.log("User not authenticated:", { message });
      return new NextResponse(JSON.stringify({ error: message }), { status });
    }

    const savingsId = parseInt(params.id);
    if (isNaN(savingsId)) {
      console.log("Invalid savings ID:", params.id);
      return new NextResponse(JSON.stringify({ error: "Invalid savings id" }), { status });
    }

    const lookupCriteria = user.googleId ? { googleId: user.googleId } : { email: user.email };
    console.log("Looking up user with criteria:", lookupCriteria);
    const existingUser = await prisma.user.findFirst({ where: lookupCriteria });
    if (!existingUser) {
      console.log("User not found with criteria:", lookupCriteria);
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    console.log("User found:", existingUser);

    const findExpense = await prisma.savings.findUnique({ where: { id: savingsId } });
    if (!findExpense) {
      console.log("Savings not found:", savingsId);
      return new NextResponse(JSON.stringify({ error: "Savings not found" }), { status: 404 });
    }

    if (findExpense.userId !== existingUser.id) {
      console.log("Savings do not belong to user:", findExpense.userId, existingUser.id);
      return new NextResponse(JSON.stringify({ error: "Savings not found" }), { status: 404 });
    }

    const body = await req.json();
    const { description, amount, targetDate, amountSaved = 0, percentageSaved } = body;

    // Debugging log for incoming data
    console.log("Received data:", { description, amount, targetDate, percentageSaved, amountSaved });

    // Validate input data
    if (!description || !amount || !targetDate || !percentageSaved) {
      console.log("Missing details in the payload:", body);
      return new NextResponse(JSON.stringify({ error: "Missing details in the payload" }), { status: 400 });
    }

    if (isNaN(amount) || amount <= 0) {
      console.log("Invalid amount:", amount);
      return new NextResponse(JSON.stringify({ error: "Invalid amount" }), { status: 400 });
    }

    const parsedDate = new Date(targetDate);
    console.log("Parsed date:", parsedDate);
    if (isNaN(parsedDate.getTime())) {
      console.log("Invalid date format:", targetDate);
      return new NextResponse(JSON.stringify({ error: "Invalid date format" }), { status: 400 });
    }

    let calculatedAmountSaved = amountSaved || 0;
    const savingsPercentage = body.savingsPercentage || 0;
    if (savingsPercentage && savingsPercentage > 0) {
      calculatedAmountSaved = (amount * savingsPercentage) / 100;
    }

    console.log("Updated saving data:", { description, amount, amountSaved: calculatedAmountSaved, targetDate: parsedDate, percentageSaved });

    const updatedSavings = await prisma.savings.update({
      where: { id: savingsId },
      data: {
        description,
        amount,
        amountSaved: calculatedAmountSaved,
        percentageSaved,
        targetDate: parsedDate,
        userId: existingUser.id,
      },
    });

    console.log("Updated savings:", updatedSavings);
    return new NextResponse(JSON.stringify(updatedSavings), { status: 200 });
  } catch (error) {
    console.error("Error updating savings:", error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}

// DELETE (Delete)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Incoming DELETE request:", { id: params.id });

    const { user, status, message } = await getAuthenticatedUser(req);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: message }), { status });
    }

    const savingsId = parseInt(params.id);
    if (isNaN(savingsId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid savings id" }), { status });
    }

    const lookupCriteria = user.googleId ? { googleId: user.googleId } : { email: user.email };
    const existingUser = await prisma.user.findFirst({ where: lookupCriteria });
    if (!existingUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const findExpense = await prisma.savings.findUnique({ where: { id: savingsId } });
    if (!findExpense || findExpense.userId !== existingUser.id) {
      return new NextResponse(JSON.stringify({ error: "Savings not found" }), { status: 404 });
    }

    // Perform delete operation
    await prisma.savings.delete({ where: { id: savingsId } });

    return new NextResponse(JSON.stringify({ message: "Savings deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting savings:", error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}
