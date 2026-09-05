import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  RefreshCcw,
  MailCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText
} from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";

export function LegalPolicies() {
  const [activeTab, setActiveTab] = useState("terms");
  const [openFaq, setOpenFaq] = useState(null);

  const tabTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  const tabs = [
    { id: "terms", num: "01//", label: "Terms & Conditions", icon: FileText },
    { id: "privacy", num: "02//", label: "Privacy Policy", icon: Lock },
    { id: "refund", num: "03//", label: "Retainer Refund", icon: RefreshCcw },
    { id: "antispam", num: "04//", label: "Anti-Spam Policy", icon: MailCheck },
  ];

  const faqs = [
    {
      question: "How do I request a retainer refund for unused services?",
      answer:
        "Retainers paid to Littroi Media are eligible for a refund on unused portions if requested in writing within 14 days of payment. You can submit your request directly to info@littroi.com. Once approved, refunds are processed and issued back to the original payment method within 7 business days.",
    },
    {
      question: "Who retains copyright over final video deliverables and creative assets?",
      answer:
        "All creative assets, raw footage, and final video masters become the full property of the client upon receipt of final invoice settlement. Littroi Media retains the non-exclusive right to showcase published project work in our portfolio, case studies, and showreels unless an explicit NDA or confidentiality waiver is executed.",
    },
    {
      question: "How does Littroi Media protect client proprietary data and video footage?",
      answer:
        "We enforce enterprise-grade storage encryption, restricted role-based editor access, and strict internal confidentiality agreements. We never sell, lease, or monetize client footage, contact details, or brand analytics with any third-party data broker.",
    },
    {
      question: "How do you enforce zero-tolerance anti-spam compliance across all domains?",
      answer:
        "Every domain in the Littroi ecosystem (littroi.media, littroi.com, littroi.us, littroi.uk, littroi.eu) is protected by strict SPF records, 2048-bit DKIM cryptographic signatures, and DMARC enforcement policies. We prohibit third-party list scraping and process all opt-out requests instantly within 24 hours.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <SEO
        title="Legal Policies — Littroi Media"
        description="Official terms of service, privacy protections, retainer refund policy, and zero-tolerance anti-spam standards of Littroi Media."
        canonical="/legal-policies"
      />

      <div className="bg-black text-white min-h-screen select-none overflow-hidden">

        {/* ==================== 1. PAGE HERO HEADER ==================== */}
        <section className="pt-32 sm:pt-44 pb-12 sm:pb-16 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span
              className="text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-white hover:text-[#B3FFC9] transition-colors duration-300 cursor-pointer select-none inline-block"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              — LEGAL &amp; PRIVACY
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 sm:gap-14">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <h1
                className="m-0 text-white tracking-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                Legal<br />
                <span style={{ color: "#B3FFC9" }}>Policies</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[480px] md:pb-2"
            >
              <p
                className="m-0"
                style={{
                  fontFamily: "'benzine', 'Benzin', sans-serif",
                  fontSize: "13px",
                  fontWeight: 200,
                  lineHeight: "22px",
                  color: "#FFFFFF94",
                }}
              >
                Operational agreements, client privacy protocols, retainer refund terms, and strict global anti-spam compliance across all Littroi properties.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ==================== 2. MAIN INTERACTIVE CONSOLE ==================== */}
        <section className="pb-20 sm:pb-28 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="w-full bg-[#0a0a0a] border border-[#181818] rounded-[24px] grid grid-cols-1 lg:grid-cols-[340px_1fr] shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(179,255,201,0.02)] relative overflow-hidden">
            {/* Top Accent Tech Line */}
            <div className="absolute top-0 left-[10%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

            {/* Left Controls Nav Panel */}
            <div className="bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-[#181818] p-6 sm:p-10 flex flex-col justify-between gap-6 rounded-t-[24px] lg:rounded-tr-none lg:rounded-l-[24px]">
              <div>
                <div className="mb-6 sm:mb-8">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-[#666] font-bold block"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Compliance Engine
                  </span>
                  <p
                    className="text-xl text-white font-bold mt-1 m-0"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Littroi Media
                  </p>
                </div>

                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                        className={`w-full py-4 px-5 rounded-[14px] text-left text-[13px] font-bold uppercase tracking-[0.05em] flex items-center justify-between transition-all duration-300 relative border cursor-pointer ${isActive
                          ? "text-[#B3FFC9] border-[#B3FFC9] bg-[#B3FFC9]/[0.05] shadow-[inset_0_0_20px_rgba(179,255,201,0.05),0_10px_30px_rgba(0,0,0,0.5)]"
                          : "text-[#777] border-[#1a1a1a] bg-transparent hover:text-white hover:border-white/20"
                          }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={16} className={isActive ? "text-[#B3FFC9]" : "text-[#555]"} />
                          <span>{tab.label}</span>
                        </span>
                        <span
                          className={`transition-all duration-300 ${isActive ? "opacity-100 translate-x-0 text-[#B3FFC9]" : "opacity-0 -translate-x-2"
                            }`}
                        >
                          →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Policy Document Display */}
            <div className="p-6 sm:p-10 lg:p-14 relative flex items-start min-h-[520px] bg-[#090909]">
              <AnimatePresence mode="wait">
                {activeTab === "terms" && (
                  <motion.div
                    key="terms"
                    {...tabTransition}
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

                    <div
                      className="text-[#d1d5db] text-[14px] sm:text-[15px] leading-[24px] font-light space-y-5"
                      style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}
                    >
                      <p>
                        By engaging Littroi Media, the Client agrees to our provision of services including, but not limited to, video editing, content strategy, paid advertising, and graphic design. All work remains the property of the Agency until full payment is received. The Client is responsible for providing timely feedback, approvals, and any necessary materials.
                      </p>
                      <p>
                        We offer unlimited revisions within the agreed project scope to ensure client satisfaction. The Agency reserves the right to adjust timelines in response to delayed client communication or payment.
                      </p>
                      <p className="border-l-2 border-[#B3FFC9] pl-4 mt-6 text-white font-medium bg-white/[0.02] p-4 rounded-r-xl">
                        All final delivered video files and creative assets transfer to 100% Client ownership upon complete invoice clearance.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "privacy" && (
                  <motion.div
                    key="privacy"
                    {...tabTransition}
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

                    <div
                      className="text-[#d1d5db] text-[14px] sm:text-[15px] leading-[24px] font-light space-y-5"
                      style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}
                    >
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
                    {...tabTransition}
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

                    <div
                      className="text-[#d1d5db] text-[14px] sm:text-[15px] leading-[24px] font-light space-y-5"
                      style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}
                    >
                      <p>
                        Retainers paid to Littroi Media are generally refundable for unused services, provided the Client submits a written refund request within 14 days of payment. Refund eligibility is assessed based on the time, resources, and effort already allocated or delivered up to the date of the request.
                      </p>
                      <p>
                        If work has already commenced, a partial refund may be issued at the Agency's discretion, reflecting only the unused portion of the retainer. This policy ensures fairness to all parties while recognizing the value of time and planning dedicated to the Client's project.
                      </p>
                      <p
                        className="text-white font-medium border-l-2 border-[#B3FFC9] pl-4 mt-6 bg-white/[0.02] p-4 rounded-r-xl"
                        style={{ color: "#ffffff", fontWeight: 500 }}
                      >
                        Once a valid refund request is received and approved, refunds will be processed and issued within 7 business days.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "antispam" && (
                  <motion.div
                    key="antispam"
                    {...tabTransition}
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

                    <div
                      className="text-[#d1d5db] text-[14px] sm:text-[15px] leading-[24px] font-light space-y-6"
                      style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}
                    >
                      <p>
                        <strong className="text-white font-semibold">Effective Date:</strong> July 25, 2026<br />
                        <strong className="text-white font-semibold">Entity Name:</strong> Littroi Media<br />
                        <strong className="text-white font-semibold">Official Web Properties &amp; Domain Ecosystem:</strong> littroi.media | littroi.com | littroi.us | littroi.uk | littroi.eu
                      </p>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
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
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          2. Comprehensive Definition of Prohibited Unsolicited Email
                        </h3>
                        <p>
                          For the purposes of this policy, Littroi Media defines "Spam" or "Unsolicited Email" as any electronic mail message sent to a recipient who has not provided explicit, verifiable prior consent to receive communications from Littroi Media.
                        </p>
                        <p className="mt-3">This prohibition explicitly includes, but is not limited to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li><strong className="text-white font-semibold">Unsolicited Commercial Outreach:</strong> Messages sent to individuals or corporate entities without prior explicit opt-in consent or a legitimate, pre-existing business relationship.</li>
                          <li><strong className="text-white font-semibold">Prohibited Lead Sources:</strong> Emails generated from purchased, rented, scraped, harvested, appended, or third-party co-registration contact lists.</li>
                          <li><strong className="text-white font-semibold">Deceptive Practices:</strong> Messages featuring false, altered, or misleading email headers, From: display names, subject lines, or IP routing data.</li>
                          <li><strong className="text-white font-semibold">Unauthorized Third-Party Marketing:</strong> Any promotion of Littroi Media websites or services conducted by third-party contractors, affiliates, or marketers using spam techniques.</li>
                          <li><strong className="text-white font-semibold">Missing Opt-Out Mechanisms:</strong> Commercial messages lacking a clear, functional unsubscribe method or a valid physical postal address.</li>
                        </ul>
                      </div>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          3. Strict Permission &amp; Consent Requirements
                        </h3>
                        <p>Every electronic communication dispatched by or on behalf of Littroi Media must meet strict permission-based criteria:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li><strong className="text-white font-semibold">Explicit Opt-In Required:</strong> Recipients must affirmatively grant permission to receive communications via a clear opt-in mechanism (e.g., direct web form submission or explicit written agreement).</li>
                          <li><strong className="text-white font-semibold">Ban on Inferred / Harvested Contacts:</strong> Web scraping, automated email address harvesting, and directory mining are strictly forbidden across all Littroi Media operations.</li>
                          <li><strong className="text-white font-semibold">Sender Transparency:</strong> All emails must unambiguously identify Littroi Media as the sender in both the header fields and message body.</li>
                        </ul>
                      </div>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          4. Technical Authentication &amp; Infrastructure Standards
                        </h3>
                        <p>To prevent domain spoofing, domain abuse, and unauthorized email transmission, Littroi Media mandates strict cryptographic authentication across all sending domains:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li><strong className="text-white font-semibold">SPF (Sender Policy Framework):</strong> Published SPF records explicitly designate all authorized outbound mail servers for littroi.media, littroi.com, littroi.us, littroi.uk, and littroi.eu.</li>
                          <li><strong className="text-white font-semibold">DKIM (DomainKeys Identified Mail):</strong> Outbound messages carry valid cryptographic DKIM signatures matching the sending domain.</li>
                          <li><strong className="text-white font-semibold">DMARC (Domain-based Message Authentication, Reporting, and Conformance):</strong> Strict DMARC policies (p=reject or p=quarantine) are enforced to prevent fraudulent domain spoofing.</li>
                          <li><strong className="text-white font-semibold">Reverse DNS (PTR):</strong> All sending mail transfer agents (MTAs) maintain valid, matching reverse DNS records.</li>
                        </ul>
                      </div>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          5. Mandatory Opt-Out &amp; Suppression Handling
                        </h3>
                        <p>All commercial emails dispatched by Littroi Media include the following mandatory compliance standards:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li><strong className="text-white font-semibold">One-Click Unsubscribe:</strong> A clear, conspicuous, and fully functional single-click opt-out link in the footer of every commercial message.</li>
                          <li><strong className="text-white font-semibold">Immediate Suppression Processing:</strong> Unsubscribe requests are processed automatically and immediately upon submission, with permanent address suppression completed within 24 hours (well within legal limits).</li>
                          <li><strong className="text-white font-semibold">No Fees or Barriers:</strong> Recipients are never charged a fee, required to log into an account, or forced to provide additional personal information to unsubscribe.</li>
                          <li><strong className="text-white font-semibold">Physical Sender Identification:</strong> Every message contains a valid physical postal mailing address and active administrative contact details for Littroi Media.</li>
                        </ul>
                      </div>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          6. International Legal Compliance Framework
                        </h3>
                        <p>Littroi Media conducts all email activities in strict compliance with applicable global anti-spam, privacy, and data protection laws:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li><strong className="text-white font-semibold">United States:</strong> Controlling the Assault of Non-Solicited Pornography and Marketing Act of 2003 (CAN-SPAM Act) and state privacy regulations (CCPA / CPRA).</li>
                          <li><strong className="text-white font-semibold">United Kingdom:</strong> Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR).</li>
                          <li><strong className="text-white font-semibold">European Union:</strong> Directive 2002/58/EC (ePrivacy Directive) and Regulation (EU) 2016/679 (EU GDPR).</li>
                          <li><strong className="text-white font-semibold">Canada:</strong> Canada's Anti-Spam Legislation (CASL).</li>
                          <li><strong className="text-white font-semibold">Australia:</strong> Spam Act 2003.</li>
                        </ul>
                      </div>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          7. Partner, Contractor &amp; Affiliate Accountability
                        </h3>
                        <p>Any employee, independent contractor, agency partner, or affiliate marketing entity acting on behalf of Littroi Media must adhere strictly to this policy.</p>
                        <p className="mt-3">Any party found generating unsolicited emails or misrepresenting Littroi Media domains will face:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li>Immediate termination of contract and access credentials.</li>
                          <li>Total revocation of affiliate or business partnerships.</li>
                          <li>Referral to relevant legal authorities and anti-spam organizations for domain abuse investigation.</li>
                        </ul>
                      </div>

                      <div>
                        <h3
                          className="text-[17px] sm:text-[18px] font-bold text-white mb-2"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          8. Abuse Reporting &amp; Compliance Contact Information
                        </h3>
                        <p>
                          Littroi Media promptly investigates all reports of potential email abuse or unauthorized domain usage. If you believe you have received an unwanted or suspicious email referencing Littroi Media or any of our domains, please forward the full message along with its complete raw headers to:
                        </p>
                        <div
                          className="text-white font-medium border-l-2 border-[#B3FFC9] pl-4 mt-4 space-y-2 bg-white/[0.02] p-4 rounded-r-xl"
                          style={{ color: "#ffffff", fontWeight: 500, borderLeft: "2px solid #B3FFC9", paddingLeft: "15px", marginTop: "1.5rem" }}
                        >
                          <p><strong className="text-white">Dedicated Abuse Contact Email:</strong> <a href="mailto:info@littroi.com" className="text-[#B3FFC9] hover:underline" style={{ color: "#B3FFC9", textDecoration: "none" }}>info@littroi.com</a></p>
                          <p><strong className="text-white">Official Website:</strong> <a href="https://littroi.media" target="_blank" rel="noopener noreferrer" className="text-[#B3FFC9] hover:underline" style={{ color: "#B3FFC9", textDecoration: "none" }}>https://littroi.media</a></p>
                          <p className="pt-2"><strong className="text-white">Mailing Address:</strong><br />Littroi Media — Legal &amp; Compliance Department<br />2nd Floor, Luthra Tower, C-56, opp. LIC Building, below Diago Cafe, Ekta Nagar, Bareilly, Uttar Pradesh 243122</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </FadeIn>
        </section>

        {/* ==================== 3. COMPLIANCE PILLARS GRID (TRUST & SECURITY) ==================== */}
        <section className="pb-16 sm:pb-24 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="mb-12">
              <span
                className="text-xs font-mono tracking-[0.2em] uppercase text-[#B3FFC9] font-bold block mb-3"
              >
                Trust &amp; Security
              </span>
              <h2
                className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight m-0"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Core Compliance <span style={{ color: "#B3FFC9" }}>Guarantees</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Zero Data Resale",
                  desc: "Complete privacy and confidentiality for all client media assets, raw footage, and account analytics.",
                },
                {
                  icon: RefreshCcw,
                  title: "14-Day Refund Terms",
                  desc: "Fair, transparent refunds for unused project retainers with prompt 7-day reimbursement processing.",
                },
                {
                  icon: MailCheck,
                  title: "Anti-Spam Security",
                  desc: "Strict cryptographic SPF, DKIM, and DMARC enforcement with immediate one-click unsubscribe links.",
                },
                {
                  icon: Lock,
                  title: "Global Regulatory Scope",
                  desc: "Full compliance with CAN-SPAM, GDPR (EU/UK), PECR, CASL (Canada), and Australian Spam Act 2003.",
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#B3FFC9]/30 transition-all duration-300 group shadow-lg hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#B3FFC9]/10 flex items-center justify-center text-[#B3FFC9] mb-5 group-hover:scale-110 transition-transform">
                      <IconComponent size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed m-0" style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </section>

        {/* ==================== 4. LEGAL FAQ ACCORDION SECTION ==================== */}
        <section className="pb-16 sm:pb-24 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* FAQ Left Heading */}
            <div className="lg:col-span-5 space-y-4">
              <FadeIn direction="left">
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#B3FFC9] font-bold block">
                  Common Questions
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Frequently Asked <br />
                  <span style={{ color: "#B3FFC9" }}>Questions</span>
                </h2>
                <p
                  className="text-sm text-white/60 leading-relaxed"
                  style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}
                >
                  Everything you need to know about our service agreements, data protection protocols, and retainer policies.
                </p>
              </FadeIn>
            </div>

            {/* FAQ Right Accordion Items */}
            <div className="lg:col-span-7 space-y-4">
              <FadeIn direction="right" delay={0.2}>
                <div className="space-y-4">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden transition-colors duration-300"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          type="button"
                          className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <span
                            className="text-base sm:text-lg font-bold text-white tracking-tight"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {faq.question}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 shrink-0">
                            {isOpen ? <ChevronUp size={16} className="text-[#B3FFC9]" /> : <ChevronDown size={16} />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <div className="px-6 pb-6 pt-2 border-t border-white/5 text-sm sm:text-[15px] text-white/70 leading-relaxed" style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}>
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ==================== 5. BOTTOM CONTACT / LEGAL CTA ==================== */}
        <section className="pb-20 sm:pb-28 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left max-w-xl">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B3FFC9] font-bold">
                  Need Custom Terms or Direct Assistance?
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Speak with our Legal &amp; Compliance Team
                </h3>
                <p className="text-sm text-white/60 m-0" style={{ fontFamily: "'benzine', 'Benzin', sans-serif" }}>
                  Whether you require custom enterprise agreements, master service contracts, or compliance documentation, we’re here to help.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
                <Link
                  to="/contact-us"
                  className="px-6 py-3.5 rounded-full bg-[#B3FFC9] hover:bg-[#9effba] text-black font-bold text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-[0_0_25px_rgba(179,255,201,0.25)]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span>Contact Us</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="mailto:info@littroi.com"
                  className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2 border border-white/10"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span>Email Legal</span>
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

      </div>
    </>
  );
}
