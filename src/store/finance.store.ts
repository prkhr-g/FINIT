export const financeStore = {
  transactions: [] as any[],
  accounts: [] as any[],
  setTransactions(txs: any[]) {
    this.transactions = txs;
  },
  setAccounts(accs: any[]) {
    this.accounts = accs;
  }
};