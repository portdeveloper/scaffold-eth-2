import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Block, Hash, Transaction, formatEther } from "viem";
import { usePublicClient } from "wagmi";
import { hardhat } from "wagmi/chains";
import { Address } from "~~/components/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const BlocksPage: NextPage = () => {
  const client = usePublicClient({ chainId: hardhat.id });

  const router = useRouter();
  const { blockHash } = router.query as { blockHash?: string };
  const [block, setBlock] = useState<Block>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const configuredNetwork = getTargetNetwork();

  useEffect(() => {
    if (blockHash) {
      const fetchBlockData = async () => {
        const blockData = await client.getBlock({ blockHash: blockHash as Hash, includeTransactions: true });
        setBlock(blockData);
        setTransactions(blockData.transactions || []);
      };

      fetchBlockData();
    }
  }, [client, blockHash]);

  return (
    <div className="container mx-auto mt-10 mb-20 px-10 md:px-0">
      <button className="btn btn-sm btn-primary" onClick={() => router.back()}>
        Back
      </button>
      {block ? (
        <div className="overflow-x-auto">
          <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Block Details</h2>
          <table className="table rounded-lg bg-base-100 w-full shadow-lg md:table-lg table-md">
            <tbody>
              <tr>
                <td>
                  <strong>Block Number:</strong>
                </td>
                <td>{Number(block.number)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Block Hash:</strong>
                </td>
                <td>{block.hash}</td>
              </tr>
            </tbody>
          </table>
          <h2 className="text-3xl font-bold mt-10 mb-4 text-center text-primary-content">Transactions in Block</h2>
          <table className="table rounded-lg bg-base-100 w-full shadow-lg md:table-lg table-md">
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.hash}>
                  <td>{transaction.hash}</td>
                  <td>
                    <Address address={transaction.from} format="long" />
                  </td>
                  <td>
                    <Address address={transaction.to || "no to address"} format="long" />
                  </td>
                  <td>
                    {formatEther(transaction.value)} {configuredNetwork.nativeCurrency.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-2xl text-base-content">Loading...</p>
      )}
    </div>
  );
};

export default BlocksPage;
