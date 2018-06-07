package com.newgen.evolvechain.models.documnets;

import android.net.Uri;

/**
 * Created by onkar.gupta on 5/23/2018.
 *
 */

public class DrivingLicenseModel {
    private String number, expiryDate, issueCountry;
    private Uri frontUri, backUri;

    public DrivingLicenseModel(String number, String expiryDate, String issueCountry, Uri frontUri, Uri backUri){
        this.number = number;
        this.expiryDate = expiryDate;
        this.issueCountry = issueCountry;
        this.frontUri = frontUri;
        this.backUri = backUri;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public String getNumber() {
        return number;
    }

    public String getIssueCountry() {
        return issueCountry;
    }

    public Uri getBackUri() {
        return backUri;
    }

    public Uri getFrontUri() {
        return frontUri;
    }
}
