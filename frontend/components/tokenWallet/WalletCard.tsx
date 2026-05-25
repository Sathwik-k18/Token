export function WalletCard({ balance, usedToday }: { balance: number; usedToday: number }) {
  return (
    <section style={{ padding: 16, border: '1px solid #334155', borderRadius: 10 }}>
      <h3>Token Wallet</h3>
      <p>Balance: {balance.toLocaleString()}</p>
      <p>Used today: {usedToday.toLocaleString()}</p>
    </section>
  );
}
