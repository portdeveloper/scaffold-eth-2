import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { hardhat } from "wagmi/chains";
import { BlocksTable, PaginationButton, SearchBar, Toolbar, TransactionsTable } from "~~/components/blockexplorer/";
import { useFetchBlocks } from "~~/hooks/scaffold-eth";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const Blockexplorer: NextPage = () => {
  const router = useRouter();
  const initialTab = router.query.tab === "blocks" ? "blocks" : "transactions";
  const [selectedTab, setSelectedTab] = useState<"blocks" | "transactions">(initialTab);

  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } = useFetchBlocks(selectedTab);

  useEffect(() => {
    if (getTargetNetwork().id === hardhat.id && error) {
      notification.error(
        <>
          <p className="font-bold mt-0 mb-1">Cannot connect to local provider</p>
          <p className="m-0">
            - Did you forget to run <code className="italic bg-base-300 text-base font-bold">yarn chain</code> ?
          </p>
          <p className="mt-1 break-normal">
            - Or you can change <code className="italic bg-base-300 text-base font-bold">targetNetwork</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">scaffold.config.ts</code>
          </p>
        </>,
      );
    }

    if (getTargetNetwork().id !== hardhat.id) {
      notification.error(
        <>
          <p className="font-bold mt-0 mb-1">
            <code className="italic bg-base-300 text-base font-bold"> targeNetwork </code> is not localhost
          </p>
          <p className="m-0">
            - You are on <code className="italic bg-base-300 text-base font-bold">{getTargetNetwork().name}</code> .This
            block explorer is only for <code className="italic bg-base-300 text-base font-bold">localhost</code>.
          </p>
          <p className="mt-1 break-normal">
            - You can use{" "}
            <a className="text-accent" href={getTargetNetwork().blockExplorers?.default.url}>
              {getTargetNetwork().blockExplorers?.default.name}
            </a>{" "}
            instead
          </p>
        </>,
      );
    }
  }, [error]);

  const changeTab = (tabName: "blocks" | "transactions") => {
    setSelectedTab(tabName);
    router.push(`/blockexplorer/${tabName}`);
  };

  const tabNames: ("transactions" | "blocks")[] = ["transactions", "blocks"];

  return (
    <div className="container mx-auto my-10">
      <SearchBar />
      <div className="my-4">
        {tabNames.map(tabName => (
          <button
            className={`btn btn-secondary btn-sm capitalize font-thin mr-2  ${
              tabName === selectedTab ? "bg-base-300" : "bg-base-100"
            }`}
            key={tabName}
            onClick={() => changeTab(tabName)}
          >
            {tabName}
          </button>
        ))}
      </div>
      <Toolbar selectedTab={selectedTab} />

      {selectedTab === "transactions" && (
        <>
          <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} />
          <PaginationButton
            currentPage={currentPage[selectedTab]}
            totalItems={Number(totalBlocks)}
            setCurrentPage={page => setCurrentPage(prev => ({ ...prev, [selectedTab]: page }))}
          />
        </>
      )}
      {selectedTab === "blocks" && (
        <>
          <BlocksTable blocks={blocks} />
          <PaginationButton
            currentPage={currentPage[selectedTab]}
            totalItems={Number(totalBlocks)}
            setCurrentPage={page => setCurrentPage(prev => ({ ...prev, [selectedTab]: page }))}
          />
        </>
      )}
    </div>
  );
};

export default Blockexplorer;
