"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ProfileCard = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const user = session?.user || { name: "Guest", email: "No email provided" };
    const userName = user.name || "U";
    const firstLetter = userName.charAt(0).toUpperCase();

    return (
        <div className="max-w-md mx-auto mt-12 fade-in">
            <h1 className="text-2xl font-bold mb-6 text-foreground text-center">Your Profile</h1>

            <div className="bg-card border border-border rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 relative">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={userName}
                            width={96}
                            height={96}
                            className="rounded-full object-cover border-4 border-secondary"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-full bg-secondary text-secondary-foreground text-3xl font-bold border-4 border-background shadow-inner">
                            {firstLetter}
                        </div>
                    )}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-card rounded-full"></div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-8">{user.email}</p>

                <div className="w-full space-y-3">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground p-3 rounded-lg transition-all font-medium"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>

                <p className="mt-8 text-xs text-muted-foreground">
                    Member since {new Date().getFullYear()} • SpendMate v1.0
                </p>
            </div>
        </div>
    );
};

export default ProfileCard;
