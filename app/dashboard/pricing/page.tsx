"use client";

import React from "react";
import PricingMask from "@/public/pricingmask.png";
import PurpleMask from "@/public/purplemask.png";

export default function PricingPage() {
  return (
    <div className="min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-16">Pricing and Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Researcher Plan 1 */}
        <div
          className="bg-[#111427] p-8 flex flex-col h-full"
          style={{
            backgroundImage: `url(${PricingMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid #22263C",
            borderRadius: "26px",
          }}
        >
          <h2 className="text-2xl font-bold mb-2">Researcher</h2>
          <p className="text-gray-300 mb-6">
            Track Telegram groups and channels relevant to cyber threats and
            incidents
          </p>

          <div className="text-3xl font-bold mb-6">
            $15<span className="text-xl font-normal text-gray-300">/month</span>
          </div>

          <button
            className=" text-white py-3 rounded-lg mb-8"
            style={{
              borderRadius: "12px",
              background:
                "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
            }}
          >
            Purchase now
          </button>

          <ul className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex items-center">
                <span className="text-[#8a3ffc] mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#D9D9D9" />
                  </svg>
                </span>
                <span className="text-sm">Monitor posts from Telegram channels</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Researcher Plan 2 (Highlighted) */}
        <div
          className="bg-[#35005C] p-8 flex flex-col h-full"
          style={{
            backgroundImage: `url(${PurpleMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid #22263C",
            borderRadius: "26px",
          }}
        >
          <h2 className="text-2xl font-bold mb-2">Researcher</h2>
          <p className="text-gray-300 mb-6">
            Track Telegram groups and channels relevant to cyber threats and
            incidents
          </p>

          <div className="text-3xl font-bold mb-6">
            $15<span className="text-xl font-normal text-gray-300">/month</span>
          </div>

          <button
            className=" text-white py-3 rounded-lg mb-8"
            style={{
              borderRadius: "12px",
              background:
                "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
            }}
          >
            Purchase now
          </button>

          <ul className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex items-center">
                <span className="text-[#8a3ffc] mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#D9D9D9" />
                  </svg>
                </span>
                <span className="text-sm">Monitor posts from Telegram channels</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Researcher Plan 3 */}
        <div
          className="bg-[#111427] p-8 flex flex-col h-full"
          style={{
            backgroundImage: `url(${PricingMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid #22263C",
            borderRadius: "26px",
          }}
        >
          <h2 className="text-2xl font-bold mb-2">Researcher</h2>
          <p className="text-gray-300 mb-6">
            Track Telegram groups and channels relevant to cyber threats and
            incidents
          </p>

          <div className="text-3xl font-bold mb-6">
            $15<span className="text-xl font-normal text-gray-300">/month</span>
          </div>

          <button
            className=" text-white py-3 rounded-lg mb-6"
            style={{
              borderRadius: "12px",
              background:
                "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
            }}
          >
            Purchase now
          </button>

          <ul className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex items-center">
                <span className="text-[#8a3ffc] mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle cx="4" cy="4" r="4" fill="#D9D9D9" />
                  </svg>
                </span>
                <span className="text-sm">Monitor posts from Telegram channels</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
