import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import "./Score.css"

interface ScoreProps {
  score: number
}

export default function Score({ score }: ScoreProps) {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 },
    })
  }, [score, controls])

  return (
    <motion.div animate={controls} className="score">
      <svg className="score-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 6V12L16 14" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      $TAP Mined: {score}
    </motion.div>
  )
}

