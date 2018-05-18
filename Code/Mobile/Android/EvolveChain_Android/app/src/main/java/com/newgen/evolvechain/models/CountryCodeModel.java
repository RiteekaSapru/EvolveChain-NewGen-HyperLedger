package com.newgen.evolvechain.models;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
 */

public class CountryCodeModel {
    private String phoneCode, name;

    public CountryCodeModel(String phoneCode, String name){
        this.phoneCode = phoneCode;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getPhoneCode() {
        return phoneCode;
    }
}
