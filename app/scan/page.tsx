"use client";

import { useState, useEffect, useRef } from "react";
// --- Removed imports that cause errors ---
// import { useRouter } from "next/navigation";
// import { Html5Qrcode } from "html5-qrcode";
// import { supabase } from "@/lib/supabaseClient";
// import type { Session } from "@supabase/supabase-js";

// --- Load necessary scripts ---
// In a real Next.js app, these would be in _app.tsx or _document.tsx
// For this environment, we set them as constants.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key";

// --- Types ---
// Manually define Session type if import is not available
type Session = {
  access_token: string;
  // ... add other properties if you use them
};

// --- Types for the modal props ---
type ConfirmationModalProps = {
  station: string;
  modalState: "confirm" | "loading" | "success" | "error";
  studentInfo: any | null;
  scanResult: { title: string; message: string } | null;
  onClose: () => void;
  onConfirm: () => void;
};

// --- Mock Lucide icons (or load from CDN if available) ---
// Using inline SVGs for compatibility
const Loader2 = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;
const X = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const User = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CheckCircle2 = ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const AlertTriangle = ({ className }: { className: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const QrCode = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="14.01" y2="14"></line><line x1="17" y1="14" x2="17.01" y2="14"></line><line x1="20" y1="14" x2="20.01" y2="14"></line><line x1="14" y1="17" x2="14.01" y2="17"></line><line x1="17" y1="17" x2="17.01" y2="17"></line><line x1="20" y1="17" x2="20.01" y2="17"></line><line x1="14" y1="20" x2="14.01" y2="20"></line><line x1="17" y1="20" x2="17.01" y2="20"></line><line x1="20" y1="20" x2="20.01" y2="20"></line></svg>;


// --- New Modal Component ---
function ConfirmationModal({
  modalState,
  studentInfo,
  station,
  scanResult,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  const isLoading = modalState === "loading";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {modalState === "confirm" && "Confirm Check-in"}
            {modalState === "loading" && "Confirm Check-in"}
            {modalState === "success" && "Success"}
            {modalState === "error" && "Scan Error"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Content: Confirmation */}
        {(modalState === "confirm" || modalState === "loading") && studentInfo && (
          <>
            <div className="p-6 text-left">
              <p className="mb-6 text-center text-sm text-gray-400">
                Checking in at:{" "}
                <span className="font-bold text-blue-400 text-base">
                  {station}
                </span>
              </p>
              <div className="space-y-3">
                <InfoRow icon={User} label="Name" value={studentInfo.name} />
                <InfoRow
                  label="Roll No"
                  value={studentInfo.roll_no}
                  isMono
                />
                <InfoRow label="Department" value={studentInfo.dept} />
                <InfoRow
                  label="Guests"
                  value={studentInfo.guest_count}
                  isMono
                />
              </div>
            </div>
            {/* Action */}
            <div className="p-5 bg-gray-950/50 rounded-b-2xl">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                {isLoading ? (
                  <Loader2 />
                ) : (
                  "Mark as Present"
                )}
              </button>
            </div>
          </>
        )}

        {/* Content: Result (Success or Error) */}
        {(modalState === "success" || modalState === "error") && scanResult && (
          <>
            <div className="p-8 text-center flex flex-col items-center">
              {modalState === "success" ? (
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              )}
              <h3 className="text-2xl font-bold text-white mb-2">
                {scanResult.title}
              </h3>
              <p className="text-gray-300">{scanResult.message}</p>
            </div>
            {/* Action */}
            <div className="p-5 bg-gray-950/50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white flex items-center justify-center transition-all duration-150"
              >
                Scan Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- New InfoRow Component ---
function InfoRow({
  label,
  value,
  icon: Icon,
  isMono = false,
}: {
  label: string;
  value: any;
  icon?: React.ElementType;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {label}
      </span>
      <span
        className={`font-semibold text-white ${isMono ? "font-mono tracking-wide" : ""
          }`}
      >
        {value ?? "N/A"}
      </span>
    </div>
  );
}

// --- Main Page Component ---
export default function ScanPage() {
  // --- State for libraries ---
  const [supabase, setSupabase] = useState<any>(null);
  const [Html5Qrcode, setHtml5Qrcode] = useState<any>(null);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const isProcessingRef = useRef(false);


  // --- Mock useRouter ---
  const router = {
    push: (path: string) => {
      window.location.href = path;
    },
  };

  const [isReady, setIsReady] = useState(false);
  const [volunteerName, setVolunteerName] = useState("");
  const [station, setStation] = useState("");
  const [error, setError] = useState(""); // For persistent errors (e.g., camera)
  const [isScanning, setIsScanning] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // --- Modal and State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<
    "confirm" | "loading" | "success" | "error"
  >("confirm");
  const [scannedPassId, setScannedPassId] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [scanResult, setScanResult] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const html5QrCodeRef = useRef<any | null>(null); // Use 'any' for CDN ref
  const qrConfig = { fps: 10, qrbox: { width: 280, height: 280 } };

  // --- Load CDN scripts ---
  useEffect(() => {
    const loadScripts = async () => {
      // Load Supabase
      const supabaseScript = document.createElement("script");
      supabaseScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      supabaseScript.onload = () => {
        // @ts-ignore
        if (window.supabase) {
          // @ts-ignore
          const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          setSupabase(supabaseClient);
        }
      };
      document.body.appendChild(supabaseScript);

      // Load Html5Qrcode
      const qrScript = document.createElement("script");
      qrScript.src = "https://unpkg.com/html5-qrcode";
      qrScript.onload = () => {
        // @ts-ignore
        if (window.Html5Qrcode) {
          // @ts-ignore
          setHtml5Qrcode(() => window.Html5Qrcode);
        }
      };
      document.body.appendChild(qrScript);
    };

    loadScripts();
  }, []);

  // --- Check if libs are loaded ---
  useEffect(() => {
    if (supabase && Html5Qrcode) {
      setLibsLoaded(true);
    }
  }, [supabase, Html5Qrcode]);

  // --- STEP 1: Load data from sessionStorage safely ---
  useEffect(() => {
    if (!libsLoaded) return; // Wait for libraries

    const timeout = setTimeout(async () => {
      const { data, error }: { data: { session: Session | null }; error: any | null } =
        await supabase.auth.getSession();
      const name = sessionStorage.getItem("volunteerName");
      const pos = sessionStorage.getItem("station");

      if (error || !data.session) {
        router.push("/");
        return;
      }

      if (!name || !pos) {
        router.push("/scanner-setup");
      } else {
        setSession(data.session);
        setVolunteerName(name);
        setStation(pos);
        setIsReady(true);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [libsLoaded, supabase, router]); // Add dependencies

  // --- Helper to start scanner ---
  const startScanner = () => {
    if (!html5QrCodeRef.current || isScanning) {
      return;
    }
    html5QrCodeRef.current
      .start(
        { facingMode: "environment" },
        qrConfig,
        onScanSuccess,
        (err: string) => {
          if (
            typeof err === "string" &&
            (err.includes("No MultiFormat Readers") ||
              err.includes("NotFoundException") ||
              err.includes("QR code parse error"))
          ) {
            // Silently ignore these — they're just 'no QR found' messages
            return;
          }
          // Log any other real errors
          console.warn("QR Error:", err);
        }

      )
      .then(() => setIsScanning(true))
      .catch((err: any) => {
        setError("Camera access denied. Please refresh and grant access.");
      });
  };

  // --- Helper to close modal and restart scanner ---
  const closeModalAndRestart = async () => {
    setIsModalOpen(false);
    setStudentInfo(null);
    setScannedPassId(null);
    setScanResult(null);
    setError("");

    try {
      // Stop previous instance if running
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {
          console.warn("Stop error:", e);
        }
        try {
          await html5QrCodeRef.current.clear();
        } catch (e) {
          console.warn("Clear error:", e);
        }
        html5QrCodeRef.current = null;
      }

      // Small delay to release camera
      await new Promise((res) => setTimeout(res, 300));

      // Clean up and recreate container
      const container = document.getElementById("reader-container");
      if (container) {
        container.innerHTML = ""; // remove old children
        const newDiv = document.createElement("div");
        newDiv.id = "reader";
        newDiv.className = "w-full h-full bg-black rounded-xl overflow-hidden";
        container.appendChild(newDiv);
      }

      // Wait for the reader to exist in the DOM before initializing
      await new Promise((res) => {
        const check = () => {
          const el = document.getElementById("reader");
          if (el) res(true);
          else setTimeout(check, 50);
        };
        check();
      });

      // Initialize new scanner
      // @ts-ignore
      const Html5Qrcode = window.Html5Qrcode;
      html5QrCodeRef.current = new Html5Qrcode("reader");

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        qrConfig,
        (decodedText: string) => {
          onScanSuccess(decodedText);
        },
        (error: string) => {
          if (
            typeof error === "string" &&
            (error.includes("No MultiFormat Readers") ||
              error.includes("NotFoundException"))
          ) {
            return;
          }
          console.warn("QR Error:", error);
        }
      );

      setIsScanning(true);
    } catch (e) {
      setError("Could not restart camera. Please refresh.");
    }
  };



  // --- STEP 2: Start scanner once ready ---
  useEffect(() => {
    if (!isReady || !Html5Qrcode) return; // Wait for libs and readiness

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader"); // Use new container ID
    }
    startScanner();

    return () => {
      if (html5QrCodeRef.current) {
        // Check if scanning before stopping
        html5QrCodeRef.current.getState().then((state: any) => {
          // @ts-ignore
          if (state === window.Html5QrcodeScannerState.SCANNING) {
            html5QrCodeRef.current.stop()
              .then(() => setIsScanning(false))
              .catch(() => { });
          }
        }).catch(() => { });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, Html5Qrcode]); // Add Html5Qrcode dependency

  // --- STEP 3: Handle the successful scan (GETS info) ---
  const onScanSuccess = async (decodedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;


    try {
      // Stop scanning immediately so multiple detections don’t happen
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop().catch(() => { });
      }

      setScannedPassId(decodedText);
      setIsScanning(false);

      // ✅ Fetch student info from Edge Function
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-student-info-by-pass?pass_id=${decodedText}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session?.access_token}`,
          },
          // body: JSON.stringify({ pass_id:  }),
        }
      );

      // --- Handle API error safely ---
      if (!response.ok) {
        const text = await response.text(); // fallback in case it's not JSON
        throw new Error(`Server returned ${response.status}: ${text}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Invalid response format from get-student-info-by-pass");
      }


      // --- Normalize possible property names ---
      const name = data.student_name || data.name;
      if (name) {
        setStudentInfo(data);
        setIsModalOpen(true);
        setModalState("confirm"); // make sure modal opens in correct state
      } else {
        setScanResult({
          title: "Invalid QR Code",
          message: "No student record found for this pass ID.",
        });
        setModalState("error");
        setIsModalOpen(true);
      }
    } catch (err: any) {
      setScanResult({
        title: "Scan Error",
        message: err.message || "Failed to fetch student info.",
      });
      setModalState("error");
      setIsModalOpen(true);
    } finally {
      isProcessingRef.current = false;
    }
  };



  // --- STEP 4: Handle the confirmation "Mark Present" button (WRITES data) ---
  const handleMarkPresent = async () => {
    if (!scannedPassId) return;
    setModalState("loading");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/mark-present`, // Use var
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY, // Use var
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ pass_id: scannedPassId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // This will catch "Already checked in", "Not registered", etc.
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      // --- Final Success! Show SUCCESS in modal ---
      setScanResult({
        title: "Check-in Successful!",
        message: `${result.message || "Marked present!"} (Student: ${result.student_name
          })`,
      });
      setModalState("success");
    } catch (err: any) {
      // --- Show ERROR in modal ---
      setScanResult({
        title: "Check-in Failed",
        message: err.message || "Failed to mark attendance.",
      });
      setModalState("error");
    }
    // No finally block, modal state change handles loading
  };

  // --- RENDER ---

  if (!libsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4">
        <Loader2 />
        <p className="mt-4 text-gray-400">Loading Libraries...</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4">
        <Loader2 />
        <p className="mt-4 text-gray-400">Loading Session...</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal is now controlled by state */}
      {isModalOpen && (
        <ConfirmationModal
          modalState={modalState}
          studentInfo={studentInfo}
          station={station}
          scanResult={scanResult}
          onClose={closeModalAndRestart}
          onConfirm={handleMarkPresent}
        />
      )}

      {/* Main Page Layout */}
      <div className="flex flex-col items-center min-h-screen w-full bg-gray-950 text-white p-4 pt-8 md:pt-12">
        {/* Header Info Block */}
        <div className="w-full max-w-md mb-8 bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-5">
          <h1 className="text-2xl font-bold text-center text-white mb-3">
            Event Scanner
          </h1>
          <div className="text-center text-gray-400">
            Logged in as{" "}
            <span className="font-medium text-blue-300">{volunteerName}</span>
          </div>
          <div className="text-center text-gray-400">
            Station:{" "}
            <span className="font-medium text-blue-300">{station}</span>
          </div>
        </div>

        {/* Scanner Viewfinder */}
        <div className="w-full max-w-xs h-auto aspect-square bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl border-4 border-gray-800">
          {/* This is the container for the scanner */}
          <div
            id="reader-container"
            className="relative w-full h-[65vh] bg-black flex items-center justify-center rounded-2xl overflow-hidden shadow-lg"
          >
            <div id="reader" className="w-full h-full"></div>
          </div>
        </div>

        {/* Status Message */}
        <div className="w-full max-w-xs text-center mt-6 h-10">
          {error && <p className="text-red-500 font-medium">{error}</p>}
          {!error && isScanning && (
            <p className="text-gray-400 flex items-center justify-center animate-pulse">
              <QrCode className="h-5 w-5" />
              <span className="ml-2">Ready to Scan...</span>
            </p>
          )}
          {!error && !isScanning && !isModalOpen && (
            <p className="text-yellow-400">Starting scanner...</p>
          )}
        </div>
      </div>

      {/* Simple CSS for fade-in animation and viewfinder fix */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        /* Viewfinder Fix: Force video to fill container */
        #reader-container {
           width: 100%;
           height: 100%;
           overflow: hidden; /* Hide anything that spills out */
        }
        #reader-container video {
          width: 100%;
          height: 100%;
          object-fit: cover; /* This is the key: cover fills the box */
          object-position: center; /* Center the video feed */
        }
      `}</style>
    </>
  );
}

