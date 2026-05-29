'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router= useRouter();

  useEffect(()=>{
    const checkAuth= async()=>{
      try {
        await axios.get('/api/auth/me', {withCredentials: true});
        router.push("/dashboard");
      } catch (err) {
        router.push("/login");
      }
    };
    checkAuth();
  },[]);

  return null;
}
