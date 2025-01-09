"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || !userType) {
      router.push("/auth/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auth/${userType}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        toast.error("Kullanıcı bilgileri alınamadı");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Yükleniyor...
          </h2>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                {user?.userType === "psychologist"
                  ? "Psikolog Paneli"
                  : "Danışan Paneli"}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Kişisel Bilgiler</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Ad</p>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Soyad</p>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.surname || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.email || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Kullanıcı Tipi
                </p>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.userType === "psychologist" ? "Psikolog" : "Danışan"}
                </p>
              </div>
              {user?.userType === "psychologist" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Deneyim (Yıl)
                    </p>
                    <p className="mt-1 text-lg text-gray-900">
                      {user?.experience || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefon</p>
                    <p className="mt-1 text-lg text-gray-900">
                      {user?.phone || "-"}
                    </p>
                  </div>
                </>
              )}
              {user?.userType === "client" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Paket Durumu
                    </p>
                    <p className="mt-1 text-lg text-gray-900">
                      {user?.package_id ? "Aktif" : "Pasif"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Psikolog Atanması
                    </p>
                    <p className="mt-1 text-lg text-gray-900">
                      {user?.psyc_id ? "Atandı" : "Atanmadı"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
