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
    if(searchText.trim()) {
      setFilteredTokens(
        Object.entries(tokens).filter(([_, tokenData]) =>
          tokenData.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } 
    else setFilteredTokens(Object.entries(tokens)); 

  }, [searchText]);

  return (
    <div className="bg-purple-900 w-[40vw] h-[60vh] rounded-lg bg-opacity-50 text-white overflow-auto px-5 py-4">
      <div className="w-full px-4 h-14 bg-purple-900 bg-opacity-80 flex items-center rounded-lg">
        <Search />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by token name"
          className="px-5 bg-transparent text-md w-full h-full outline-none border-none"
        />
        <button
          className="cursor-pointer"
          onClick={() => setTokenOptType("")}
        >
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {filteredTokens.length ? (
          filteredTokens.map(([tokenAddress, tokenData]) => (
            <button
              key={tokenAddress}
              onClick={() => {
                if (tokenOptType === "pay") setInputMint(tokenAddress);
                else setOutputMint(tokenAddress);
                setTokenOptType("");
              }}
            >
              <div
                key={tokenAddress}
                className="flex justify-between bg-purple-800 bg-opacity-10 cursor-pointer py-5 px-4 hover:bg-purple-600 rounded-lg duration-300"
              >
                <div className="flex gap-5">
                  <div>
                    <img src={tokenData.img} width={45} className="rounded-full" alt={`${tokenData.name} logo`} />
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="font-bold text-lg">{tokenData.id.toUpperCase()}</h2>
                    <h3 className="text-sm text-opacity-85 tracking-wide">{tokenData.name}</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>
                    {tokenAddress.substring(0, 7) + "......." + tokenAddress.substring(tokenAddress.length - 5)}
                  </div>
                  <div>
                    <Clipboard className="text-[1px]" />
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="flex justify-center items-center text-gray-400">No tokens found</div>
        )}
      </div>
    </div>
  );
}

export default Token;
