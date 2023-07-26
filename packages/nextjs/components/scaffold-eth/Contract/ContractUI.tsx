import { useReducer } from "react";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { Abi, keccak256, toHex } from "viem";
import { Spinner } from "~~/components/Spinner";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const configuredNetwork = getTargetNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const networkColor = useNetworkColor();

  const deployedContractAbi = deployedContractData?.abi as Abi;
  const hashedEventNames: { [key: string]: string } = {};

  deployedContractAbi?.forEach(part => {
    if (part.type === "event") {
      const eventName = part.name;
      const eventParameters = part.inputs.map(input => input.type).join(",");
      hashedEventNames[eventName] = keccak256(toHex(`${eventName}(${eventParameters})`));
    }
  });

  const { data: events } = useScaffoldEventHistory({
    contractName: "YourContract",
    fromBlock: 0n,
    blockData: true,
    refresh: refreshDisplayVariables,
  });

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <Spinner width="50px" height="50px" />
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-7 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={deployedContractData.address} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {configuredNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: networkColor }}>{configuredNetwork.name}</span>
              </p>
            )}
          </div>
          <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Read</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300">
                <ContractReadMethods deployedContractData={deployedContractData} />
              </div>
            </div>
          </div>
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Write</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300">
                <ContractWriteMethods
                  deployedContractData={deployedContractData}
                  onChange={triggerRefreshDisplayVariables}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="z-10 col-span-2 lg:col-span-2 w-auto overflow-hidden">
        <div className="h-[800px] bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
          <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
            <div className="flex items-center justify-center space-x-2">
              <p className="my-0 text-sm">Events</p>
            </div>
          </div>
          <div className="p-5 divide-y divide-base-300 overflow-y-auto">
            {events?.map(event => {
              const eventHash = event.log.topics[0];
              const eventName = Object.keys(hashedEventNames).find(key => hashedEventNames[key] === eventHash);

              return (
                <div key={event.log.transactionHash} className="flex flex-col gap-2">
                  {eventName && <span>{eventName} called!</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
