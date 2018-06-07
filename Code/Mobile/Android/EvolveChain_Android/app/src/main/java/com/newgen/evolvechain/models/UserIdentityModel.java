package com.newgen.evolvechain.models;

import android.net.Uri;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class UserIdentityModel {
    public static final int IDENTITY_DRIVING_LICENSE = 0;
    public static final int IDENTITY_PASSPORT = 1;

    private int type;
    private String number, expiryDate, issueCountry;
    private Uri frontImageUri, backImageUri;

    public UserIdentityModel(){
    }

    public int getType() {
        return type;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public String getNumber() {
        return number;
    }

    public Uri getBackImageUri() {
        return backImageUri;
    }

    public Uri getFrontImageUri() {
        return frontImageUri;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public void setType(int type) {
        this.type = type;
    }

    public void setBackImageUri(Uri backImageUri) {
        this.backImageUri = backImageUri;
    }

    public void setFrontImageUri(Uri frontImageUri) {
        this.frontImageUri = frontImageUri;
    }

    public void setIssueCountry(String issueCountry) {
        this.issueCountry = issueCountry;
    }

    public String getIssueCountry() {
        return issueCountry;
    }
}
