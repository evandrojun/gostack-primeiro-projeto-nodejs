import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const income = await this.find({
      where: { type: 'income' }
    }).then(transactions => transactions
      .map(transaction => Number(transaction.value))
      .reduce((total, num) => (total + num), 0));

    const outcome = await this.find({
      where: { type: 'outcome' }
    }).then(transactions => transactions
      .map(transaction => Number(transaction.value))
      .reduce((total, num) => (total + num), 0));

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
