import { v4 } from 'uuid';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ListTransactions {
  transactions: Transaction[];
  balance: Balance;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = {
      id: v4(),
      title,
      type,
      value,
    };

    this.transactions.push(transaction);
    this.calculateBalance();

    return transaction;
  }

  public getBalance(): number {
    return this.balance.total;
  }

  public all(): ListTransactions {
    return {
      transactions: this.transactions,
      balance: this.balance,
    };
  }

  private calculateBalance(): void {
    this.calculateIncome();
    this.calculateOutcome();

    const { income, outcome } = this.balance;
    this.balance.total = income - outcome;
  }

  private calculateOutcome(): void {
    const outcomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    if (!outcomeTransactions.length) {
      return;
    }

    const outcome = outcomeTransactions
      .map(({ value }) => value)
      .reduce((prevValue: number, currValue: number) => prevValue + currValue);

    this.balance.outcome = outcome;
  }

  private calculateIncome(): void {
    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'income',
    );

    if (!incomeTransactions.length) {
      return;
    }

    const income = incomeTransactions
      .map(({ value }) => value)
      .reduce((prevValue: number, currValue: number) => prevValue + currValue);

    this.balance.income = income;
  }
}

export default TransactionsRepository;
