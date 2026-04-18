"use client";
import "./globals.css";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-[#31B8FA] text-center px-6 relative">
      <h1 className="text-9xl font-extrabold drop-shadow-sm">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="mt-2 text-lg text-gray-600 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block bg-[#31B8FA] hover:bg-[#31B8FA] text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all"
      >
        Go Home
      </Link>

      <div className="absolute bottom-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Website
      </div>
    </div>
  );
}
