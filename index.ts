interface InvestmentAccount {
  /** Account name */
  name: string
  /** Optional, brief account description */
  description?: string
  /** Total value of the account */
  netAccountValue: number
  input: {
    /** Target % of the portfolio */
    targetPortfolioPercentage: number
  }
  output?: {
    /** Computed monthly deposit amount */
    monthlyDeposit: number
    /** Actual % of the portfolio (closest possible to target) */
    actualPortfolioPercentage: number
  }
}

const addNetAccountValues = (sum: number, account: InvestmentAccount) =>
  sum + account.netAccountValue

const calculateDeltaForAccount = (investmentAccount, endingPortfolioValue, allowNegativeDeltas) => {
  let delta = investmentAccount.input.targetPortfolioPercentage * endingPortfolioValue - investmentAccount.netAccountValue
  if (!allowNegativeDeltas) {
    delta = Math.max(delta, 0)
  }
  return delta
}

const roundDecimalPlaces = (n: number, decimalPlaces = 2) => {
  const scalar = Math.pow(10, decimalPlaces)
  const result = Math.round((n + Number.EPSILON) * scalar) / scalar
  return result
}

/** Returns an array of the monthly deposit
amounts needed to reach the target % in the portfolio. */
const calculateMonthlyDepositAmounts = (
  investmentAccounts: InvestmentAccount[],
  months: number,
  totalToInvestPerMonth: number,
  allowNegativeDeltas = false,
): InvestmentAccount[] => {
  const netPortfolioValue = investmentAccounts.reduce(addNetAccountValues, 0)
  const totalToInvest = months * totalToInvestPerMonth
  const endingPortfolioValue = netPortfolioValue + totalToInvest
  console.log(netPortfolioValue, totalToInvest, endingPortfolioValue)
  let deltas: number[] = investmentAccounts.map(investmentAccount =>
    calculateDeltaForAccount(investmentAccount, endingPortfolioValue, allowNegativeDeltas))

  // delta rebalancing to remove negative deltas
  if (!allowNegativeDeltas) {
    const deltasSum = deltas.reduce((a, b) => a + b, 0)
    if (deltasSum != totalToInvest) {
      // one or more deltas were negative
      deltas = deltas.map(delta => {
        const deltaPercent = delta / deltasSum
        const scaledDelta = deltaPercent * totalToInvest
        return scaledDelta
      })
    }
  }

  // calculate actual portfolio %s
  // if one or more deltas were negative, will not be equal to target %s
  const actualPortfolioPercents = deltas.map((delta, i) => {
    const account = investmentAccounts[i]
    const endAmount = account.netAccountValue + delta
    const percent = roundDecimalPlaces(endAmount / endingPortfolioValue)
    return percent
  })

  // convert delta values to monthly
  deltas = deltas.map(delta => roundDecimalPlaces(delta / months))

  // set up result format
  const resultAccounts = investmentAccounts.map((account, i) => {
    return {
      ...account,
      output: {
        monthlyDeposit: deltas[i],
        actualPortfolioPercentage: actualPortfolioPercents[i],
      },
    }
  })

  // TODO delete?
  const foo = resultAccounts.map((account, i) => {
    return {
      NAV_pre: account.netAccountValue,
      NAV_post: account.netAccountValue + account.output.monthlyDeposit * months,
      MD: account.output.monthlyDeposit,
      TPP: account.input.targetPortfolioPercentage,
      APP: account.output.actualPortfolioPercentage,
    }
  })
  console.table(foo)

  return resultAccounts
}
