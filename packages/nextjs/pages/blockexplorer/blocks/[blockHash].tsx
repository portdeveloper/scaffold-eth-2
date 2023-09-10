import { useRouter } from "next/router";
import type { NextPage } from "next";
import { TransactionReceipt } from "viem";
import { TransactionsTable } from "~~/components/blockexplorer";
import { useFetchBlocks } from "~~/hooks/scaffold-eth";

const BlocksPage: NextPage = () => {
  const router = useRouter();
  const { blockHash } = router.query as { blockHash?: string };

  const { blocks, transactionReceipts } = useFetchBlocks();

  const filteredBlocks = blocks.filter(block => block.hash === blockHash);

  const filteredReceiptsArray = Object.values(transactionReceipts).filter(receipt => receipt.blockHash === blockHash);

  const filteredReceiptsObject: { [key: string]: TransactionReceipt } = {};

  filteredReceiptsArray.forEach(receipt => {
    filteredReceiptsObject[receipt.transactionHash] = receipt;
  });

  return (
    <div className="container mx-auto mt-10 mb-20 px-10 md:px-0">
      <button className="btn btn-sm btn-primary my-4" onClick={() => router.back()}>
        Back
      </button>
      <TransactionsTable blocks={filteredBlocks} transactionReceipts={filteredReceiptsObject} />
    </div>
  );
};

export default BlocksPage;
