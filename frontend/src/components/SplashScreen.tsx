import { motion } from "motion/react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div className="fixed inset-0 bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 flex items-center justify-center z-50" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onAnimationComplete={() => setTimeout(onComplete, 2000)}>
      <div className="flex flex-col items-center gap-6">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}><div className="bg-white rounded-3xl p-8 shadow-2xl"><img src={logoImage} alt="어디가개" className="h-40" /></div></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}><img src={logoImage} alt="어디가개" className="h-20" /></motion.div>
      </div>
    </motion.div>
  );
}