export const runtime = "nodejs";

import { authConfig } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function getAuthenticatedUser() {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
        return { user: null, status: 401, message: "User not authenticated" };
    }

    return { user: session.user, status: 200 };
}

export async function POST(req) {
    try {
        const { user, status, message } = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: message }, { status });
        }

        const body = await req.json();
        const { category, spendinglimit, frequency } = body;

        if (!category || !spendinglimit || !frequency) {
            return NextResponse.json(
                { error: "Missing required fields in payload" },
                { status: 400 }
            );
        }

        const spendingLimit = Number(spendinglimit);
        if (isNaN(spendingLimit) || spendingLimit <= 0) {
            return NextResponse.json(
                { error: "Invalid spending limit" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const normalizedCategory = category.trim().toLowerCase();

        const createdBudget = await prisma.budget.create({
            data: {
                category: normalizedCategory,
                spendinglimit: spendingLimit,
                frequency,
                userId: existingUser.id,
            },
        });

        return NextResponse.json(createdBudget, { status: 201 });
    } catch (err) {
        console.error("Error saving the data:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { user, status, message } = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: message }, { status });
        }

        // 1️⃣ Fetch budgets
        const budgets = await prisma.budget.findMany({
            where: { userId: user.id }
        });

        // 2️⃣ Monthly range (based on your frequency = Monthly)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // 3️⃣ Attach spent amount to each budget
        const budgetsWithSpent = await Promise.all(
            budgets.map(async (budget) => {
                const spentAgg = await prisma.expense.aggregate({
                    _sum: { amount: true },
                    where: {
                        userId: user.id,
                        category: budget.category,
                        type: "Expense",
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                });

                return {
                    ...budget,
                    spent: spentAgg._sum.amount || 0,
                };
            })
        );

        return NextResponse.json(budgetsWithSpent, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Couldn't find budgets" },
            { status: 500 }
        );
    }
}
