import { useEffect, useState } from "react";
import { useFetchBlocks } from "~~/hooks/scaffold-eth";
import { extendedClient, notification } from "~~/utils/scaffold-eth";

export const Toolbar = ({ selectedTab }: { selectedTab: string }) => {
  const [autoMining, setAutoMining] = useState<boolean>(false);
  const [intervalMining, setIntervalMining] = useState<number>(0);
  const { totalBlocks } = useFetchBlocks();

  const fetchAutomineStatus = async () => {
    try {
      const status = await extendedClient.getAutomine();
      setAutoMining(status);
    } catch (error) {
      console.error("Failed to fetch automine status: ", error);
    }
  };

  const mineBlock = async () => {
    try {
      await extendedClient.mine({
        blocks: 1,
      });
    } catch (error) {
      console.error("Failed to mine block: ", error);
    }
  };

  const toggleAutomine = async () => {
    try {
      await extendedClient.setAutomine(!autoMining);
      fetchAutomineStatus();
    } catch (error) {
      console.error("Failed to set automine status: ", error);
    }
  };

  const handleSetIntervalMining = async () => {
    try {
      await extendedClient.setIntervalMining({
        interval: intervalMining * 1000,
      });
      notification.info(`Set automatic mining interval to ${intervalMining}`);
    } catch (error: any) {
      notification.error(error);
    }
  };

  useEffect(() => {
    fetchAutomineStatus();
  }, []);

  return (
    <div className="flex gap-4 p-2 my-2 bg-secondary rounded-lg">
      <span>Latest block number: {Number(totalBlocks)}</span>
      <button
        type="button"
        className={`btn btn-xs py-1 px-2 ${autoMining ? "btn-success" : "btn-error"}`}
        onClick={toggleAutomine}
      >
        AutoMining = {autoMining ? "ON" : "OFF"}
      </button>
      <button type="button" className="btn btn-primary btn-xs py-1 px-2" onClick={() => mineBlock()}>
        Mine
      </button>
      {selectedTab === "blocks" && (
        <div className="flex gap-1 bg-primary rounded-xl tooltip" data-tip="To disable interval mining, set it to 0">
          <input
            type="number"
            value={intervalMining}
            onChange={e => setIntervalMining(Number(e.target.value))}
            placeholder="Enter interval in seconds"
            className="input input-bordered input-xs w-20"
          />
          <button type="button" className="btn btn-xs " onClick={handleSetIntervalMining}>
            Set interval mining
          </button>
        </div>
      )}
    </div>
  );
};
