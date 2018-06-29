package com.newgen.evolvechain.models;

/**
 * Created by onkar.gupta on 6/7/2018.
 *
 */

public class DocTypeModel {
    private String name, code;
    private boolean expiryDate;
    private SubDocType[] subDocTypes;

    public DocTypeModel(String name, String code, boolean expiryDate, SubDocType[] subDocTypes) {
        this.name = name;
        this.code = code;
        this.expiryDate = expiryDate;
        this.subDocTypes = subDocTypes;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public SubDocType[] getSubDocTypes() {
        return subDocTypes;
    }

    public boolean isExpiryDate() {
        return expiryDate;
    }
}
