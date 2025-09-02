import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { cache } from "react";
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId:env.GOOGLE_CLIENT_ID,
            clientSecret:env.GOOGLE_CLIENT_SECRET
        }
    }
});

export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});