"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import signupActions from "@/lib/actions/signupActions";
import { User, Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/lib/context/auth";
import Link from "next/link";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const result = await signupActions({ firstName, lastName, email, password });

        if (result.success) {
            router.push("/signin");
        } else {
            setMessage(result.message);
        }

        setLoading(false);
    };

    return (
        <section className="min-h-dvh w-full grid place-content-center relative">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-start items-center p-4 w-[450px] min-h-[600px] bg-boston-blue-50/10 backdrop-blur-lg border-2 border-boston-blue-500 rounded-2xl z-10"
            >
                <Logo textSize="text-4xl" />
                <article className="w-full flex flex-col justify-between items-center h-full gap-4 mt-18">
                    <div className="flex flex-col w-full">
                        <Input
                            idInput="firstName"
                            icon={User}
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <Input
                            idInput="lastName"
                            icon={User}
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            containerClassName="mt-4"
                        />
                        <Input
                            idInput="email"
                            icon={Mail}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            containerClassName="mt-4"
                        />
                        <Input
                            idInput="password"
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            containerClassName="mt-4"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-boston-blue-700"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </article>
                {message && <p className="text-red-400 mt-3">{message}</p>}
                <div className="w-full flex items-center gap-2 px-4 my-4">
                    <hr className="h-px w-full bg-white" />
                    <span>OR</span>
                    <hr className="h-px w-full bg-white" />
                </div>
                <Link href="/signin">
                    <Button>Sign In</Button>
                </Link>
            </form>
        </section>
    );
}