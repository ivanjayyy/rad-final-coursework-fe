import React from "react";
import { motion, type Variants } from "framer-motion"; // Added 'type' here
import { Search, MapPin, Bell, Heart, Shield, Camera } from "lucide-react";

// Explicitly typing this as Variants clears the strict .tsx type-check
const comicFadeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, type: "spring", stiffness: 100 },
  },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-yellow-400 font-mono text-black antialiased selection:bg-black selection:text-white relative overflow-x-hidden">
      {/* Halftone Dot Matrix Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_20%,transparent_20%)] [background-size:16px_16px] z-0"></div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 z-10 border-b-8 border-black bg-cyan-400">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_25%,transparent_25%)] [background-size:20px_20px]"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="container mx-auto max-w-4xl text-center z-10"
        >
          {/* Action Burst Badge */}
          <span className="inline-block bg-red-500 text-white font-black text-xs md:text-sm uppercase tracking-widest px-4 py-1.5 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3 mb-6 animate-pulse">
            COMMUNITY ALERT ACTIVATED!
          </span>

          {/* Massive Comic Logo Burst */}
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter uppercase text-black drop-shadow-[6px_6px_0px_rgba(255,255,255,1)] select-none skew-x-[-6deg]">
            PAW
            <span className="text-red-500 bg-white border-4 border-black px-4 inline-block transform rotate-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              LINK!
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-black uppercase tracking-tight mb-12 max-w-2xl mx-auto bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            Reuniting lost pets with their families through the power of the
            community and real-time tech!
          </p>

          {/* Heavy Tactile Action Controls */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="w-full sm:w-auto px-10 py-5 bg-red-500 hover:bg-red-600 text-white font-black text-xl uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-700 cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              🔓Link Start
            </button>
            <button
              onClick={() => (window.location.href = "/register")}
              className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-yellow-100 text-black font-black text-xl uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-700 cursor-pointer"
            >
              📝Create Avatar
            </button>
          </div>
        </motion.div>

        {/* Dynamic Abstract Graphic Elements */}
        <div className="absolute top-12 left-12 w-32 h-32 bg-purple-500 border-4 border-black rounded-none rotate-12 opacity-40 hidden md:block shadow-[4px_4px_0px_0px_#000]"></div>
        <div className="absolute bottom-20 right-12 w-40 h-40 bg-yellow-300 border-4 border-black rounded-none -rotate-12 opacity-60 hidden md:block shadow-[6px_6px_0px_0px_#000]"></div>
      </section>

      {/* 2. HOW IT WORKS (THE PROCESS) */}
      <section className="py-24 bg-white border-b-8 border-black relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={comicFadeVariants}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter bg-yellow-400 inline-block border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] skew-x-[-4deg]">
              How PawLink Works!
            </h2>
          </motion.div>

          {/* Action Cards Grid Matrix */}
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              icon={<Camera size={44} className="text-black stroke-[3]" />}
              badgeColor="bg-red-500 text-white"
              stepNumber="01"
              title="Snap & Upload"
              desc="Take a clear photo of the pet you found or the one you're looking for. Our AI system handles the automatic tactical tagging."
            />
            <StepCard
              icon={<MapPin size={44} className="text-black stroke-[3]" />}
              badgeColor="bg-cyan-400 text-black"
              stepNumber="02"
              title="Pin the Location"
              desc="Drop a precise radar pin where the pet was last seen. Our interactive emergency grid alerts users in a 5-mile local radius."
            />
            <StepCard
              icon={<Bell size={44} className="text-black stroke-[3]" />}
              badgeColor="bg-purple-500 text-white"
              stepNumber="03"
              title="Instant Alerts"
              desc="The exact microsecond a visual match coordinates, both target parties receive instant push sirens and tracking emails."
            />
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES (DETAILED SHOWCASE) */}
      <section className="py-24 bg-purple-600 relative border-b-8 border-black">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_20%,transparent_20%)] [background-size:12px_12px]"></div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-24">
            {/* Feature Block 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={comicFadeVariants}
                className="flex-1 w-full"
              >
                <div className="bg-white border-4 border-black p-8 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
                  <div className="w-14 h-14 bg-cyan-400 border-4 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-6">
                    <Search className="text-black stroke-[3]" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
                    Smart Search Filters
                  </h3>
                  <p className="font-bold text-gray-800 leading-relaxed text-sm">
                    Filter entries instantaneously by specific breed matrix,
                    coat colors, sizing scale, and custom accessories like
                    collars. Our complete active database is indexed on the fly,
                    ensuring that every vital second counts while your pet is on
                    the loose.
                  </p>
                </div>
              </motion.div>

              {/* Illustrated Map Placeholder Mockup */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={comicFadeVariants}
                className="flex-1 w-full h-80 bg-white border-4 border-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative p-4"
              >
                <div className="w-full h-full bg-slate-100 border-2 border-dashed border-black flex flex-col items-center justify-center p-4 relative bg-[linear-gradient(to_right,#ccc_1px,transparent_1px),linear-gradient(to_bottom,#ccc_1px,transparent_1px)] bg-[size:20px_20px]">
                  <div className="absolute top-4 left-6 bg-red-500 text-white font-black text-xs border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                    RADAR ACTIVE
                  </div>
                  <MapPin
                    size={48}
                    className="text-red-500 fill-red-200 animate-bounce mb-2 stroke-[2.5]"
                  />
                  <span className="font-black uppercase tracking-tight text-center text-sm bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_#000]">
                    [ LIVE TRACKER VISUAL OVERLAY ]
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Feature Block 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={comicFadeVariants}
                className="flex-1 w-full"
              >
                <div className="bg-white border-4 border-black p-8 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
                  <div className="w-14 h-14 bg-yellow-400 border-4 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-6">
                    <Shield className="text-black stroke-[3]" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
                    Verified Community Vetting
                  </h3>
                  <p className="font-bold text-gray-800 leading-relaxed text-sm">
                    We maintain absolute zero-tolerance fallback parameters for
                    pet safety operations. Users maintain verified tactical
                    profiles, and regional sightings are carefully crowd-vetted
                    by active field nodes to stop trolls, disinformation
                    networks, or malicious reward scams dead in their tracks.
                  </p>
                </div>
              </motion.div>

              {/* Illustrated Badge Placeholder Mockup */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={comicFadeVariants}
                className="flex-1 w-full h-80 bg-white border-4 border-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative p-4"
              >
                <div className="w-full h-full bg-orange-400 flex flex-col items-center justify-center p-6 border-2 border-black text-center relative">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_15%,transparent_15%)] [background-size:10px_10px]"></div>
                  <div className="bg-white border-4 border-black p-4 transform -rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="font-black text-2xl uppercase tracking-tighter text-black">
                      100% SECURE NODE
                    </h4>
                    <p className="text-xs font-bold text-gray-600 mt-1 uppercase">
                      Anti-Fraud Validation System Passed
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER / CALL TO ACTION PANEL */}
      <footer className="py-20 bg-black text-white text-center relative border-t-4 border-black">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={comicFadeVariants}
          className="container mx-auto px-6 max-w-xl"
        >
          <div className="inline-block p-4 bg-white border-4 border-black rounded-none mb-6 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] transform -rotate-6 hover:rotate-0 transition-transform duration-150">
            <Heart
              className="text-red-500 fill-red-500 stroke-[2.5]"
              size={48}
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter leading-none text-yellow-400 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
            BRINGING THEM HOME, ONE LINK AT A TIME!
          </h2>

          <p className="font-bold text-gray-400 text-sm uppercase tracking-wide mb-12 leading-relaxed bg-neutral-900 border-2 border-neutral-800 p-4">
            PawLink is a non-profit tactical rescue engine open-sourced and
            completely built by dedicated pet lovers. Join our grid array and
            secure your neighborhood safety parameter today.
          </p>

          <div className="inline-block text-xs font-black uppercase tracking-widest text-black bg-yellow-400 border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
            &copy; 2026 PAWLINK RECTIFICATION SYSTEM // MERN PIPELINE
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

/* Explicitly Typed Prop Interface for TypeScript validation safety */
interface StepCardProps {
  icon: React.ReactNode;
  badgeColor: string;
  stepNumber: string;
  title: string;
  desc: string;
}

/* Comic Block Component for How It Works Section */
const StepCard = ({
  icon,
  badgeColor,
  stepNumber,
  title,
  desc,
}: StepCardProps) => (
  <motion.div
    whileHover={{ y: -8, x: -4, transition: { duration: 0.1 } }}
    className="p-8 bg-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-left relative transition-all duration-150 flex flex-col justify-between"
  >
    {/* Floating Counter Badge */}
    <div
      className={`absolute -top-5 -left-5 border-4 border-black font-black px-3 py-1 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${badgeColor}`}
    >
      STAGE {stepNumber}
    </div>

    <div>
      {/* Icon Frame Box */}
      <div className="mb-6 mt-2 w-16 h-16 bg-slate-100 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
        {icon}
      </div>

      <h4 className="text-2xl font-black uppercase tracking-tight mb-3 text-black">
        {title}
      </h4>

      <p className="text-gray-700 font-bold text-xs leading-relaxed uppercase">
        {desc}
      </p>
    </div>
  </motion.div>
);

export default Home;
