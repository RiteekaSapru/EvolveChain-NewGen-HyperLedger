package com.newgen.evolvechain.models;

import android.net.Uri;

import java.io.Serializable;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class UserBasicModel implements Serializable{
    private Uri uri;
    private String email, phone, isd, firstName, middleName, lastName, dob, placeBirth, address1, address2, street, city, zip, state, country;

    public UserBasicModel(String email, String phone, String isd,
                          String firstName, String middleName, String lastName,
                          String dob, String placeBirth,
                          String address1, String address2, String street, String city,
                          String zip, String state, String country,
                          Uri uri) {
        this.email = email;
        this.phone = phone;
        this.isd = isd;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.dob = dob;
        this.placeBirth = placeBirth;
        this.address1 = address1;
        this.address2 = address2;
        this.street = street;
        this.city = city;
        this.zip = zip;
        this.state = state;
        this.country = country;
        this.uri = uri;
    }

    public Uri getUri() {
        return uri;
    }

    public String getDob() {
        return dob;
    }

    public String getCountry() {
        return country;
    }

    public String getState() {
        return state;
    }

    public String getAddress2() {
        return address2;
    }

    public String getAddress1() {
        return address1;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPlaceBirth() {
        return placeBirth;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getZip() {
        return zip;
    }

    public String getIsd() {
        return isd;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }
}
