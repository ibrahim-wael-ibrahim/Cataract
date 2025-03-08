"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import signInActions from "@/lib/actions/signInActions";
import { CircleUserRound, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {useAuth} from "@/lib/context/auth";
import Link from "next/link";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
    const { login , user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signInActions({ email, password });

    if (result.success) {

        const { access_token, role } = result.data;
        login({ email, role , token:access_token });
      router.push("/");
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };
    useEffect(() => {
        if(user){
            router.push("/");
        }
    },[user])
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
      idInput="email"
      icon={CircleUserRound}
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
  />
  <Input
      idInput="password"
      icon={Lock} // Remove or comment this line if you don't want an icon for password
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      containerClassName="mt-4" // Add margin or any additional styling
  />
</div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-boston-blue-700"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </article>
        {message && <p className="text-red-400 mt-3">{message}</p>}
<div className="w-full flex items-center gap-2 px-4 my-4">
    <hr className="h-px w-full bg-white"/>
<span>OR</span>
    <hr className="h-px w-full bg-white"/>
</div>
<Link href="/signup">
    <Button
    >
        signup
    </Button>
</Link>
      </form>
    </section>
  );
}
