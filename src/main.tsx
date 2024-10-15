import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  
    <ConnectionProvider endpoint='https://api.mainnet-beta.solana.com'>
      <WalletProvider wallets={[]}>
        <WalletModalProvider>
            <App />
            <Toaster
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

)
