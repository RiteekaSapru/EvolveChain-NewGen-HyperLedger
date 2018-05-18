package com.newgen.evolvechain.models;

/**
 * Created by onkar.gupta on 5/18/2018.
 * 
 */

public class UserUtilityModel {
    private String address1, address2, state, country, areaCode;

    public UserUtilityModel(String address1, String address2, String state, String country, String areaCode) {
        this.address1 = address1;
        this.address2 = address2;
        this.state = state;
        this.country = country;
        this.areaCode = areaCode;
    }

    public String getAddress1() {
        return address1;
    }

    public String getAddress2() {
        return address2;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public String getCountry() {
        return country;
    }

    public String getState() {
        return state;
    }
}
