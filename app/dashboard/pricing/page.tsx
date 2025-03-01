"use client";

import React from "react";

export default function PricingPage() {
  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-16">Pricing and Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Researcher Plan 1 */}
        <div className="bg-[#141428] rounded-xl p-8 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-2">Researcher</h2>
          <p className="text-gray-300 mb-6">
            Track Telegram groups and channels relevant to cyber threats and incidents
          </p>
          
          <div className="text-3xl font-bold mb-6">
            $15<span className="text-xl font-normal text-gray-300">/month</span>
          </div>
          
          <button className="bg-[#8a3ffc] hover:bg-[#7b38e3] text-white py-3 rounded-lg mb-8 transition-colors">
            Purchase now
          </button>
          
          <ul className="space-y-4 mt-auto">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex items-start">
                <span className="text-[#8a3ffc] mr-2">•</span>
                <span>Monitor posts from Telegram channels</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Researcher Plan 2 (Highlighted) */}
        <div className="bg-[#3a1a5a] rounded-xl p-8 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-2">Researcher</h2>
          <p className="text-gray-300 mb-6">
            Track Telegram groups and channels relevant to cyber threats and incidents
          </p>
          
          <div className="text-3xl font-bold mb-6">
            $15<span className="text-xl font-normal text-gray-300">/month</span>
          </div>
          
          <button className="bg-[#8a3ffc] hover:bg-[#7b38e3] text-white py-3 rounded-lg mb-8 transition-colors">
            Purchase now
          </button>
          
          <ul className="space-y-4 mt-auto">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex items-start">
                <span className="text-[#8a3ffc] mr-2">•</span>
                <span>Monitor posts from Telegram channels</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Researcher Plan 3 */}
        <div className="bg-[#141428] rounded-xl p-8 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-2">Researcher</h2>
          <p className="text-gray-300 mb-6">
            Track Telegram groups and channels relevant to cyber threats and incidents
          </p>
          
          <div className="text-3xl font-bold mb-6">
            $15<span className="text-xl font-normal text-gray-300">/month</span>
          </div>
          
          <button className="bg-[#8a3ffc] hover:bg-[#7b38e3] text-white py-3 rounded-lg mb-8 transition-colors">
            Purchase now
          </button>
          
          <ul className="space-y-4 mt-auto">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex items-start">
                <span className="text-[#8a3ffc] mr-2">•</span>
                <span>Monitor posts from Telegram channels</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
