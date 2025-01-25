import { motion } from "framer-motion"
import "../styles/CoinEffect.css"

interface CoinEffectProps {
  x: number
  y: number
}

export default function CoinEffect({ x, y }: CoinEffectProps) {
  return (
    <motion.div
      className="coin-effect"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, scale: 0 }}
      animate={{
        opacity: 0,
        scale: 1.5,
        y: -100
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#FFD700" stroke="#B45309" strokeWidth="2" />
        <circle cx="20" cy="20" r="15" fill="#FFC800" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#4B0082"
          fontSize="16"
          fontWeight="bold"
        >
          $TAP
        </text>
      </svg>
    </motion.div>
  )
}

