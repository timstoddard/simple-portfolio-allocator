// TODO why does this error?
import { calculateMonthlyDepositAmounts } from './src/simple-portfolio-allocator'

const testInvestmentAccounts = [
  {
    name: '',
    netAccountValue: 1000,
    input: {
      targetPortfolioPercentage: .25,
    },
  },
  {
    name: '',
    netAccountValue: 2000,
    input: {
      targetPortfolioPercentage: .5,
    },
  },
  {
    name: '',
    netAccountValue: 3000,
    input: {
      targetPortfolioPercentage: .25,
    },
  },
  {
    name: '',
    netAccountValue: 1000,
    input: {
      targetPortfolioPercentage: 0,
    },
  },
]

test('simple-portfolio-allocator', () => {
  // assign

  // act
  calculateMonthlyDepositAmounts(testInvestmentAccounts, 6, 1000)

  // assert
  // TODO
  expect(1).toBe(1);
});
