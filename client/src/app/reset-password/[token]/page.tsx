"use client";

import axios from "axios";
import { Eye, EyeOff, Lock, Loader2, CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const router = useRouter();
    const params = useParams();

    const token = params.token as string;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: ""
    });

    const validate = () => {
        const newErrors = {
            password: "",
            confirmPassword: ""
        };

        let valid = true;

        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
            valid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await axios.post(`/api/auth/reset-password/${token}`,{ password });
            toast.success("Password reset successful");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-10 shadow-2xl">
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
                        <CheckCircle size={34} className="text-cyan-400" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-center bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Reset Password
                </h1>   
                <p className="text-center text-slate-400 mt-3 mb-8"> Enter your new password below</p>

                {/* Password */}
                <div className="mb-4">
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-500" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />

                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-4 right-4 text-slate-400">
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-500" />
                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700" />

                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-4 right-4 text-slate-400">
                            {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>}
                </div>

                <button disabled={loading} className="w-full mt-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 flex justify-center items-center gap-3 font-semibold">
                    {
                        loading ?
                            <>
                                <Loader2 className="animate-spin"/> Resetting...
                            </>
                            :
                            "Reset Password"
                    }
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;