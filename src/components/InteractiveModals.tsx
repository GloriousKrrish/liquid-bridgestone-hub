import React, { useState } from "react";
import { useModals } from "@/lib/ModalContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  X, Calendar, Clock, User, Phone, Mail, Building,
  CheckCircle2, QrCode, Shield, Loader2, Lock, Sparkles,
} from "lucide-react";

export function InteractiveModals() {
  const { bookingDetails, isBookingOpen, closeBooking, isPartnerLoginOpen, closePartnerLogin, isFleetDeskOpen, closeFleetDesk } = useModals();
  return (
    <>
      {isBookingOpen && bookingDetails && <BookingModal details={bookingDetails} onClose={closeBooking} />}
      {isPartnerLoginOpen && <PartnerPortalModal onClose={closePartnerLogin} />}
      {isFleetDeskOpen && <FleetDeskModal onClose={closeFleetDesk} />}
    </>
  );
}

// BOOKING MODAL
function BookingModal({ details, onClose }: { details: { dealerName: string; tyreName?: string; price?: string }; onClose: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [selectedDay, setSelectedDay] = useState("08 Jun");
  const [selectedTime, setSelectedTime] = useState("11:30 AM");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setStep("loading");
    setTimeout(() => {
      setBookingId(`BRD-${Math.floor(100000 + Math.random() * 900000)}-PUN`);
      setStep("success");
    }, 1500);
  };

  return (
    <ModalWrapper onClose={onClose}>
      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold block mb-1">{t("book_fitment_slot")}</span>
            <h3 className="text-xl font-light text-white leading-snug">
              Scheduling Fitment at <span className="font-semibold text-[#D71920]">{details.dealerName}</span>
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Selected SKU: <span className="text-white font-medium">{details.tyreName || "Turanza 6i"}</span> {details.price ? `(${details.price})` : ""}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">Select Calendar Day</label>
              <div className="grid grid-cols-4 gap-2">
                {[{ date: "08 Jun", day: "Mon" }, { date: "09 Jun", day: "Tue" }, { date: "10 Jun", day: "Wed" }, { date: "11 Jun", day: "Thu" }].map((d) => (
                  <button key={d.date} type="button" onClick={() => setSelectedDay(d.date)}
                    className={`border rounded-2xl py-2 flex flex-col items-center transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none ${selectedDay === d.date ? "border-[#D71920] bg-[#D71920]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}>
                    <span className="text-[9px] font-light uppercase">{d.day}</span>
                    <span className="text-xs font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map((time) => (
                  <button key={time} type="button" onClick={() => setSelectedTime(time)}
                    className={`border rounded-2xl py-2 text-center text-xs transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none ${selectedTime === time ? "border-[#D71920] bg-[#D71920]/10 text-white font-semibold" : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">Contact Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="text" required placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-[#D71920]/50 focus:ring-1 focus:ring-[#D71920]/30 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none transition-all placeholder:text-white/20" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="tel" required placeholder="e.g. +91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-[#D71920]/50 focus:ring-1 focus:ring-[#D71920]/30 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none transition-all placeholder:text-white/20" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#D71920] hover:bg-[#B5141A] rounded-full py-3.5 text-white uppercase tracking-widest text-xs font-bold transition-all shadow-[0_4px_20px_rgba(204,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer">
            Confirm Appointment
          </button>
        </form>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-[#D71920]" size={42} strokeWidth={1.5} />
          <p className="text-white/60 text-sm font-light uppercase tracking-widest">Securing appointment slot...</p>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-4 space-y-6">
          <div className="flex justify-center">
            <div className="bg-[#D71920]/10 rounded-full p-4 border border-[#D71920]/20 animate-bounce">
              <CheckCircle2 className="text-[#D71920]" size={36} />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-light text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("booking_confirmed")}</h4>
            <p className="text-xs text-white/40">Present this digital voucher at the fitment centre.</p>
          </div>

          <div className="liquid-glass border border-white/10 rounded-2xl p-5 text-left max-w-sm mx-auto space-y-3">
            <div className="flex justify-between items-start border-b border-white/10 pb-2">
              <div>
                <span className="text-[8px] uppercase tracking-widest text-white/40 block">Fitment Location</span>
                <span className="text-white text-sm font-semibold">{details.dealerName}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] uppercase tracking-widest text-white/40 block">Booking ID</span>
                <span className="text-white text-xs font-mono font-bold">{bookingId}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 py-1">
              <div><span className="text-[8px] uppercase tracking-widest text-white/40 block">Appt Date</span><span className="text-white text-xs font-semibold">{selectedDay}</span></div>
              <div><span className="text-[8px] uppercase tracking-widest text-white/40 block">Appt Time</span><span className="text-white text-xs font-semibold">{selectedTime}</span></div>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-center">
              <div><span className="text-[8px] uppercase tracking-widest text-white/40 block">Tyre Match</span><span className="text-white text-xs font-medium">{details.tyreName || "Turanza 6i"}</span></div>
              <div className="bg-[#D71920] text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">VERIFIED</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white p-5 rounded-2xl w-40 h-40 mx-auto border border-white/10 shadow-sm">
            <QrCode className="text-slate-900" size={100} strokeWidth={1.2} />
            <span className="text-[8px] font-bold text-slate-900 uppercase tracking-wider mt-2">BRD SECURE VOUCHER</span>
          </div>

          <button type="button" onClick={onClose} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 text-white uppercase tracking-widest text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer">
            {t("close")}
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}

// PARTNER PORTAL MODAL
function PartnerPortalModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"dealer" | "fleet">("dealer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(activeTab === "dealer" ? "Access Authorized. Redirecting to Bridgestone Select Partner dashboard..." : "Access Authorized. Redirecting to Toteline Fleet Enterprise Console...");
      setTimeout(() => onClose(), 2000);
    }, 1500);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold block mb-1">{t("partner_portal")}</span>
          <h3 className="text-3xl font-light text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("partner_login")}</h3>
        </div>

        {successMsg ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <Loader2 className="animate-spin text-[#D71920]" size={32} />
            <p className="text-white text-sm font-semibold">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-2 bg-white/5 p-1 rounded-2xl border border-white/10" role="tablist">
              {(["dealer", "fleet"] as const).map((tab) => (
                <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}
                  className={`py-2 text-center text-xs font-semibold rounded-xl uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none ${activeTab === tab ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"}`}>
                  {tab === "dealer" ? t("dealer_login") : t("operator_login")}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">{t("username")}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input type="text" required placeholder={activeTab === "dealer" ? "Select Store ID or Email" : "Enterprise Client Code"} value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-[#D71920]/50 focus:ring-1 focus:ring-[#D71920]/30 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none transition-all placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold">{t("password")}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-[#D71920]/50 focus:ring-1 focus:ring-[#D71920]/30 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none transition-all placeholder:text-white/20" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#D71920] hover:bg-[#B5141A] disabled:bg-white/10 disabled:text-white/30 rounded-full py-3.5 text-white uppercase tracking-widest text-xs font-bold transition-all shadow-[0_4px_20px_rgba(204,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer">
              {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : t("login")}
            </button>
          </form>
        )}
      </div>
    </ModalWrapper>
  );
}

// FLEET DESK MODAL
function FleetDeskModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fleetSize, setFleetSize] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email || !phone || !fleetSize) return;
    setStep("loading");
    setTimeout(() => setStep("success"), 1500);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#D71920]/50 focus:ring-1 focus:ring-[#D71920]/30 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none transition-all placeholder:text-white/20";

  return (
    <ModalWrapper onClose={onClose}>
      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold block mb-1">Enterprise Solutions</span>
            <h3 className="text-3xl font-light text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("talk_to_fleet")}</h3>
            <p className="text-xs text-white/40 mt-1">Request a full Toteline fleet telematics integration study.</p>
          </div>
          <div className="space-y-3.5">
            <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">{t("name")}</label>
              <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} /><input type="text" required placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></div></div>
            <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">{t("company")}</label>
              <div className="relative"><Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} /><input type="text" required placeholder="Logistics Corp Name" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} /></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">{t("email")}</label>
                <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} /><input type="email" required placeholder="corp@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div></div>
              <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">{t("phone")}</label>
                <div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} /><input type="tel" required placeholder="+91 90000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} /></div></div>
            </div>
            <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">Estimated Fleet Size</label>
              <input type="number" required placeholder="Number of vehicles" value={fleetSize} onChange={(e) => setFleetSize(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#D71920]/50 focus:ring-1 focus:ring-[#D71920]/30 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none transition-all placeholder:text-white/20" /></div>
          </div>
          <button type="submit" className="w-full bg-[#D71920] hover:bg-[#B5141A] rounded-full py-3.5 text-white uppercase tracking-widest text-xs font-bold transition-all shadow-[0_4px_20px_rgba(204,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer">
            Submit Integration Request
          </button>
        </form>
      )}
      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-[#D71920]" size={42} strokeWidth={1.5} />
          <p className="text-white/60 text-sm font-light uppercase tracking-widest">Registering Request...</p>
        </div>
      )}
      {step === "success" && (
        <div className="text-center py-6 space-y-6">
          <div className="flex justify-center"><div className="bg-[#D71920]/10 rounded-full p-4 border border-[#D71920]/20"><Sparkles className="text-[#D71920]" size={36} /></div></div>
          <div className="space-y-2">
            <h4 className="text-2xl font-light text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Request Received</h4>
            <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">Thank you, <span className="text-white font-semibold">{name}</span>. A Bridgestone Toteline consultant has been assigned to <span className="text-white font-semibold">{company}</span>.</p>
            <p className="text-[11px] text-[#D71920] font-semibold mt-2">Expect a briefing callback within 2 business hours.</p>
          </div>
          <button type="button" onClick={onClose} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 text-white uppercase tracking-widest text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer">{t("close")}</button>
        </div>
      )}
    </ModalWrapper>
  );
}

// MODAL WRAPPER
function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-350" role="dialog" aria-modal="true">
      <div className="liquid-glass rounded-3xl p-6 md:p-8 max-w-md w-full relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close dialog" className="absolute right-4 top-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none">
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

