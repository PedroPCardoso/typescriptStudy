function Qualifier(data) {

    var self = this;

    self.id = ko.observable();
    self.franchiseesId = ko.observable();
    self.cDate = ko.observable().extend({ datetime: 1 });
    self.cUserId = ko.observable();
    self.lMDate = ko.observable().extend({ datetime: 1 });
    self.lMUserId = ko.observable();
    self.description = ko.observable();
    //notes
    self.loanToValueIndicator = ko.observable(0.90).extend({ percentage: 2 });
    self.effortRateIndicator = ko.observable(0.35).extend({ percentage: 2 });
    self.dSTIIndicator = ko.observable(0.50).extend({ percentage: 2 });
    self.solvencyMax = ko.observable(1.00).extend({ percentage: 2 });
    self.stressShock = ko.observable(0.015).extend({ percentage: 2 });



    self.name = ko.observable();
    self.phone = ko.observable();
    self.taxType = ko.observable("V");

    self.acquisitionValue = ko.observable(0).extend({ money: 2 });
    self.initialEntry = ko.observable(0).extend({ money: 2 });
    self.valuationValue = ko.observable(0).extend({ money: 2 });
    self.residualValue = ko.observable(0).extend({ money: 2 });

    self.proponentAgeOlder = ko.observable(0);
    self.intendedTerm = ko.observable(0);

    self.intendedTermMonth = ko.pureComputed(function () {
        return parseInt(self.intendedTerm()) * 12;
    });

    self.maximumTerm = ko.pureComputed(function () {
        var i = parseInt(self.proponentAgeOlder());
        var j = 75 - i;
        var a = (j >= 45 ? 40
            : j < 45 && j >= 40 ? 37
                : j < 40 ? (j > 35 ? 35 : j)
                    : 30);
        return a;
    }); //not in bd
    self.comments = ko.observable();//not in bd


    self.grossMonthlyIncome = ko.observable(0).extend({ money: 2 });
    self.netMonthlyIncome = ko.observable(0).extend({ money: 2 });
    self.financialCharges = ko.observable(0).extend({ money: 2 });
    //self.euriborTax = ko.observable(0.263).extend({ percentage: 3 });
    //self.euriborTax = ko.observable(0.02363).extend({ percentage: 3 });
    self.euriborTax = ko.observable().extend({ percentage: 3 });
    self.spread = ko.observable(0.012).extend({ percentage: 2 });

    self.nominalRate = ko.pureComputed({

        read: function () {
            return (self.euriborTax.raw() + self.spread.raw())
        },
        write: function () { }

    }).extend({ percentage: 2 });

    self.rateMonth = ko.pureComputed(function () {
        var juros = 0;
        if (self.taxType() == "V")
            juros = self.nominalRate.raw()  / 12;

        if (self.taxType() == "V6")
            juros = self.nominalRate.raw() / 12;

        if (self.taxType() == "V3")
            juros = self.nominalRate.raw() / 12;

        if (self.taxType() == "F")
            juros = self.fixedRateNegotiated.raw() / 12;

        return juros;
    });


    self.rateMonthStress = ko.pureComputed(function () {
        var sr = 0.0;
        if (self.taxType() == "V")
            sr = self.stressShock.raw();
        if (self.taxType() == "V6")
            sr = self.stressShock.raw();
        if (self.taxType() == "V3")
            sr = self.stressShock.raw();

        var juros = self.rateMonth() + (sr / 12);
        return juros;
    })

    //self.fixedRateNegotiated = ko.observable(2.95).extend({ percentage: 2 });
    self.fixedRateNegotiated = ko.observable(0.02950).extend({ percentage: 2 });
    self.numberDependents = ko.observable(0);
    self.generalFamilyExpenses = ko.observable().extend({ money: 2 });


    self.loanToValue = ko.pureComputed(function () {
        var l = (self.maximumFinancingAmount.raw() ? self.finalFinancingValue.raw() / self.valuationValue.raw() : 0)
        return l;
    }).extend({ percentage: 2 });

    self.monthlyPay = ko.pureComputed({
        read: function () {
            //?? =SE(C14=0; final value
            //??' PGTO((SE(C6 = "Taxa Fixa"; C29; C26 + C27)) / 12; C19 * 12; 1; 0; 0)* (-1);
            // PGTO((SE(C6 = "Taxa Fixa"; C29; C26 + C27)) / 12; C19 * 12; C14; 0; 0)* (-1))
            var mp = 0;
            var juros = self.rateMonth();
            var valor = self.finalFinancingValue.raw();
            var prest = self.intendedTermMonth(); // monthly

            if (valor == 0)
                valor = 1;

            mp = self.PMT(juros, prest, valor, 0);
            if (!isFinite(mp)) mp = 0;

            return mp;
        },
        write: function () { }
    }).extend({ money: 2 });

    self.monthlyPayStress = ko.pureComputed({
        read: function () {
            var mp = 0;
            var juros = self.rateMonthStress();
            var valor = self.finalFinancingValue.raw();
            var prest = self.intendedTermMonth(); // monthly

            if (valor == 0)
                valor = 1;

            mp = self.PMT(juros, prest, valor, 0);
            if (!isFinite(mp)) mp = 0;
            return mp;
        },
        write: function () { }
    }).extend({ money: 2 });

    self.effortRate = ko.pureComputed({
        read: function () {
            //=(-PGTO((SE(C6 = "Taxa Fixa"; C29; C26 + C27 + 3 %)) / 12; C19 * 12; C14; 0; 0) +C23) /C21
            var mp = self.monthlyPayStress.raw();
            var er = (mp + self.financialCharges.raw()) / self.grossMonthlyIncome.raw();
            if (!isFinite(er)) er = 0;
            return er;
        },
        write: function () {
        }

    }).extend({ percentage: 2 });



    self.familyMonthExpenses = ko.pureComputed(function () {
        var ex = 0;
        var mp = self.monthlyPay.raw();
        var ex = (self.generalFamilyExpenses.raw() + (100 * self.numberDependents()) + self.financialCharges.raw() + mp);
        return ex;
    })

    self.solvency = ko.pureComputed({
        read: function () {
            var s = 0;
            if (self.netMonthlyIncome.raw())
                s = self.familyMonthExpenses() / self.netMonthlyIncome.raw();

            return s;
        },
        write: function () {
        }

    }).extend({ percentage: 2 });

    self.budgetAvailable = ko.pureComputed({
        read: function () {
            var s = self.familyMonthExpenses();
            return self.netMonthlyIncome.raw() - s;
        },
        write: function () {

        }
    }).extend({ money: 2 });

    self.maximumMonthlyER = ko.pureComputed(function () {
        //=(0, 35 * C21 - C23) / (G8 / F8)
        var s = self.grossMonthlyIncome.raw() * self.effortRateIndicator.raw() - self.financialCharges.raw();
        var d = (self.monthlyPay.raw() ? self.monthlyPayStress.raw() / self.monthlyPay.raw() : 0);
        var m = (d ? s / d : 0);
        return m;
    }).extend({ money: 2 });

    self.maximumLoanER = ko.pureComputed(function () {
        var pmt = self.grossMonthlyIncome.raw() * self.effortRateIndicator.raw() - self.financialCharges.raw();
        var rate = self.rateMonthStress();
        var prest = self.intendedTermMonth(); // monthly
        var pv = self.PV(rate, prest, pmt);
        return pv;

    }).extend({ money: 2 });


    self.netMonthlyIncomeByAge = ko.pureComputed(function () {
        var i = parseInt(self.intendedTerm());
        var p = parseInt(self.proponentAgeOlder()) + i;
        var a = (p > 70 ? self.netMonthlyIncome.raw() * (1 - (0.2 * ((p - 70) / i))) : self.netMonthlyIncome.raw());

        return a;
    });

    self.dSTI = ko.pureComputed({
        read: function () {
            var mp = self.monthlyPayStress.raw();
            //var ndp = self.numberDependents() * 200
            //var d = (/*ndp +*/ mp + self.financialCharges.raw()) / self.netMonthlyIncomeByAge();

            if (self.financialCharges.raw() != 0) {
                var d = (self.financialCharges.raw() - (-mp)) / self.netMonthlyIncomeByAge();
            }
            else {
                var d = (mp) / self.netMonthlyIncomeByAge();
            }



            if (!isFinite(d)) d = 0;
            return d;
        },
        write: function () {
        }

    }).extend({ percentage: 2 });

    self.maximumMonthlyDSTI = ko.pureComputed({
        read: function () {
            var s = (self.netMonthlyIncomeByAge() * self.dSTIIndicator.raw()) - self.financialCharges.raw();
            var d = (self.monthlyPay.raw() ? self.monthlyPayStress.raw() / self.monthlyPay.raw() : 0);
            var m = (d ? s / d : 0);
            return m;
        },
        write: function () { }
    }).extend({ money: 2 });

    self.maximumLoanDSTI = ko.pureComputed(function () {
        var pmt = self.netMonthlyIncomeByAge() * self.dSTIIndicator.raw() - self.financialCharges.raw();
       // var ndp = self.numberDependents() * 200;
        var rate = self.rateMonthStress();
        var prest = self.intendedTermMonth(); // monthly
        var pv = self.PV(rate, prest, pmt/*, ndp*/);
        return pv;

    }).extend({ money: 2 });

    self.maximumValueProperty = ko.pureComputed(function () {
        /*var l = (self.maximumLoanER.raw() > self.maximumLoanDSTI.raw() ? self.maximumLoanDSTI.raw() : self.maximumLoanER.raw());*/
        //var l = self.maximumLoanDSTI.raw();
        var l = Math.min(self.maximumLoanER.raw(), self.maximumLoanDSTI.raw());
        return l / 0.90;
    }).extend({ money: 2 });

    self.solvencyCSS = ko.pureComputed(function () {
        var c = "bg-green";
        var s = self.solvency.raw();
        if (s > 1)
            c = "bg-red";
        else if (s == 0)
            c = "bg-gray";
        return c;
    });

    self.intendedTermCSS = ko.pureComputed(function () {
        var c = "bg-green";
        var s = parseInt(self.intendedTerm());
        if (s > self.maximumTerm())
            c = "bg-red";
        else if (s == 0)
            c = "bg-gray";
        else if (s > 40)
            c = "bg-red";
        return c;
    });

    self.finalFinancingValueCSS = ko.pureComputed(function () {
        var c = "bg-green";
        var s = self.finalFinancingValue.raw();
        if (s > self.maximumFinancingAmount.raw())
            c = "bg-red";
        else if (s == 0)
            c = "bg-gray";
        return c;
    });

    self.dSTICSS = ko.pureComputed(function () {
        var c = "bg-green";
        var s = self.dSTI.raw();
        if (s > self.dSTIIndicator.raw())
            c = "bg-red";
        else if (s == 0)
            c = "bg-gray";
        return c;
    });

    self.effortRateCSS = ko.pureComputed(function () {
        var c = "bg-green";
        var s = self.effortRate.raw();
        if (s > self.effortRateIndicator.raw())
            c = "bg-red";
        else if (s == 0)
            c = "bg-gray";
        return c;
    });

    if (data != null) {
        self.wrap(data);
    }

};

Qualifier.prototype.PMT = function (ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv) / np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * (pv * pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt * -1.0;
}

Qualifier.prototype.PV = function (ir, np, mp, ndp) {
    /** ir   - interest rate per month
     * np   - number of periods (months)
     * mp   - monthly pay
     * ndp - numero dependentes */
    pv = 0
    if (np > 0) {


        var pv = mp / ir * (1 - Math.pow(1 + ir, - np));
        if (ndp > 0) {
            pv = pv - ndp;
        }
    }
    return pv;
}

