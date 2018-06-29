package com.newgen.evolvechain.models;

import android.net.Uri;

import java.io.Serializable;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class UserBasicModel implements Serializable{
    private Uri uri;
    private String email, phone, isd, firstName, middleName, lastName, gender, dob, placeBirth, address1, address2, street, city, zip, state, country;

    public UserBasicModel(String email, String phone, String isd,
                          String firstName, String middleName, String lastName, String gender,
                          String dob, String placeBirth,
                          Uri uri) {
        this.email = email;
        this.phone = phone;
        this.isd = isd;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.gender = gender;
        this.dob = dob;
        this.placeBirth = placeBirth;
        this.uri = uri;
    }

    public UserBasicModel(String email, String phone, String isd) {
        this.email =email;
        this.phone = phone;
        this.isd = isd;
    }

    public UserBasicModel(String email, String phone, String isd,
                          String firstName, String middleName, String lastName, String gender,
                          String dob, String placeBirth,
                          String address1, String address2,
                          String street, String  city, String zip,
                          String state, String country,
                          Uri uri) {
        this.email = email;
        this.phone = phone;
        this.isd = isd;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.gender = gender;
        this.dob = dob;
        this.placeBirth = placeBirth;
        this.uri = uri;
        this.address2 = address2;
        this.address1 = address1;
        this.street = street;
        this.city = city;
        this.zip = zip;
        this.state = state;
        this.country = country;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setUri(Uri uri) {
        this.uri = uri;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setIsd(String isd) {
        this.isd = isd;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPlaceBirth(String placeBirth) {
        this.placeBirth = placeBirth;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public void setCountry(String country) {
        this.country = country;
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
