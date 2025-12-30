import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

async function getAuthenticatedUser(req) {
    const session = await getServerSession({ req, ...authConfig });
    console.log('Session:', session);
    if (!session || !session.user || !session.user.id) {
        return { user: null, status: 401, message: "User not authenticated" };
    }
    return { user: session.user, status: 200 };
}

export async function DELETE(req, context) {
    try {
        const { user, status, message } = await getAuthenticatedUser(req);
        console.log("here");
        if (!user) {
            return new NextResponse(JSON.stringify({ error: message }), { status });
        }

        const { id } = context.params;
        console.log('Transaction ID:', id);

        // Ensure id is a string before validating/parsing
        const idString = String(id);

        if (!idString || isNaN(Number(idString))) {
            return new NextResponse(JSON.stringify({ error: "Transaction ID is required and must be a valid number" }), { status: 400 });
        }

        const parsedId = parseInt(idString, 10);

        const lookupCriteria = user.googleId ? { googleId: user.googleId } : { email: user.email };
        console.log('Lookup Criteria:', lookupCriteria);

        const existingUser = await prisma.user.findFirst({ where: lookupCriteria });
        console.log('Existing User:', existingUser);

        if (!existingUser) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const existingTransaction = await prisma.expense.findUnique({
            where: { id: parsedId },
        });

        console.log('Existing Transaction:', existingTransaction);

        if (!existingTransaction) {
            return new NextResponse(JSON.stringify({ error: "Transaction not found" }), { status: 404 });
        }

        if (existingTransaction.userId !== existingUser.id) {
            return new NextResponse(JSON.stringify({ error: "Transaction not authorized for this user" }), { status: 403 });
        }

        await prisma.expense.delete({
            where: { id: parsedId },
        });

        return new NextResponse(JSON.stringify({ message: "Transaction deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { user, status, message } = await getAuthenticatedUser(req);
        if (!user) {
            return new NextResponse(JSON.stringify({ error: message }), { status });
        }

        const expenseId = parseInt(params.id, 10);
        if (Number.isNaN(expenseId)) {
            return new NextResponse(JSON.stringify({ error: "Invalid expense ID" }), { status: 400 });
        }

        const lookupCriteria = user.googleId ? { googleId: user.googleId } : { email: user.email };
        const existingUser = await prisma.user.findUnique({ where: lookupCriteria });

        if (!existingUser) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const existingExpense = await prisma.expense.findUnique({ where: { id: expenseId } });

        if (!existingExpense || existingExpense.userId !== existingUser.id) {
            return new NextResponse(JSON.stringify({ error: "Expense not found or unauthorized" }), { status: 403 });
        }

        let body;
        try {
            body = await req.json();
        } catch (err) {
            return new NextResponse(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
        }

        const { description, amount, category, type, date, userId } = body;
        if (!description || amount === undefined || amount === null || !category || !type || !date || !userId) {
            console.log(type);
            return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        if (!type) {
            return new NextResponse(JSON.stringify({ error: "transactionType is required" }), { status: 400 });
        }

        if (typeof amount !== "number" || isNaN(amount)) {
            return new NextResponse(JSON.stringify({ error: "Invalid amount" }), { status: 400 });
        }

        if (!["Income", "Expense"].includes(type)) {
            return new NextResponse(JSON.stringify({ error: "Invalid transaction type" }), { status: 400 });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return new NextResponse(JSON.stringify({ error: "Invalid date format" }), { status: 400 });
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                description,
                amount,
                category,
                type,
                date: parsedDate,
            },
        });

        return new NextResponse(JSON.stringify(updatedExpense), { status: 200 });

    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500 }
        );
    }
}
