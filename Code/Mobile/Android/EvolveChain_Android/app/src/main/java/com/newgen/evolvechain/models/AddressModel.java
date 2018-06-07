package com.newgen.evolvechain.models;

/**
 * Created by onkar.gupta on 5/23/2018.
 *
 */

public class AddressModel {
    private int type;

    public AddressModel(int type){
        this.type = type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }
}
