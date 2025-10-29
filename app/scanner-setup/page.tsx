"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Loader2, LogOut } from "lucide-react";

// --- Toast Type ---
type ToastType = "success" | "error" | "info";

export default function ScannerSetupPage() {
  // --- State ---
  const [authLoading, setAuthLoading] = useState(true);
  const [volunteerName, setVolunteerName] = useState("");
  const [station, setStation] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false,
  });

  const router = useRouter();

  // --- Fetch Volunteer Info ---
  useEffect(() => {
    const fetchVolunteerDetails = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          router.push("/");
          return;
        }

        const token = data.session.access_token;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-volunteer-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setToast({
              message: "Session expired. Logging out...",
              type: "error",
              visible: true,
            });
            await supabase.auth.signOut();
            router.push("/");
            return;
          }

          throw new Error(`Server error (${response.status})`);
        }

        const result = await response.json();
        console.log("Volunteer info:", result);

        if (result?.name && result?.station) {
          setVolunteerName(result.name);
          setStation(result.station);
        } else {
          setToast({
            message: "Could not find your volunteer details.",
            type: "error",
            visible: true,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setToast({
          message: "Network error. Please check your connection.",
          type: "error",
          visible: true,
        });
      } finally {
        setAuthLoading(false);
      }
    };

    fetchVolunteerDetails();
  }, [router]);

  // --- Auto-hide toast ---
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(
        () => setToast((prev) => ({ ...prev, visible: false })),
        3000
      );
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  // --- Logout handler ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // --- Start scanning ---
  const handleStartScanning = () => {
    if (!volunteerName.trim()) {
      setToast({
        message: "Volunteer details are missing. Cannot start scanner.",
        type: "error",
        visible: true,
      });
      return;
    }

    sessionStorage.setItem("volunteerName", volunteerName);
    sessionStorage.setItem("station", station);
    router.push("/scan");
  };

  // --- Loading State ---
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-400" />
      </div>
    );
  }

  // --- UI ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 relative">
      {/* Toast Notification */}
      <div
        className={`fixed top-5 z-50 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out
          ${toast.visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}
          ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
      >
        {toast.message}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg z-20"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>

      {/* Card */}
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Volunteer Details</h1>

        <div className="space-y-6 text-left">
          {/* Name */}
          <div>
            <label
              htmlFor="volunteerName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Name
            </label>
            <div
              id="volunteerName"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 min-h-[46px]"
            >
              {volunteerName || "—"}
            </div>
          </div>

          {/* Station */}
          <div>
            <label
              htmlFor="station"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Entry Position
            </label>
            <div
              id="station"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 min-h-[46px]"
            >
              {station || "—"}
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleStartScanning}
            disabled={authLoading || !volunteerName}
            className="flex gap-2 items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
              <svg className='w-6 h-6' id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.61 122.88" fill="white"><defs><style></style></defs><title>qr-code-scan</title><path className="cls-1" d="M26.68,26.77H51.91V51.89H26.68V26.77ZM35.67,0H23.07A22.72,22.72,0,0,0,14.3,1.75a23.13,23.13,0,0,0-7.49,5l0,0a23.16,23.16,0,0,0-5,7.49A22.77,22.77,0,0,0,0,23.07V38.64H10.23V23.07a12.9,12.9,0,0,1,1-4.9A12.71,12.71,0,0,1,14,14l0,0a12.83,12.83,0,0,1,9.07-3.75h12.6V0ZM99.54,0H91.31V10.23h8.23a12.94,12.94,0,0,1,4.9,1A13.16,13.16,0,0,1,108.61,14l.35.36h0a13.07,13.07,0,0,1,2.45,3.82,12.67,12.67,0,0,1,1,4.89V38.64h10.23V23.07a22.95,22.95,0,0,0-6.42-15.93h0l-.37-.37a23.16,23.16,0,0,0-7.49-5A22.77,22.77,0,0,0,99.54,0Zm23.07,99.81V82.52H112.38V99.81a12.67,12.67,0,0,1-1,4.89,13.08,13.08,0,0,1-2.8,4.17,12.8,12.8,0,0,1-9.06,3.78H91.31v10.23h8.23a23,23,0,0,0,16.29-6.78,23.34,23.34,0,0,0,5-7.49,23,23,0,0,0,1.75-8.8ZM23.07,122.88h12.6V112.65H23.07A12.8,12.8,0,0,1,14,108.87l-.26-.24a12.83,12.83,0,0,1-2.61-4.08,12.7,12.7,0,0,1-.91-4.74V82.52H0V99.81a22.64,22.64,0,0,0,1.67,8.57,22.86,22.86,0,0,0,4.79,7.38l.31.35a23.2,23.2,0,0,0,7.5,5,22.84,22.84,0,0,0,8.8,1.75Zm66.52-33.1H96v6.33H89.59V89.78Zm-12.36,0h6.44v6H70.8V83.47H77V77.22h6.34V64.76H89.8v6.12h6.12v6.33H89.8v6.33H77.23v6.23ZM58.14,77.12h6.23V70.79h-6V64.46h6V58.13H58.24v6.33H51.8V58.13h6.33V39.33h6.43V58.12h6.23v6.33h6.13V58.12h6.43v6.33H77.23v6.33H70.8V83.24H64.57V95.81H58.14V77.12Zm31.35-19h6.43v6.33H89.49V58.12Zm-50.24,0h6.43v6.33H39.25V58.12Zm-12.57,0h6.43v6.33H26.68V58.12ZM58.14,26.77h6.43V33.1H58.14V26.77ZM26.58,70.88H51.8V96H26.58V70.88ZM32.71,77h13V89.91h-13V77Zm38-50.22H95.92V51.89H70.7V26.77Zm6.13,6.1h13V45.79h-13V32.87Zm-44,0h13V45.79h-13V32.87Z"/></svg>

            Open Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
