import { useState } from "react";
import { getContract } from "../utils/contract";

export default function MintBFT({ signer }: { signer: any }) {
  const [uri, setUri] = useState("");

  const mint = async () => {
    const contract = getContract(signer);
    try {
      const tx = await contract.mintBFT(uri);
      await tx.wait();
      alert("BFT creato!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="my-4">
      <h5>Mint BFT</h5>
      <input
        className="form-control mb-2"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        placeholder="IPFS URI o descrizione"
      />
      <button className="btn btn-success" onClick={mint}>Crea</button>
    </div>
  );
}
