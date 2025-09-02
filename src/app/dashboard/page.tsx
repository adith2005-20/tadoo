import Dashboard from "../_components/Dashboard";
import { Suspense } from "react";
import Loader from "../_components/Loader";
import { getSession } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { toast } from "sonner";
import { api } from "@/trpc/server";

export default async function Page() {
    const data = await getSession();
    const isAuthenticated = data?.user.id;

    if (!isAuthenticated) {
        redirect('/auth/sign-in');
    }

    void api.task.getTasks.prefetch();

    return (
        <div className="bg-background">
            <Suspense fallback={<Loader/>}>
                <Dashboard/>
            </Suspense>
        </div>
    )
}