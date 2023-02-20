"use strict";
// more advanced version (not by me) https://www.npmjs.com/package/portfolio-allocation
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMonthlyDepositAmounts = void 0;
var addNetAccountValues = function (sum, account) {
    return sum + account.netAccountValue;
};
var calculateDeltaForAccount = function (investmentAccount, endingPortfolioValue, allowNegativeDeltas) {
    var delta = investmentAccount.input.targetPortfolioPercentage * endingPortfolioValue - investmentAccount.netAccountValue;
    if (!allowNegativeDeltas) {
        delta = Math.max(delta, 0);
    }
    return delta;
};
var roundDecimalPlaces = function (n, decimalPlaces) {
    if (decimalPlaces === void 0) { decimalPlaces = 2; }
    var scalar = Math.pow(10, decimalPlaces);
    var result = Math.round((n + Number.EPSILON) * scalar) / scalar;
    return result;
};
/** Returns an array of the monthly deposit
amounts needed to reach the target % in the portfolio. */
var calculateMonthlyDepositAmounts = function (investmentAccounts, months, totalToInvestPerMonth, allowNegativeDeltas) {
    if (allowNegativeDeltas === void 0) { allowNegativeDeltas = false; }
    var netPortfolioValue = investmentAccounts.reduce(addNetAccountValues, 0);
    var totalToInvest = months * totalToInvestPerMonth;
    var endingPortfolioValue = netPortfolioValue + totalToInvest;
    console.log(netPortfolioValue, totalToInvest, endingPortfolioValue);
    var deltas = investmentAccounts.map(function (investmentAccount) {
        return calculateDeltaForAccount(investmentAccount, endingPortfolioValue, allowNegativeDeltas);
    });
    // delta rebalancing to remove negative deltas
    if (!allowNegativeDeltas) {
        var deltasSum_1 = deltas.reduce(function (a, b) { return a + b; }, 0);
        if (deltasSum_1 != totalToInvest) {
            // one or more deltas were negative
            deltas = deltas.map(function (delta) {
                var deltaPercent = delta / deltasSum_1;
                var scaledDelta = deltaPercent * totalToInvest;
                return scaledDelta;
            });
        }
    }
    // calculate actual portfolio %s
    // if one or more deltas were negative, will not be equal to target %s
    var actualPortfolioPercents = deltas.map(function (delta, i) {
        var account = investmentAccounts[i];
        var endAmount = account.netAccountValue + delta;
        var percent = roundDecimalPlaces(endAmount / endingPortfolioValue);
        return percent;
    });
    // convert delta values to monthly
    deltas = deltas.map(function (delta) { return roundDecimalPlaces(delta / months); });
    // set up result format
    var resultAccounts = investmentAccounts.map(function (account, i) {
        return __assign(__assign({}, account), { output: {
                monthlyDeposit: deltas[i],
                actualPortfolioPercentage: actualPortfolioPercents[i],
            } });
    });
    // TODO delete?
    var foo = resultAccounts.map(function (account, i) {
        return {
            NAV_pre: account.netAccountValue,
            NAV_post: account.netAccountValue + account.output.monthlyDeposit * months,
            MD: account.output.monthlyDeposit,
            TPP: account.input.targetPortfolioPercentage,
            APP: account.output.actualPortfolioPercentage,
        };
    });
    console.table(foo);
    return resultAccounts;
};
exports.calculateMonthlyDepositAmounts = calculateMonthlyDepositAmounts;
