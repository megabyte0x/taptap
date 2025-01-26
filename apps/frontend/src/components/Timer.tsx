import { motion } from "framer-motion"
import "../styles/Timer.css"

interface TimerProps {
  timeLeft: number
}

export default function Timer({ timeLeft }: TimerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="timer"
    >
      Mining Time: {timeLeft}s
    </motion.div>
  )
}

