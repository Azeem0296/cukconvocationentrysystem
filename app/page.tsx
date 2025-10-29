"use client"; 

import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
// Import the Supabase client
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct

// A simple SVG component for the Google "G" logo
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);


export default function HomePage() {
  return (
    // Make sure you have a file at public/background.jpg for this to work
    <div className="flex items-center justify-center min-h-screen bg-[url('/background.jpg')] bg-cover bg-center p-4">
      
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full text-white">
            <LogIn size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Volunteer Login
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Sign in with Google to access the scanner.
        </p>
        
        <GoogleSignInButton />
        
        <p className="text-center text-xs text-gray-500 dark:text-gray-300 mt-8">
          © {new Date().getFullYear()} Convocation Committee. All rights reserved.
        </p>
      </div>
    </div>
  );
}


function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    // This redirects to your new setup page
    const redirectTo = `${window.location.origin}/scanner-setup`;

    // Use Supabase OAuth sign-in
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo, // <-- Redirects to /scanner-setup
      },
    });

    if (error) {
      console.error("Supabase sign-in error:", error.message);
      setError("Sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Sign-in Button */}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-6 w-6" />
        ) : (
          <>
            <GoogleIcon className="mr-3 h-5 w-5" />
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
}