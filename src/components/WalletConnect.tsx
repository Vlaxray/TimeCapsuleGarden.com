import { useState } from "react";
import { ethers, BrowserProvider } from "ethers";

export default function WalletConnect({ onConnect }: { onConnect: (signer: any, address: string) => void }) {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      onConnect(signer, addr);
    } else {
      alert("MetaMask non trovato");
    }
  };

  return (
    <div className="my-3">
      <button className="btn btn-primary" onClick={connectWallet}>
        {address ? `Connesso: ${address.slice(0, 6)}...` : "Connetti Wallet"}
      </button>
    </div>
  );
}
