import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../utils/seo";

export function LegalPolicies() {
  const [activeTab, setActiveTab] = useState("terms");

  const tabs = [
    { id: "terms", num: "01//", label: "Terms & Conditions" },
    { id: "privacy", num: "02//", label: "Privacy Policy" },
    { id: "refund", num: "03//", label: "Retainer Refund" },
    { id: "antispam", num: "04//", label: "Anti-Spam Policy" },
  ];

  return (
    <>
      <SEO
        title="Legal-policies"
        description="Official legal terms, privacy policy, retainer refund agreement, and zero-tolerance anti-spam policies of Littroi Media."
        canonical="/legal-policies"
      />

      <div className="bg-black text-white min-h-screen select-none pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* Main Console Container */}
        <div
          className="w-full max-w-[1100px] bg-[#0a0a0a] border border-[#141414] rounded-[24px] grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-[600px] shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(179,255,201,0.02)] relative overflow-hidden"
        >
          {/* Top Tech Accent Glow Line */}
          <div className="absolute top-0 left-[10%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

          {/* Left Controls Nav Panel */}
          <div className="bg-[#0d0d0d] border-b lg:border-b-0 lg:border-r border-[#141414] p-6 sm:p-10 flex flex-col gap-3 rounded-t-[24px] lg:rounded-tr-none lg:rounded-l-[24px]">
            <div className="mb-6 sm:mb-8">
              <h1
                className="text-[11px] uppercase tracking-[0.25em] text-[#555] m-0 font-bold"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Legal System
              </h1>
              <p
                className="text-xl text-white font-medium mt-1 m-0"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Littroi Media
              </p>
            </div>

            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`w-full py-4 px-5 rounded-[14px] text-left text-[13px] font-bold uppercase tracking-[0.05em] flex items-center justify-between transition-all duration-300 relative border ${
                    isActive
                      ? "text-[#B3FFC9] border-[#B3FFC9] bg-[#B3FFC9]/[0.03] shadow-[inset_0_0_20px_rgba(179,255,201,0.05),0_10px_30px_rgba(0,0,0,0.5)]"
                      : "text-[#666] border-[#1a1a1a] bg-transparent hover:text-white hover:border-white/20"
                  }`}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="flex items-center">
                    <span className="text-[10px] opacity-40 mr-3">{tab.num}</span>
                    <span>{tab.label}</span>
                  </span>
                  <span
                    className={`transition-all duration-300 ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Display Screen */}
          <div className="p-6 sm:p-12 lg:p-14 relative flex items-center min-h-[460px]">
            <AnimatePresence mode="wait">
              {activeTab === "terms" && (
                <motion.div
                  key="terms"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full"
                >
                  <div className="inline-flex items-center gap-1.5 bg-[#B3FFC9]/[0.05] border border-[#B3FFC9]/20 text-[#B3FFC9] text-[10px] py-1 px-3 rounded-full uppercase tracking-[0.1em] mb-4">
                    <span className="w-1.5 h-1.5 bg-[#B3FFC9] rounded-full shadow-[0_0_10px_#B3FFC9]" />
                    <span style={{ fontFamily: "'Syne', sans-serif" }}>Operational Document</span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Terms &amp; <br />
                    <span style={{ color: "#B3FFC9" }}>Conditions</span>
                  </h2>

                  <div className="text-[#999] text-[16px] sm:text-[17px] leading-[1.8] font-light max-h-[480px] overflow-y-auto pr-2 space-y-5">
                    <p>
                      By engaging Littroi Media, the Client agrees to our provision of services including, but not limited to, video editing, content strategy, paid advertising, and graphic design. All work remains the property of the Agency until full payment is received. The Client is responsible for providing timely feedback, approvals, and any necessary materials.
                    </p>
                    <p>
                      We offer unlimited revisions within the agreed project scope to ensure client satisfaction. The Agency reserves the right to adjust timelines in response to delayed client communication or payment.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full"
                >
                  <div className="inline-flex items-center gap-1.5 bg-[#B3FFC9]/[0.05] border border-[#B3FFC9]/20 text-[#B3FFC9] text-[10px] py-1 px-3 rounded-full uppercase tracking-[0.1em] mb-4">
                    <span className="w-1.5 h-1.5 bg-[#B3FFC9] rounded-full shadow-[0_0_10px_#B3FFC9]" />
                    <span style={{ fontFamily: "'Syne', sans-serif" }}>Data Security Protocol</span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Privacy <br />
                    <span style={{ color: "#B3FFC9" }}>Policy</span>
                  </h2>

                  <div className="text-[#999] text-[16px] sm:text-[17px] leading-[1.8] font-light max-h-[480px] overflow-y-auto pr-2 space-y-5">
                    <p>
                      At Littroi Media, we are committed to protecting the privacy of our clients. Any personal or business information shared with us—such as contact details, brand assets, or account credentials—will be used solely for the purpose of delivering our services, including video editing, content strategy, paid advertising, and graphic design.
                    </p>
                    <p>
                      We do not sell, share, or distribute client information to third parties without consent, except as required by law. All data is handled securely and confidentially to maintain client trust and project integrity.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "refund" && (
                <motion.div
                  key="refund"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full"
                >
                  <div className="inline-flex items-center gap-1.5 bg-[#B3FFC9]/[0.05] border border-[#B3FFC9]/20 text-[#B3FFC9] text-[10px] py-1 px-3 rounded-full uppercase tracking-[0.1em] mb-4">
                    <span className="w-1.5 h-1.5 bg-[#B3FFC9] rounded-full shadow-[0_0_10px_#B3FFC9]" />
                    <span style={{ fontFamily: "'Syne', sans-serif" }}>Financial Agreement</span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Retainer <br />
                    <span style={{ color: "#B3FFC9" }}>Refund</span>
                  </h2>

                  <div className="text-[#999] text-[16px] sm:text-[17px] leading-[1.8] font-light max-h-[480px] overflow-y-auto pr-2 space-y-5">
                    <p>
                      Retainers paid to Littroi Media are generally refundable for unused services, provided the Client submits a written refund request within 14 days of payment. Refund eligibility is assessed based on the time, resources, and effort already allocated or delivered up to the date of the request.
                    </p>
                    <p>
                      If work has already commenced, a partial refund may be issued at the Agency's discretion, reflecting only the unused portion of the retainer. This policy ensures fairness to all parties while recognizing the value of time and planning dedicated to the Client's project.
                    </p>
                    <p className="text-white font-medium border-l-2 border-[#B3FFC9] pl-4 mt-6">
                      Once a valid refund request is received and approved, refunds will be processed and issued within 7 business days.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "antispam" && (
                <motion.div
                  key="antispam"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full"
                >
                  <div className="inline-flex items-center gap-1.5 bg-[#B3FFC9]/[0.05] border border-[#B3FFC9]/20 text-[#B3FFC9] text-[10px] py-1 px-3 rounded-full uppercase tracking-[0.1em] mb-4">
                    <span className="w-1.5 h-1.5 bg-[#B3FFC9] rounded-full shadow-[0_0_10px_#B3FFC9]" />
                    <span style={{ fontFamily: "'Syne', sans-serif" }}>Communications Protocol</span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Anti-Spam <br />
                    <span style={{ color: "#B3FFC9" }}>Policy</span>
                  </h2>

                  <div className="text-[#999] text-[15px] sm:text-[16px] leading-[1.8] font-light max-h-[480px] overflow-y-auto pr-3 space-y-6">
                    <p>
                      <strong className="text-white font-semibold">Effective Date:</strong> July 25, 2026<br />
                      <strong className="text-white font-semibold">Entity Name:</strong> Littroi Media<br />
                      <strong className="text-white font-semibold">Official Web Properties &amp; Domain Ecosystem:</strong> littroi.media | littroi.com | littroi.us | littroi.uk | littroi.eu
                    </p>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        1. Zero-Tolerance Anti-Spam Policy Statement
                      </h3>
                      <p>
                        Littroi Media maintains a strict zero-tolerance policy regarding the generation, transmission, or facilitation of unsolicited commercial email (UCE), unsolicited bulk email (UBE), or any form of spam.
                      </p>
                      <p className="mt-3">
                        We do not send, authorize, sell, rent, or permit the sending of spam or unsolicited electronic messages promoting our brand, services, products, or digital media properties. Any transmission of email originating from or referencing our domain ecosystem (littroi.media, littroi.com, littroi.us, littroi.uk, littroi.eu) must strictly comply with permission-based standards and international anti-spam laws.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        2. Comprehensive Definition of Prohibited Unsolicited Email
                      </h3>
                      <p>
                        For the purposes of this policy, Littroi Media defines "Spam" or "Unsolicited Email" as any electronic mail message sent to a recipient who has not provided explicit, verifiable prior consent to receive communications from Littroi Media.
                      </p>
                      <p className="mt-3">This prohibition explicitly includes, but is not limited to:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        <li><strong className="text-white font-semibold">Unsolicited Commercial Outreach:</strong> Messages sent to individuals or corporate entities without prior explicit opt-in consent or a legitimate, pre-existing business relationship.</li>
                        <li><strong className="text-white font-semibold">Prohibited Lead Sources:</strong> Emails generated from purchased, rented, scraped, harvested, appended, or third-party co-registration contact lists.</li>
                        <li><strong className="text-white font-semibold">Deceptive Practices:</strong> Messages featuring false, altered, or misleading email headers, From: display names, subject lines, or IP routing data.</li>
                        <li><strong className="text-white font-semibold">Unauthorized Third-Party Marketing:</strong> Any promotion of Littroi Media websites or services conducted by third-party contractors, affiliates, or marketers using spam techniques.</li>
                        <li><strong className="text-white font-semibold">Missing Opt-Out Mechanisms:</strong> Commercial messages lacking a clear, functional unsubscribe method or a valid physical postal address.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        3. Strict Permission &amp; Consent Requirements
                      </h3>
                      <p>Every electronic communication dispatched by or on behalf of Littroi Media must meet strict permission-based criteria:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        <li><strong className="text-white font-semibold">Explicit Opt-In Required:</strong> Recipients must affirmatively grant permission to receive communications via a clear opt-in mechanism (e.g., direct web form submission or explicit written agreement).</li>
                        <li><strong className="text-white font-semibold">Ban on Inferred / Harvested Contacts:</strong> Web scraping, automated email address harvesting, and directory mining are strictly forbidden across all Littroi Media operations.</li>
                        <li><strong className="text-white font-semibold">Sender Transparency:</strong> All emails must unambiguously identify Littroi Media as the sender in both the header fields and message body.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        4. Technical Authentication &amp; Infrastructure Standards
                      </h3>
                      <p>To prevent domain spoofing, domain abuse, and unauthorized email transmission, Littroi Media mandates strict cryptographic authentication across all sending domains:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        <li><strong className="text-white font-semibold">SPF (Sender Policy Framework):</strong> Published SPF records explicitly designate all authorized outbound mail servers for littroi.media, littroi.com, littroi.us, littroi.uk, and littroi.eu.</li>
                        <li><strong className="text-white font-semibold">DKIM (DomainKeys Identified Mail):</strong> Outbound messages carry valid cryptographic DKIM signatures matching the sending domain.</li>
                        <li><strong className="text-white font-semibold">DMARC (Domain-based Message Authentication, Reporting, and Conformance):</strong> Strict DMARC policies (p=reject or p=quarantine) are enforced to prevent fraudulent domain spoofing.</li>
                        <li><strong className="text-white font-semibold">Reverse DNS (PTR):</strong> All sending mail transfer agents (MTAs) maintain valid, matching reverse DNS records.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        5. Mandatory Opt-Out &amp; Suppression Handling
                      </h3>
                      <p>All commercial emails dispatched by Littroi Media include the following mandatory compliance standards:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        <li><strong className="text-white font-semibold">One-Click Unsubscribe:</strong> A clear, conspicuous, and fully functional single-click opt-out link in the footer of every commercial message.</li>
                        <li><strong className="text-white font-semibold">Immediate Suppression Processing:</strong> Unsubscribe requests are processed automatically and immediately upon submission, with permanent address suppression completed within 24 hours (well within legal limits).</li>
                        <li><strong className="text-white font-semibold">No Fees or Barriers:</strong> Recipients are never charged a fee, required to log into an account, or forced to provide additional personal information to unsubscribe.</li>
                        <li><strong className="text-white font-semibold">Physical Sender Identification:</strong> Every message contains a valid physical postal mailing address and active administrative contact details for Littroi Media.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        6. International Legal Compliance Framework
                      </h3>
                      <p>Littroi Media conducts all email activities in strict compliance with applicable global anti-spam, privacy, and data protection laws:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        <li><strong className="text-white font-semibold">United States:</strong> Controlling the Assault of Non-Solicited Pornography and Marketing Act of 2003 (CAN-SPAM Act) and state privacy regulations (CCPA / CPRA).</li>
                        <li><strong className="text-white font-semibold">United Kingdom:</strong> Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR).</li>
                        <li><strong className="text-white font-semibold">European Union:</strong> Directive 2002/58/EC (ePrivacy Directive) and Regulation (EU) 2016/679 (EU GDPR).</li>
                        <li><strong className="text-white font-semibold">Canada:</strong> Canada's Anti-Spam Legislation (CASL).</li>
                        <li><strong className="text-white font-semibold">Australia:</strong> Spam Act 2003.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        7. Partner, Contractor &amp; Affiliate Accountability
                      </h3>
                      <p>Any employee, independent contractor, agency partner, or affiliate marketing entity acting on behalf of Littroi Media must adhere strictly to this policy.</p>
                      <p className="mt-3">Any party found generating unsolicited emails or misrepresenting Littroi Media domains will face:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1.5">
                        <li>Immediate termination of contract and access credentials.</li>
                        <li>Total revocation of affiliate or business partnerships.</li>
                        <li>Referral to relevant legal authorities and anti-spam organizations for domain abuse investigation.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        8. Abuse Reporting &amp; Compliance Contact Information
                      </h3>
                      <p>
                        Littroi Media promptly investigates all reports of potential email abuse or unauthorized domain usage. If you believe you have received an unwanted or suspicious email referencing Littroi Media or any of our domains, please forward the full message along with its complete raw headers to:
                      </p>
                      <div className="text-white font-medium border-l-2 border-[#B3FFC9] pl-4 mt-4 space-y-1.5 bg-white/[0.02] p-4 rounded-r-xl">
                        <p><strong className="text-white">Dedicated Abuse Contact Email:</strong> <a href="mailto:info@littroi.com" className="text-[#B3FFC9] hover:underline">info@littroi.com</a></p>
                        <p><strong className="text-white">Official Website:</strong> <a href="https://littroi.media" target="_blank" rel="noopener noreferrer" className="text-[#B3FFC9] hover:underline">https://littroi.media</a></p>
                        <p className="pt-2"><strong className="text-white">Mailing Address:</strong><br />Littroi Media — Legal &amp; Compliance Department<br />2nd Floor, Luthra Tower, C-56, opp. LIC Building, below Diago Cafe, Ekta Nagar, Bareilly, Uttar Pradesh 243122</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

