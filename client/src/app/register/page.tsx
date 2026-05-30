"use client";

import axios from "axios";
import { Eye, EyeOff, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Register=()=>{
    const router = useRouter();
    const [form,setForm]=useState({
        name:"",
        email:"",
        password:""
    });

    const [showPassword,setShowPassword]=useState(false);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState({
        name:"",
        email:"",
        password:""
    });

    const handleChange=(e:any)=>{
        setForm({...form, [e.target.name]: e.target.value})
    };

    const validate=()=>{
        const newError= { name: "", email: "", password: "" };
        let isValid= true;

        if(!form.name) {
            newError.name= "Name is required";
            isValid= false;
        }

        if(!form.email) {
            newError.email= "Email is required";
            isValid= false;
        }

        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(form.email && !emailRegex.test(form.email)) {
            newError.email= "Invalid email format";
            isValid= false;
        }

        if(!form.password) {
            newError.password= "Password is required";
            isValid= false;
        }

        if(form.password && form.password.length < 6) {
            newError.password= "Password must be at least 6 characters";
            isValid= false;
        }

        setError(newError);
        return isValid;
    };

    const handleSubmit= async(e:any)=>{
        e.preventDefault();
        if(!validate()) return;

        try{
            setLoading(true);
            await axios.post("/api/auth/register", form);
            toast.success("Registration successful");
            router.push("/login");
        } catch(err:any){
            toast.error(err.response?.data?.message || "Registration failed");
        }
        finally{
            setLoading(false);
        }

    };

    return(
        <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 px-4">

            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-10 w-full max-w-md shadow-2xl">
                <h1 className="text-5xl font-bold text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Create Account</h1>
                <p className="text-slate-400 text-center mt-3 mb-8">Start saving transcriptions</p>

                {/* Name */}
                <div className="mb-4">
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-slate-500" />
                        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />
                    </div>
                    {error.name && <p className="text-red-300 text-sm mt-2">{error.name}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-500" />
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />
                    </div>
                    {error.email && <p className="text-red-300 text-sm mt-2">{error.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-500" />
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />
                        <button type="button" onClick={()=> setShowPassword(!showPassword)} className=" absolute right-4 top-4 text-slate-400">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {error.password && <p className="text-red-400 text-sm mt-2">{error.password}</p>}
                </div>

                <button disabled={loading} className="w-full mt-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 flex justify-center items-center gap-3 font-semibold">
                    {
                        loading ?
                            <>
                                <Loader2 className="animate-spin" />
                                Creating...
                            </> 
                            :
                            <>
                                <UserPlus size={20} />
                                Register
                            </>
                    }
                </button>

                <p className="text-center text-slate-400 mt-6">
                    Already have account?
                    <Link href="/login" className="text-cyan-400 ml-2"> Login</Link>
                </p>
            </form>
        </div>
    )

}
export default Register;