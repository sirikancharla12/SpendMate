import { authConfig } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(req) {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
        return { user: null, status: 401, message: "User not authenticated" };
    } else {
        return { user: session.user, status: 200 };
    }
}

export async function DELETE(req, context) {
    try {
        const { user, status, message } = await getAuthenticatedUser(req);

        if (!user) {
            return new NextResponse(JSON.stringify({ error: message }), { status })
        }
        const budgetid = context.params.id;
        const existingUser = await prisma.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!existingUser) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const exisitingBudget = await prisma.budget.findUnique({
            where: {
                id: budgetid
            }
        })

        if (!exisitingBudget) {
            return new NextResponse(JSON.stringify({ error: "Budget doesn't exist" }), { status: 400 });
        }

        if (exisitingBudget.userId !== existingUser.id) {
            return new NextResponse(JSON.stringify({ error: "Budget not authorized for this user" }), { status: 403 });
        }

        await prisma.budget.delete({
            where: {
                id: budgetid
            }
        })

        return new NextResponse(JSON.stringify({ message: "Budget deleted successfully" }), { status: 200 });

    }
    catch (error) {
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}


export async function PUT(req, context) {
    try {
        const { user, status, message } = await getAuthenticatedUser(req);

        if (!user) {
            return new NextResponse(JSON.stringify({ error: message }), { status })
        }

        const budgetid = context.params.id;

        const existingUser = await prisma.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!existingUser) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const exisitingBudget = await prisma.budget.findFirst({
            where: {
                id: budgetid
            }
        })

        if (!exisitingBudget || exisitingBudget.userId !== existingUser.id) {
            return new NextResponse(JSON.stringify({ error: "Expense not found or unauthorized" }), { status: 403 });
        }

        let body;
        try {
            body = await req.json();
        }
        catch (err) {
            return new NextResponse(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
        }

        const { category, spendinglimit, frequency } = body;

        if (!category || !spendinglimit || !frequency) {
            return new NextResponse(JSON.stringify({ error: "Missing required fields in payload" }), { status: 400 })
        }

        const updatebudget = await prisma.budget.update({
            where: { id: budgetid },
            data: {
                category, spendinglimit, frequency
            }
        })

        return new NextResponse(JSON.stringify(updatebudget), { status: 200 })
    }
    catch (error) {
        return new NextResponse(JSON.stringify({ error: "Error updating budget, Cannot reach server" }), { status: 500 })
    }
}
