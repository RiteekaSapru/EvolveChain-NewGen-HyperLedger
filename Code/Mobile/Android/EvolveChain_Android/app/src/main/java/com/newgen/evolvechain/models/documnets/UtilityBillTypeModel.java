package com.newgen.evolvechain.models.documnets;

/**
 * Created by onkar.gupta on 5/31/2018.
 *
 */

public class UtilityBillTypeModel {
    private String code, name;

    public UtilityBillTypeModel(String code, String name){
        this.code = code;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }
}
