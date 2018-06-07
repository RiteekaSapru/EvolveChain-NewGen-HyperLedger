package com.newgen.evolvechain.models.documnets;

import android.net.Uri;

/**
 * Created by onkar.gupta on 5/23/2018.
 *
 */

public class UtilityBillModel {
    private String type, number, address;
    private Uri frontUri, backUri;

    public UtilityBillModel(String type, String number, String address, Uri frontUri, Uri backUri) {
        this.type = type;
        this.number = number;
        this.address = address;
        this.frontUri = frontUri;
        this.backUri = backUri;
    }

    public Uri getFrontUri() {
        return frontUri;
    }

    public Uri getBackUri() {
        return backUri;
    }

    public String getNumber() {
        return number;
    }

    public String getType() {
        return type;
    }

    public String getAddress() {
        return address;
    }
}
