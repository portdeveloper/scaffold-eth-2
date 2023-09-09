import { HashComp } from "../scaffold-eth";
import { Block } from "viem";

export const BlocksTable = ({ blocks }: { blocks: Block[] }) => {
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Block Hash</th>
              <th className="bg-primary">Block Number</th>
              <th className="bg-primary">Gas Limit</th>
              <th className="bg-primary">Gas Used</th>
              <th className="bg-primary">Timestamp</th>
              <th className="bg-primary">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No blocks found
                </td>
              </tr>
            )}
            {blocks.map((block: Block) => (
              <tr key={block.hash} className="h-[50px]">
                <td>
                  <HashComp hash={block.hash} type="block" />
                </td>
                <td>{Number(block.number)}</td>
                <td>{Number(block.gasLimit)}</td>
                <td>{Number(block.gasUsed)}</td>
                <td>{new Date(Number(block.timestamp) * 1000).toLocaleString()}</td>
                <td>
                  <div className="max-h-[50px] overflow-y-auto">
                    {block.transactions.map((tx: any) => (
                      <div key={tx.hash}>
                        <HashComp hash={tx.hash} type="transaction" />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
