"use client";
import axios from "axios";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";

const Login= () => {

    const router= useRouter();

    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [error, setError]= useState({
        email: "",
        password: ""
    });
    const [loading, setLoading]= useState(false);
    const [show, setShow]= useState(false);

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

        if(!password) {
            newError.password= "Password is required";
            isValid= false;
        }

        if(password && password.length < 6) {
            newError.password= "Password must be at least 6 characters";
            isValid= false;
        }

        setError(newError);
        return isValid;
    }

    const submit= async(e:any)=> {
        e.preventDefault();
        if(!validate()) return;
        
        try {
            setLoading(true);
            const res= await axios.post("/api/auth/login", {email, password}, {withCredentials: true });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success("Login successful");
            router.push("/dashboard");
        }
        catch(err:any) {
            toast.error( err.response?.data?.message ||"Login failed");
        }
        finally {
            setLoading(false);
        }
    };



    return(
        <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 px-4">
            <form onSubmit={submit} className=" bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-10 w-full max-w-md shadow-2xl">
                <h1 className="text-5xl font-bold text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Welcome Back</h1>
                <p className="text-center text-slate-400 mt-3 mb-8">Login to continue</p>

                <div className="mb-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-500" />
                        <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />
                    </div>
                    {error.email && <p className="text-red-400 text-sm mt-2">{error.email}</p>}
                </div>

                <div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-500" />
                        <input type={show ? "text" : "password"} placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />
                        <button type="button" onClick={()=>setShow(!show)} className="absolute top-4 right-4 text-slate-400">
                            {show ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {error.password && <p className="text-red-400 text-sm mt-2">{error.password}</p>}
                </div>
                
                <button disabled={loading} className="w-full mt-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 flex justify-center items-center gap-3 font-semibold">
                    {
                        loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Logging in...
                            </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Login
                                </>
                            )
                    }
                </button>

                <p className="text-center mt-6 text-slate-400"> Don't have an account?
                    <Link href="/register" className=" text-cyan-400 ml-2">Register</Link>
                </p>
            </form>
        </div>
    )

}
export default Login;