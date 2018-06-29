package com.newgen.evolvechain.models;

import java.io.Serializable;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
 */

public class CountryCodeModel implements Serializable{
    private String phoneCode, name, iso, phoneFormat;
    private boolean isActive;

    public CountryCodeModel(String phoneCode, String name, String iso, String phoneFormat, boolean isActive){
        this.phoneCode = phoneCode;
        this.name = name;
        this.iso = iso;
        this.phoneFormat = phoneFormat;
        this.isActive = isActive;
    }

    public String getName() {
        return name;
    }

    public String getPhoneCode() {
        return phoneCode;
    }

    public String getIso() {
        return iso;
    }

    public String getPhoneFormat() {
        return phoneFormat;
    }

    public boolean isActive() {
        return isActive;
    }
}
