import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ArrowDownUp, Loader2, Settings, ChevronDown, Info } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";
import Token from "./Token";
import tokens from "../constants/token";

type TokenInfo = {
    id: string;
    name: string;
    img: string;
};
  
type TokensType = {
    [key: string]: TokenInfo;
};

const typedTokens: TokensType = tokens;

function Swap() {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet(); 

    const [inAmount, setInAmount] = useState<string>('');
    const [inputMint, setInputMint] = useState<string>('So11111111111111111111111111111111111111112');
    const [outAmount, setOutAmount] = useState<string>('');
    const [outputMint, setOutputMint] = useState<string>('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    const [slippageBps, setSlippageBps] = useState<number>(10);
    const [provider, setProvider] = useState<string>('');
    const [loader, setLoader] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [tokenOptType, setTokenOptType] = useState<string>("");


    const handleInAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setInAmount(value);
        }
    };

    const getQuote = async () => {
        if (!inAmount || Number(inAmount) === 0) {
            setOutAmount('');
            return;
        }
        setLoader(true);
        setProvider('');
        try {
            const amount = Number(inAmount) * (10 ** 8);
            console.log(slippageBps);
            const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`)
            const result = await response.json();
            if (result) {
                setOutAmount(Number(result["outAmount"] / (10 ** 5)).toFixed(6));
                setProvider(result.routePlan[0]?.swapInfo?.label);
            }
            console.log(result);
        } catch (error) {
            console.log(error);
        }
        setLoader(false);
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            getQuote();
        }, 500);

        return () => clearTimeout(debounce);
    }, [inAmount, slippageBps, outputMint]);

    const swapToken = async() => {
        if(publicKey && signTransaction) {
            try {
                const amount = Number(inAmount) * (10 ** 8);
                const quoteResponse = await(
                    await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`)
                ).json();
    
                const response = await fetch('https://quote-api.jup.ag/v6/swap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteResponse,
                        userPublicKey: publicKey,
                        wrapAndUnwrapSol: true,
                    })
                });
                const swapTransactionBase64 = await response.json();
                console.log("Swap Transaction (base64 format): ", swapTransactionBase64);

                const swapTransactionBuf = Buffer.from(swapTransactionBase64.swapTransaction, 'base64');
                var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
                transaction = await signTransaction(transaction);
                console.log(transaction);
                
                const rawTransaction = transaction.serialize()
                const txid = await connection.sendRawTransaction(rawTransaction, {
                    skipPreflight: true,
                    maxRetries: 2
                });
                await connection.confirmTransaction(txid);
                console.log(`https://solscan.io/tx/${txid}`);
            } catch (error) {
                console.error("Error performing swap:", error);
            }
        }
    }



    return (
        <div className={`relative w-[40vw] mt-12 mx-auto z-0`}>
            <div className={`${tokenOptType != "" ? 'blur-md overflow-hidden' : ''} flex flex-col rounded-2xl shadow-xl p-6`}>
                <div className="flex justify-between items-center mb-6 relative"> 
                    <div className="flex-grow text-center">
                        <h2 className="text-2xl font-bold text-white">Flip your Token</h2>
                    </div>
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-gray-400 hover:text-white transition-colors absolute right-0 top-2"
                    >
                        <Settings size={20} />
                    </button>
                </div>
                
                {showSettings && (
                    <div className="mb-4 bg-purple-800 bg-opacity-5 p-4 rounded-lg flex justify-between">
                        <div className="text-md tracking-wide text-gray-300 mb-2 font-semibold">Slippage Tolerance</div>
                        <div className="flex gap-2">
                            {[10, 25, 50].map((slippage) => (
                                <button
                                    key={slippage}
                                    onClick={() => setSlippageBps(slippage)}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        slippage === slippageBps
                                            ? "bg-purple-800 bg-opacity-30 border-2 border-purple-800 text-purple-400"
                                            : "bg-purple-800 bg-opacity-5 hover:bg-purple-700 text-purple-500 text-opacity-50 hover:text-opacity-100 hover:bg-opacity-50 duration-300"
                                    }`}
                                >
                                    {(slippage / 10).toFixed(2)}%
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col mb-4 z-0">
                    <div className="flex flex-col bg-purple-800 border-2 border-purple-500 border-opacity-10 bg-opacity-20 items-ce rounded-xl px-5 py-2">
                        <div className="text-lg p-2 text-purple-400">You pay</div>
                            <div className="flex justify-between items-center">
                                <button
                                    className="border-none outline-none cursor-default"
                                >
                                    <div className="flex items-center gap-4 p-2 rounded-lg duration-300">
                                        <img 
                                            src={typedTokens[inputMint]?.img || 'https://coin-images.coingecko.com/coins/images/21629/large/solana.jpg?1696520989'} 
                                            width={50} 
                                            height={50}
                                            className="rounded-full"
                                            alt={typedTokens[inputMint]?.name || "Solana"}
                                        />
                                        <div 
                                            className="text-lg text-white"
                                            
                                        >
                                            {typedTokens[inputMint]?.id || "SOL"}
                                        </div>
                                    </div>
                                </button>
                                <input
                                    value={inAmount}
                                    onChange={handleInAmountChange}
                                    placeholder="0.0"
                                    className="text-right bg-transparent outline-none border-none text-white text-xl w-1/2"
                                />
                        </div>
                    </div>


                    <div className="flex justify-center -my-6 z-10">
                        <button className="bg-purple-400 border-2 border-purple-900 border-opacity-10 p-4 rounded-full transition-colors">
                            <ArrowDownUp className="text-purple-900 font-semibold"/>
                        </button>
                    </div>

                    <div className="flex flex-col bg-purple-800 border-2 border-purple-500 border-opacity-10 bg-opacity-20 rounded-xl px-5 py-2  z-0">
                        <div className="text-lg p-2 text-purple-400">You receive</div>
                        <div className="flex justify-between items-center">
                            <button
                                className="outline-none border-none"
                                onClick={() => {
                                    setTokenOptType("receive");
                                }}
                            >
                                <div className="flex items-center gap-4 p-2 cursor-pointer hover:bg-purple-500 hover:bg-opacity-15 rounded-lg duration-300">
                                    <img 
                                        src={typedTokens[outputMint].img} 
                                        width={50} 
                                        height={50}
                                        className="rounded-full"
                                        alt={typedTokens[outputMint].name}
                                    />
                                    <div 
                                        className="text-lg text-white"
                                    >
                                        {typedTokens[outputMint].id}
                                    </div>
                                    <ChevronDown className="text-white text-sm" />
                                </div>
                            </button>
                            <div className="text-right text-white text-lg w-1/2">
                                {loader ? (
                                    <Loader2 className="animate-spin ml-auto" />
                                ) : (
                                    outAmount || '0.0'
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4 mt-4">
                    {
                        provider != '' && 
                        <div className="w-full bg-purple-800 bg-opacity-50 text-purple-300 p-4 flex justify-between items-center rounded-lg">
                            <div className="flex gap-2 items-center">
                                <Info />
                                <p className="tracking-wide text-md">Provider</p>
                            </div>
                            <p className="font-semibold tracking-wide">{provider}</p>
                        </div>
                    }

                    <button 
                        className="w-full bg-purple-800 bg-opacity-30 border-2 border-purple-500 border-opacity-10 rounded-xl py-4 text-purple-300 font-medium transition-colors hover:bg-opacity-65 duration-150"
                        onClick={swapToken}
                    >
                        Swap
                    </button>

                    <WalletMultiButton className="w-full justify-center" />
                </div>

               
            </div>
            {tokenOptType != "" && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-[10]">
                    <Token
                        setInputMint={setInputMint}
                        setOutputMint={setOutputMint}
                        tokenOptType={tokenOptType}
                        setTokenOptType={setTokenOptType}
                    />
                </div>
            )}
        </div>
    );
}

export default Swap;
