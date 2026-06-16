import { motion } from "framer-motion";
import { Search, MapPin, Bell, Heart, Shield, Camera } from "lucide-react";

const Start = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-indigo-600 to-purple-700 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            Paw<span className="text-orange-400">Link</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-90">
            Reuniting lost pets with their families through the power of
            community and real-time tech.
          </p>
          <div className="flex gap-4 justify-center">
            <div className="px-8 py-4 bg-orange-500 rounded-full font-bold cursor-pointer hover:bg-orange-600 transition" onClick={() => window.location.href = "/create"}>
              Report a Pet
            </div>
            <div className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold cursor-pointer hover:bg-white/20 transition">
              Browse Map
            </div>
          </div>
        </motion.div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* 2. HOW IT WORKS (THE PROCESS) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How PawLink Works</h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              icon={<Camera size={40} className="text-orange-500" />}
              title="Snap & Upload"
              desc="Take a clear photo of the pet you found or the one you're looking for. Our AI handles the tagging."
            />
            <StepCard
              icon={<MapPin size={40} className="text-indigo-600" />}
              title="Pin the Location"
              desc="Drop a pin where the pet was last seen. Our interactive map alerts users in a 5-mile radius."
            />
            <StepCard
              icon={<Bell size={40} className="text-purple-600" />}
              title="Instant Alerts"
              desc="The moment a match is found, both parties receive instant push notifications and emails."
            />
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES (DETAILED) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-32">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <motion.div {...fadeIn} className="flex-1">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <Search className="text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    Smart Search Filters
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Filter by breed, color, size, and collar type. Our database
                    is indexed in real-time, ensuring that every second counts
                    when a pet is missing.
                  </p>
                </div>
              </motion.div>
              <motion.div
                {...fadeIn}
                className="flex-1 h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-inner"
              >
                {/* Placeholder for an app screenshot/illustration */}
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                  Image: Map UI showing pet icons
                </div>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <motion.div {...fadeIn} className="flex-1">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-orange-100 border border-slate-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    Verified Community
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    We prioritize pet safety. Users can verify their profiles,
                    and sightings are vetted by the community to prevent
                    misinformation or scams.
                  </p>
                </div>
              </motion.div>
              <motion.div
                {...fadeIn}
                className="flex-1 h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-inner"
              >
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                  Image: Community verification badges
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER / CALL TO ACTION */}
      <footer className="py-20 bg-slate-900 text-white text-center">
        <motion.div {...fadeIn} className="container mx-auto px-6">
          <Heart className="mx-auto mb-6 text-red-500 fill-red-500" size={48} />
          <h2 className="text-4xl font-bold mb-8">
            Bringing them home, one link at a time.
          </h2>
          <p className="opacity-60 mb-12 max-w-lg mx-auto">
            PawLink is a non-profit initiative built by pet lovers. Join our
            network and help keep our furry friends safe.
          </p>
          <div className="text-sm opacity-40 uppercase tracking-widest font-semibold">
            &copy; 2026 PawLink MERN Project
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

const StepCard = (props: { icon: React.ReactNode; title: string; desc: string }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="p-8 bg-white rounded-2xl border border-slate-100 shadow-lg text-center"
  >
    <div className="mb-6 flex justify-center">{props.icon}</div>
    <h4 className="text-xl font-bold mb-3">{props.title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed">{props.desc}</p>
  </motion.div>
);

export default Start;
