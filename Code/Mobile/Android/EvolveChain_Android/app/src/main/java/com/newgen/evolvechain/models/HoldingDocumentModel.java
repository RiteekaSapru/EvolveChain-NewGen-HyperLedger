package com.newgen.evolvechain.models;

import android.net.Uri;

/**
 * Created by onkar.gupta on 6/8/2018.
 *
 */

public class HoldingDocumentModel {

    private String code;
    private Uri uri;

    public HoldingDocumentModel(String code, Uri uri) {
        this.code = code;
        this.uri = uri;
    }

    public String getCode() {
        return code;
    }

    public Uri getUri() {
        return uri;
    }
}
