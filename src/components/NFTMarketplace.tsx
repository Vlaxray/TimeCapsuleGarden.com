import { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import { formatEther, parseEther } from "ethers";

type Listing = {
  tokenId: number;
  price: string;
  seller: string;
};

export default function NFTMarketplace({ signer }: { signer: any }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const contract = getContract(signer);

  const fetchListings = async () => {
    const items: Listing[] = [];
    for (let i = 0; i < 10; i++) {
      try {
        const listing = await contract.listings(i);
        if (listing.price > 0) {
          items.push({
            tokenId: i,
            price: formatEther(listing.price),
            seller: listing.seller,
          });
        }
      } catch {}
    }
    setListings(items);
  };

  const buy = async (tokenId: number, price: string) => {
    try {
      const tx = await contract.buyNFT(tokenId, {
        value: parseEther(price),
      });
      await tx.wait();
      alert("Acquistato!");
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="my-4">
      <h5>Marketplace</h5>
      {listings.length === 0 && <p>Nessun NFT in vendita.</p>}
      {listings.map(({ tokenId, price, seller }) => (
        <div key={tokenId} className="border p-2 mb-2">
          <p>BFT #{tokenId}</p>
          <p>Prezzo: {price} MATIC</p>
          <button className="btn btn-warning" onClick={() => buy(tokenId, price)}>Compra</button>
        </div>
      ))}
    </div>
  );
}
