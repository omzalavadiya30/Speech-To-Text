"use client";

import axios from "axios";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword= () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState({ email: "" });
    const [loading,setLoading] = useState(false);

    const validate= () => {
        const newError= { email: "", password: "" };
        let isValid= true;

        if(!email) {
            newError.email= "Email is required";
            isValid= false;
        }

        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email && !emailRegex.test(email)) {
            newError.email= "Invalid email format";
            isValid= false;
        }

        setError(newError);
        return isValid;
    }

    const submit =async (e:any) => {
        e.preventDefault();
        if(!validate()) return;
        try {
            setLoading(true);
            await axios.post("/api/auth/forgot-password",{ email });
            toast.success("Reset link sent to your email.");
        } catch (err:any) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-slate-950">
            <form onSubmit={submit} className="max-w-md w-full p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-cyan-500/20">
                <h1 className="text-4xl font-bold text-center text-white">Forgot Password</h1>
                <p className="text-slate-400 text-center mt-3">Enter your email to receive a reset link.</p>

                <div className="relative mt-8">
                    <Mail className="absolute left-4 top-4 text-slate-500"/>
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Email"
                    className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white"/>
                </div>
                {error.email && <p className="text-red-400 text-sm mt-2">{error.email}</p>}

                <button className="mt-6 w-full py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500">
                    {loading ? <Loader2 className="animate-spin mx-auto"/> : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;