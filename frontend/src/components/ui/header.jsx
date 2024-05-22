import React from "react";
import { Button } from "@/components/ui/button";
import '@/App.css'

export default function Header() {
  return (
    <header className="inset-x-0 top-0 h-20 z-50 flex items-center px-4 bg-black text-white">
      <nav className="flex-1 flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Bunk Better.
        </h1>
        {/* <img
          alt="Acme Inc"
          className="object-contain"
          height="40"
          src="/placeholder.svg"
          style={{
            aspectRatio: "120/40",
            objectFit: "cover",
          }}
          width="120"
        /> */}
        <div className="flex-1 flex justify-end items-center space-x-8">
          <a
            className="font-semibold transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 rounded-link"
            href="#"
          >
            Features
          </a>
          <a
            className="font-semibold transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 rounded-link"
            href="#"
          >
            Pricing
          </a>
          <a
            className="font-semibold transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 rounded-link"
            href="#"
          >
            Contact
          </a>
          <a
            className="font-semibold transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 rounded-link"
            href="#"
          >
            Sign In
          </a>
        </div>
      </nav>
    </header>
  );
}
