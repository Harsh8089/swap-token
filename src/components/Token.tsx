import { Search, X, Clipboard } from 'lucide-react';
import tokens from '../constants/token';
import { useEffect, useState } from 'react';

interface TokenProps {
  setInputMint: React.Dispatch<React.SetStateAction<string>>;
  setOutputMint: React.Dispatch<React.SetStateAction<string>>;
  tokenOptType: string;
  setTokenOptType: React.Dispatch<React.SetStateAction<string>>;
}

function Token({ setInputMint, setOutputMint, tokenOptType, setTokenOptType }: TokenProps) {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredTokens, setFilteredTokens] = useState(Object.entries(tokens));

  useEffect(() => {
    const lowercasedSearch = searchText.toLowerCase().trim();
    setFilteredTokens(
      Object.entries(tokens).filter(([_, tokenData]) =>
        tokenData.name.toLowerCase().includes(lowercasedSearch) ||
        tokenData.id.toLowerCase().includes(lowercasedSearch)
      )
    );
  }, [searchText]);

  const handleClearSearch = () => {
    setSearchText("");
    setTokenOptType("");
  };

  return (
    <div className="bg-purple-900 w-[40vw] h-[60vh] rounded-lg bg-opacity-50 text-white overflow-hidden flex flex-col">
      <div className="p-4">
        <div className="relative">
            <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by token name or symbol"
                className="w-full px-10 py-3 bg-purple-800 bg-opacity-80 rounded-lg text-white placeholder-gray-400 outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={handleClearSearch}
            >
                <X size={18} />
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="flex flex-col gap-2">
          {filteredTokens.length ? (
            filteredTokens.map(([tokenAddress, tokenData]) => (
              <button
                key={tokenAddress}
                onClick={() => {
                  if (tokenOptType === "pay") setInputMint(tokenAddress);
                  else setOutputMint(tokenAddress);
                  setTokenOptType("");
                }}
                className="w-full text-left"
              >
                <div className="flex justify-between items-center bg-purple-800 bg-opacity-10 hover:bg-opacity-80 py-4 px-4 rounded-lg transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <img src={tokenData.img} width={40} height={40} className="rounded-full" alt={`${tokenData.name} logo`} />
                    <div>
                      <h2 className="font-semibold">{tokenData.id.toUpperCase()}</h2>
                      <h3 className="text-sm text-gray-300">{tokenData.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{`${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)}`}</span>
                    <Clipboard className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">No tokens found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Token;