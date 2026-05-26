'use client';
import { useEffect, useState } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Sidebar } from '../components/sidebar/Sidebar';
import { WalletCard } from '../components/tokenWallet/WalletCard';
import { ChatWindow } from '../components/chat/ChatWindow';
import { UsageStats } from '../components/dashboard/UsageStats';
import { getWallet } from '../services/api/chatApi';

export default function HomePage() {
  const [wallet, setWallet] = useState({ balance: 0, usedToday: 0 });

  useEffect(() => {
    getWallet().then((data) => setWallet(data.wallet));
  }, []);

  return (
    <main>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <Sidebar />
        <section style={{ padding: 20, flex: 1, display: 'grid', gap: 16 }}>
          <WalletCard balance={wallet.balance} usedToday={wallet.usedToday} />
          <UsageStats />
          <ChatWindow />
        </section>
      </div>
    </main>
  );
}
