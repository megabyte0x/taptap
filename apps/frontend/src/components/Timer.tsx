import { motion } from "framer-motion"
import "../styles/Timer.css"

interface TimerProps {
  timeLeft: number
}

export default function Timer({ timeLeft }: TimerProps) {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="timer">
      Mining Time: {timeLeft}s
    </motion.div>
  )
}

