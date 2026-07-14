import { signIn } from "@/auth";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-50">
            <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
                <h1 className="text-center text-2xl font-bold text-gray-800">Welcome to Formify</h1>
                <p className="mb-4 text-sm text-gray-400 mt-4">Sign in to continue</p>

                <form action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/dashboard" });
                }}>
                    <button className="mb-4 bg-gray-800 w-full border-l rounded-md py-2 text-center hover:bg-gray-500 transition-colors">
                        Continue with Google
                    </button>
                </form>

                <form action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/dashboard" });
                }}>
                    <button className="bg-gray-800 w-full border-l rounded-md py-2 text-center hover:bg-gray-500 transition-colors">
                        Continue with Github
                    </button>
                </form>
            </div>
        </div>
    );
}