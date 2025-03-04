import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "lib/auth";
import { error } from "console";

interface CustomSession {
  user: {
    id: string;
    googleId?:string,
    email: string;
    name: string | null;
    image: string | null;
    provider?: string; 
  };
}

async function getAuthenticatedUser(req: NextRequest) {
  const session = await getServerSession({ req, ...authConfig }) as CustomSession;
  console.log('Session:', session);  
  if (!session || !session.user || !session.user.id) {
    return { user: null, status: 401, message: "User not authenticated" };
  }
  return { user: session.user, status: 200 };
}

async function duplicateSalaryExpense(existingUserId:string){
  const today=new Date()
  const is1stdayofmonth=today.getDate()===1;
  if(is1stdayofmonth){
    const salaryamount=await prisma.expense.findFirst({
      where:{
        userId:existingUserId,
        category:"Salary",

      },
      orderBy:  {
        date:"desc"
      }
    })


    if(salaryamount){
      await prisma.expense.create({
data: {
  amount: salaryamount.amount,
  category: salaryamount.category,
  description: salaryamount.description,
  type: "Salary",
  date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  userId: existingUserId,
  recurringStartDate: new Date()
}
      })
      console.log('Salary expense duplicated for the next month.');
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, status, message } = await getAuthenticatedUser(req);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: message }), { status });
    }

    console.log('Authenticated User:', user); 
    console.log('Google ID from User:', user.googleId);

    let existingUser = await prisma.user.findFirst({
      where: user.provider === "google" 
        ? { googleId: user.googleId }
        : { email: user.email },
    });

    console.log('Existing User:', existingUser);

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          googleId: user.googleId,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: 'google',
        },
      });
      existingUser = newUser;
    }

    if (!existingUser || !existingUser.id) {
      return new NextResponse(JSON.stringify({ error: "User creation failed" }), { status: 500 });
    }
    await duplicateSalaryExpense(existingUser.id);

    const body = await req.json();
    const { description, amount, category, type, date } = body;

    if (!description || !amount || !category || !type || !date) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields in payload" }), { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return new NextResponse(JSON.stringify({ error: "Invalid date format" }), { status: 400 });
    }

    console.log("Creating new expense for user:", existingUser.id);

    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        type,
        date: parsedDate,
        userId: existingUser.id,
        recurringStartDate: new Date(), // Add this line
      },
    });

    return new NextResponse(JSON.stringify(newExpense), { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const { user, status, message } = await getAuthenticatedUser(req);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: message }), { status });
    }

    console.log("Authenticated User:", user);

    const lookupCriteria = user.googleId
      ? { googleId: user.googleId } 
      : { email: user.email }; 

    console.log("Lookup Criteria:", lookupCriteria);

    const existingUser = await prisma.user.findFirst({ where: lookupCriteria });

    if (!existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    console.log("Existing User:", existingUser);

    const expenses = await prisma.expense.findMany({
      where: { userId: existingUser.id },
      orderBy: { date: "desc" }, 
    });

    return new NextResponse(JSON.stringify(expenses), { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  } 
}


