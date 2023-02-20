interface InvestmentAccount {
    /** Account name */
    name: string;
    /** Optional, brief account description */
    description?: string;
    /** Total value of the account */
    netAccountValue: number;
    input: {
        /** Target % of the portfolio */
        targetPortfolioPercentage: number;
    };
    output?: {
        /** Computed monthly deposit amount */
        monthlyDeposit: number;
        /** Actual % of the portfolio (closest possible to target) */
        actualPortfolioPercentage: number;
    };
}
/** Returns an array of the monthly deposit
amounts needed to reach the target % in the portfolio. */
export declare const calculateMonthlyDepositAmounts: (investmentAccounts: InvestmentAccount[], months: number, totalToInvestPerMonth: number, allowNegativeDeltas?: boolean) => InvestmentAccount[];
export {};
