package com.newgen.evolvechain.models;

import android.net.Uri;

/**
 * Created by onkar.gupta on 6/6/2018.
 *
 */

public class DocumentModel {
    private String type, typeCode, number, expiryDate, issueCountry, subType, subTypeCode;
    private Uri frontUri, backUri;

    public DocumentModel(String type, String typeCode, String number, String expiryDate, String issueCountry, String subType, String subTypeCode, Uri frontUri, Uri backUri){
        this.type = type;
        this.typeCode = typeCode;
        this.number = number;
        this.expiryDate = expiryDate;
        this.issueCountry = issueCountry;
        this.subType = subType;
        this.subTypeCode = subTypeCode;
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

    public String getSubType() {
        return subType;
    }

    public String getType() {
        return type;
    }

    public String getSubTypeCode() {
        return subTypeCode;
    }

    public String getTypeCode() {
        return typeCode;
    }
}
