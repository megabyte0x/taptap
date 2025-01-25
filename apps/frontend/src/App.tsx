import { ConnectButton } from "arweave-wallet-kit";
import { useActiveAddress } from "arweave-wallet-kit";
import "./App.css";
import IdleTapMiner from "./components/IdleTapMiner.tsx";
import { useState, Suspense, lazy } from "react";

const Confetti = lazy(() => import("./components/Confetti"))

function App() {
  const [gameEnded, setGameEnded] = useState(false);
  const walletAddress = useActiveAddress();

  const handleGameEnd = () => {
    setGameEnded(true);
    setTimeout(() => setGameEnded(false), 3000);
  };

  return (
    <div className="container">
      {gameEnded && (
        <Suspense fallback={null}>
          <Confetti />
        </Suspense>
      )}
      <div className="card">
        <div className={`wallet-button ${!walletAddress ? 'hidden' : ''}`}>
          <ConnectButton profileModal={true} showBalance={true} />
        </div>
        <IdleTapMiner
          onGameEnd={handleGameEnd}
          ConnectButtonComponent={
            !walletAddress ? <ConnectButton profileModal={true} showBalance={true} /> : null
          }
        />
      </div>
    </div>
  );
}

export default App;
