import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard/apps");
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <SignUp
          routing="hash"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard/apps"
        />
      </Suspense>
    </div>
  );
}
