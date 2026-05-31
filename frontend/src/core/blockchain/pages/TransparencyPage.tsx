import { useEffect, useState } from "react";
import {
  Shield,
  FileText,
  Wallet,
  Clock,
  CheckCircle,
  Hash,
} from "lucide-react";
import { ethers } from "ethers";

const TransparencyPage = () => {
  const [contractAddress] = useState(
    "0x1234567890abcdef1234567890abcdef12345678",
  );
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  useEffect(() => {
    const getBalance = async () => {
      const balance = await provider.getBalance(
        "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
      );

      console.log(balance);
      console.log(0);
      console.log(ethers.formatEther(balance));
    };

    getBalance();
  }, []);
  const phase = "EXECUTING";

  const timeline = [
    {
      label: "Customer Registered",
      txHash: "0xabc123...",
      block: 101,
    },
    {
      label: "Supplier Registered",
      txHash: "0xdef456...",
      block: 105,
    },
    {
      label: "Demand Confirmed",
      txHash: "0xghi789...",
      block: 112,
    },
    {
      label: "Order Created",
      txHash: "0xjkl111...",
      block: 130,
    },
    {
      label: "Payment Released",
      txHash: "0xmno222...",
      block: 155,
    },
  ];

  const orders = [
    {
      supplier: "0x1111...AAAA",
      allocationScore: 9400,
      quantity: 500,
      estimatedAmount: "10 ETH",
      defectRate: "1.2%",
      paidAmount: "9.6 ETH",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Shield size={24} />
            <div>
              <h1 className="text-xl font-semibold">
                Procurement Transparency Dashboard
              </h1>

              <p className="text-sm text-slate-500">
                Blockchain audit trail and smart contract verification
              </p>
            </div>
          </div>
        </div>

        {/* Contract */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Contract Address</p>

            <p className="mt-2 break-all font-mono text-sm">
              {contractAddress}
            </p>
          </div>

          <div className="rounded-md bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Current Phase</p>

            <p className="mt-2 font-semibold">{phase}</p>
          </div>

          <div className="rounded-md bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Transactions</p>

            <p className="mt-2 text-2xl font-bold">{timeline.length}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock size={18} />
            <h2 className="font-semibold">Procurement Timeline</h2>
          </div>

          <div className="space-y-3">
            {timeline.map((item) => (
              <div
                key={item.txHash}
                className="flex items-center justify-between rounded-md bg-slate-50 p-4"
              >
                <div>
                  <p className="font-medium">{item.label}</p>

                  <p className="font-mono text-xs text-slate-500">
                    {item.txHash}
                  </p>
                </div>

                <div className="text-sm text-slate-500">
                  Block #{item.block}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={18} />
            <h2 className="font-semibold">Smart Contract Orders</h2>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3">Supplier</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Estimated</th>
                  <th className="pb-3">Defect</th>
                  <th className="pb-3">Paid</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.supplier} className="border-b">
                    <td className="py-4 font-mono">{order.supplier}</td>

                    <td>{order.allocationScore}</td>

                    <td>{order.quantity}</td>

                    <td>{order.estimatedAmount}</td>

                    <td>{order.defectRate}</td>

                    <td>{order.paidAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Hash size={18} />
              <span className="font-medium">Transaction Proof</span>
            </div>

            <p className="text-sm text-slate-500">
              Every action is linked to a transaction hash and can be
              independently verified.
            </p>
          </div>

          <div className="rounded-md bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Wallet size={18} />
              <span className="font-medium">Escrow Payment</span>
            </div>

            <p className="text-sm text-slate-500">
              Buyer deposits funds before execution begins.
            </p>
          </div>

          <div className="rounded-md bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle size={18} />
              <span className="font-medium">Automated Settlement</span>
            </div>

            <p className="text-sm text-slate-500">
              Final payment is calculated by smart contract using delivery and
              inspection results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencyPage;
