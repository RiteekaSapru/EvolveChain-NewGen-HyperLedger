package com.newgen.evolvechain.models.documnets;

import android.net.Uri;

/**
 * Created by onkar.gupta on 5/23/2018.
 *
 */

public class TaxationModel {
    private String number, dob, country;
    private Uri frontUri, backUri;

    public TaxationModel(String number, String dob, String country, Uri frontUri, Uri backUri){
        this.number = number;
        this.dob = dob;
        this.country = country;
        this.frontUri = frontUri;
        this.backUri = backUri;
    }

    public String getNumber() {
        return number;
    }

    public Uri getBackUri() {
        return backUri;
    }

    public Uri getFrontUri() {
        return frontUri;
    }

    public String getCountry() {
        return country;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }
}
