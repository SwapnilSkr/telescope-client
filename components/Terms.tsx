"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function TermsAndAgreementModal({ isOpen, onClose, onAccept }: { isOpen: boolean; onClose: () => void; onAccept: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling of background content
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-[#0D0640] text-white p-8 rounded-xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(13, 6, 64, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-semibold mb-6 text-center">USER AGREEMENT</h2>
        
        <div className="text-sm leading-relaxed">
          <p className="mb-4">Last Updated: March 25, 2025</p>
          
          <p className="mb-4">Welcome to telescope (&quot;Platform&quot;), a software product operated by Tsanct Technologies Pvt Ltd. (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the Platform, you (&quot;User&quot; or &quot;you&quot;) agree to comply with and be bound by the following terms and conditions (&quot;User Agreement&quot;). If you do not agree to these terms, you must not use the Platform.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1. ACCEPTANCE OF TERMS</h3>
          <p className="mb-4 ml-4">1.1 By accessing, browsing, or using the Platform, you acknowledge that you have read, understood, and agree to be legally bound by this User Agreement, our Privacy Policy, and any other policies referenced herein.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">2. SERVICES PROVIDED</h3>
          <p className="mb-2 ml-4">2.1 The Platform enables Users to access and retrieve information from the public channels of the software application &quot;Telegram&quot; (which shall be hereafter referred to as &quot;Sources&quot;), in real time. The channels from which such information will be accessed will be communicated to the Users from time-to-time. You understand and acknowledge that:</p>
          <p className="mb-2 ml-8">2.1.1 The Platform does not create, modify, verify, or endorse the information obtained from the Sources.</p>
          <p className="mb-2 ml-8">2.1.2 The Platform only provides a technological interface for displaying such information.</p>
          <p className="mb-2 ml-8">2.1.3 The accuracy, authenticity, and reliability of the information depend entirely on the original source.</p>
          <p className="mb-4 ml-8">2.1.4 The list of channels may be varied unilaterally by the Platform from time-to-time.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">3. DISCLAIMER OF LIABILITY</h3>
          <p className="mb-2 ml-4">3.1 The Platform merely retrieves and displays data from the Sources. We do not guarantee the accuracy, authenticity, completeness, or reliability of any information displayed. Users must independently verify all information before relying on it. We disclaim all liability arising from unauthentic or misleading information.</p>
          <p className="mb-2 ml-4">3.2 If any information is deleted by its originator or the Source after being retrieved by our Platform, we are not responsible for its continued availability. We do not store, archive, or retain information beyond the retrieval process. Users acknowledge that we shall have no liability for any legal consequences arising from any data that is made available or deleted by the original source.</p>
          <p className="mb-4 ml-4">3.3 The Platform shall try its best to make all the data available on the channel, however, it is possible that there may be situations wherein certain messages/data are omitted.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">4. USER RESPONSIBILITIES</h3>
          <p className="mb-2 ml-4">4.1 Users agree to:</p>
          <p className="mb-2 ml-8">4.1.1 Use the Platform only for lawful purposes and in compliance with applicable laws in India and the countries in which the Platform is being used.</p>
          <p className="mb-4 ml-8">4.1.2 Indemnify and hold the Company harmless against any claims arising from the use of the Platform.</p>
          <p className="mb-2 ml-4">4.2 Users agree not to:</p>
          <p className="mb-2 ml-8">4.2.1 Use the data for unauthorized surveillance, harassment, defamation, or any other malicious activities.</p>
          <p className="mb-2 ml-8">4.2.2 Alter, manipulate, or misrepresent the retrieved data to create false or misleading information.</p>
          <p className="mb-2 ml-8">4.2.3 Use the data to infringe upon the privacy rights or intellectual property rights of any individual or entity.</p>
          <p className="mb-4 ml-8">4.2.4 Sell, trade, or commercially exploit the data in a manner that violates legal or ethical standards.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">5. INTELLECTUAL PROPERTY</h3>
          <p className="mb-4 ml-4">5.1 The software, design, features, and content of the Platform are the exclusive property of the Company. Unauthorized reproduction, distribution, or modification of any part of the Platform is strictly prohibited.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">6. INTEGRATION WITH SECURITY TOOLS</h3>
          <p className="mb-2 ml-4">6.1 The Platform is designed to assist Users in identifying potential threats or breaches and may be integrated with other security tools or systems used by the User.</p>
          <p className="mb-2 ml-4">6.2 The User acknowledges that such integration is at their own discretion and risk. The Platform does not guarantee compatibility with all security tools or the accuracy of threat detection.</p>
          <p className="mb-2 ml-4">6.3 The Platform shall not be responsible for any errors, misconfigurations, or security failures arising from such integration.</p>
          <p className="mb-4 ml-4">6.4 The User shall ensure that any integration complies with applicable laws, including data protection and cybersecurity regulations. The Platform shall not be liable for any unauthorized access, data leaks, or compliance violations resulting from such integration.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">7. THIRD-PARTY SOURCES</h3>
          <p className="mb-2 ml-4">7.1 Users acknowledge that the Platform operates on open third-party sources in order to retrieve information and that:</p>
          <p className="mb-2 ml-8">7.1.1 The Company does not control or own such third-party sources.</p>
          <p className="mb-2 ml-8">7.1.2 The availability of data depends on the policies and technical operations of the third-party source.</p>
          <p className="mb-4 ml-8">7.1.3 Any changes, restrictions, or discontinuation of service by the third-party source may impact the functionality of the Platform, and we shall not be liable for any such disruptions.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">8. PRIVACY POLICY</h3>
          <p className="mb-4 ml-4">8.1 We do not store or retain any user data beyond what is necessary for real-time processing. Our data handling practices are governed by our Privacy Policy and the Privacy Policy and Terms and Conditions of Telegram.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">9. LIMITATION OF LIABILITY</h3>
          <p className="mb-2 ml-4">9.1 To the maximum extent permitted by law, the Company shall not be liable for:</p>
          <p className="mb-2 ml-8">9.1.1 Any indirect, incidental, consequential, or punitive damages arising from the use of the Platform.</p>
          <p className="mb-2 ml-8">9.1.2 Any loss, corruption, or inaccuracy of data retrieved from the third-party messaging app.</p>
          <p className="mb-4 ml-8">9.1.3 Any legal or regulatory consequences resulting from reliance on the Platform&apos;s output.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">10. TERMINATION</h3>
          <p className="mb-4 ml-4">10.1 We reserve the right to suspend or terminate user access to the Platform if a user violates this Agreement or engages in misuse of the Platform.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">11. GOVERNING LAW & DISPUTE RESOLUTION</h3>
          <p className="mb-4 ml-4">11.1 This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ernakulam, Kerala, India.</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">12. MODIFICATIONS TO THE AGREEMENT</h3>
          <p className="mb-4 ml-4">12.1 We reserve the right to update or modify this User Agreement at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Agreement.</p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={onAccept}
            className="px-6 py-2"
            style={{
              background: "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
}