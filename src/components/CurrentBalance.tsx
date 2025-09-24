import React from "react";
import { Coins } from "lucide-react";

interface CurrentBalanceProps {
  coins: number;
}

const CurrentBalance: React.FC<CurrentBalanceProps> = ({ coins }) => {
  return (
    <div className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2 text-center sm:text-right min-w-[180px]">
      <p className="text-sm text-muted-foreground">Current Balance</p>
      <p className="text-2xl font-semibold text-cyan-400 flex items-center justify-center sm:justify-end gap-2">
        <Coins className="h-5 w-5" />
        <span>{coins.toLocaleString()}</span>
      </p>
    </div>
  );
};

export default CurrentBalance;
