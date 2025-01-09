"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userType = searchParams.get("userType");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Google ile giriş başarısız oldu");
      router.push("/auth/login");
      return;
    }

    if (token && userType) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      toast.success("Google ile giriş başarılı!");
      router.push("/dashboard");
    } else {
      toast.error("Geçersiz veya eksik bilgi");
      router.push("/auth/login");
    }
  }, [token, userType, error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Yönlendiriliyor...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Lütfen bekleyin, işleminiz devam ediyor.
          </p>
        </div>
      </div>
    </div>
  );
}
