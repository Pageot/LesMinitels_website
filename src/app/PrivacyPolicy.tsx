import React, { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Navbar } from "./components/Navbar";

export default function PrivacyPolicy() {
  const { id } = useParams();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // For now, we only have the "Convert" app, so we'll render its specific policy.
  // In the future, we can add a switch statement here based on the `id` parameter.

  return (
    <div className="min-h-screen bg-[#fffffe] w-full font-sans overflow-x-clip flex flex-col items-center">
      <div className="w-full max-w-[1417px] flex flex-col gap-[40px] px-6 lg:px-12 pt-[24px]">
        {/* Navigation */}
        <Navbar />
        
        {/* Line below navbar */}
        <div className="bg-[#c01f2a] h-[3px] opacity-26 shadow-[0px_3px_0px_0px_#f49514] shrink-0 w-full" />

        <main className="w-full max-w-3xl mx-auto pb-24 text-[#171717]">
          
          <Link to={`/project/${id || 'convert'}`} className="inline-block mb-8 text-sm font-medium hover:underline text-[#636363]">
            &larr; Back to App
          </Link>

          <h1 className="font-['Nova_Klasse',_sans-serif] font-semibold text-3xl sm:text-4xl md:text-[48px] uppercase tracking-[2px] leading-tight mb-4">
            Privacy Policy — Convert
          </h1>
          
          <p className="italic text-[#8a8a8a] mb-8">Last updated: March 2026</p>

          <div className="font-['Helvetica_Neue',_Arial,_sans-serif] text-[#636363] leading-relaxed space-y-6">
            <p className="text-lg">
              This policy applies to all information collected or submitted on the Convert iOS and Android app.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">Information We Collect</h2>
            <p>
              We do not collect personal information such as your name, email address, phone number, or precise location.
            </p>
            <p>
              All your app settings and preferences are stored locally on your device. They are not transmitted to or stored on our servers.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">Advertising</h2>
            <p>
              Our app is integrated with <strong className="text-[#171717]">Google AdMob</strong> to display advertisements to users who have not subscribed to Convert Pro.
            </p>
            <p>
              <strong className="text-[#171717]">By default, we show non-personalized ads only.</strong> We do not use your device's advertising identifier or any personal data for ad targeting unless you have explicitly given your consent.
            </p>

            <h3 className="font-['Nova_Klasse',_sans-serif] text-xl md:text-2xl font-bold text-[#171717] uppercase tracking-[0.5px] mt-8 mb-4">Personalized Ads (Opt-In)</h3>
            <p>
              You may choose to enable personalized ads by going to <strong className="text-[#171717]">Settings &rarr; Receive personalized ads</strong> in the app. This will trigger the App Tracking Transparency (ATT) system prompt on iOS, which allows you to grant or deny permission for the app to track your activity across other apps and websites.
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>If you <strong className="text-[#171717]">grant</strong> permission, Google AdMob may use your device's advertising identifier (IDFA) to deliver personalized advertisements.</li>
              <li>If you <strong className="text-[#171717]">deny</strong> permission (or do not change your setting), only non-personalized ads will be shown.</li>
            </ul>
            <p>
              You can change your preference at any time via the app settings. If the system permission has already been set, you will be directed to <strong className="text-[#171717]">Settings &rarr; Privacy &amp; Security &rarr; Tracking</strong> on your device to update it.
            </p>
            <p>
              For more information, please review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c01f2a] hover:underline">Google's Privacy Policy</a>.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">In-App Purchases</h2>
            <p>
              Our app uses <strong className="text-[#171717]">RevenueCat</strong> to manage in-app purchase and subscription functionality. If you make a purchase, RevenueCat will receive a receipt from the App Store or Google Play containing information about that transaction. RevenueCat does not receive or process your payment information (such as credit card details).
            </p>
            <p>
              For more information, please review <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c01f2a] hover:underline">RevenueCat's Privacy Policy</a>.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">Data Retention</h2>
            <p>
              We do not store any personal data on our servers. All app data (settings, preferences, cached exchange rates) is stored locally on your device and can be cleared at any time from the app settings.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">Children's Privacy</h2>
            <p>
              Our app does not knowingly collect any information from children under the age of 13.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be reflected by the "Last updated" date at the top of this document. We encourage you to review this policy periodically.
            </p>

            <hr className="border-gray-200 my-8" />

            <h2 className="font-['Nova_Klasse',_sans-serif] text-2xl md:text-3xl font-bold text-[#171717] uppercase tracking-[1px] mt-10 mb-6">Contact</h2>
            <p>
              If you have questions about this Privacy Policy, you may contact us at: <a href="mailto:lesminitels@protonmail.com" className="text-[#c01f2a] hover:underline">lesminitels@protonmail.com</a>
            </p>
          </div>
          
        </main>
      </div>
    </div>
  );
}
