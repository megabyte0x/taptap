import { ConnectButton } from "arweave-wallet-kit";
import { useActiveAddress } from "arweave-wallet-kit";
import "./App.css";
import IdleTapMiner from "./components/IdleTapMiner.tsx";
import Confetti from "./components/Confetti.tsx";
import { useState } from "react";

function App() {
  const [gameEnded, setGameEnded] = useState(false);
  const walletAddress = useActiveAddress();

  const handleGameEnd = () => {
    setGameEnded(true);
    setTimeout(() => setGameEnded(false), 3000);
  };

  return (
    <div className="container">
      {gameEnded && <Confetti />}
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
