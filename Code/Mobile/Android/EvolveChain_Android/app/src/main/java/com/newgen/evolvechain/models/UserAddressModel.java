package com.newgen.evolvechain.models;

import android.net.Uri;

/**
 * Created by onkar.gupta on 5/18/2018.
 * 
 */

public class UserAddressModel {
    private String address, type, number, identityNumber, country, expiryDate;
    private Uri uri1, uri2;

    public UserAddressModel(String address, String type, String number, Uri uri1, Uri uri2, int fake) {
        this.address = address;
        this.type = type;
        this.number = number;
        this.uri1 = uri1;
        this.uri2 = uri2;
    }

    public UserAddressModel(String identityNumber, String country, String expiryDate, Uri uri1, Uri uri2) {
        this.identityNumber = identityNumber;
        this.uri1 = uri1;
        this.uri2 = uri2;
        this.expiryDate = expiryDate;
        this.country = country;
    }

    public Uri getUri1() {
        return uri1;
    }

    public Uri getUri2() {
        return uri2;
    }

    public String getCountry() {
        return country;
    }

    public String getNumber() {
        return number;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public String getAddress() {
        return address;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public String getType() {
        return type;
    }
}
