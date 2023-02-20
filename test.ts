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

calculateMonthlyDepositAmounts(testInvestmentAccounts, 6, 1000)
