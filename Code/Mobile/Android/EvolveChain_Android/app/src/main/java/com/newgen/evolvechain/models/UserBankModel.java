package com.newgen.evolvechain.models;

/**
 * Created by onkar.gupta on 5/21/2018.
 *
 */

public class UserBankModel {
    private String accountNumber, ifscCode, bankName;

    public UserBankModel(String accountNumber, String ifscCode, String bankName) {
        this.accountNumber = accountNumber;
        this.ifscCode =  ifscCode;
        this.bankName = bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public String getIfscCode() {
        return ifscCode;
    }
}
