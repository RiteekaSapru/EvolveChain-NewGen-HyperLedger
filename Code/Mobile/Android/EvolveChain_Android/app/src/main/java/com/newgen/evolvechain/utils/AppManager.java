package com.newgen.evolvechain.utils;

import com.newgen.evolvechain.models.AddressModel;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.DocTypeModel;
import com.newgen.evolvechain.models.DocumentModel;
import com.newgen.evolvechain.models.HoldingDocumentModel;
import com.newgen.evolvechain.models.IdentityModel;
import com.newgen.evolvechain.models.UserAddressModel;
import com.newgen.evolvechain.models.UserBankModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.models.UserIdentityModel;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;
import com.newgen.evolvechain.models.documnets.TaxationModel;
import com.newgen.evolvechain.models.documnets.UtilityBillModel;
import com.newgen.evolvechain.models.documnets.UtilityBillTypeModel;

import java.util.ArrayList;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class AppManager {
    private static final AppManager ourInstance = new AppManager();

    public String initToken = "";
    public String loginToken = "";

    public boolean isUserVerified = false;

    public String uuid = "";
    public String kycId = "";
    //public String pinMd5 = "";
    public String birthDateString = "";

    public UserBasicModel basicModel, basicModelAfterSignIn;
    public UserIdentityModel identityModel = new UserIdentityModel();
    public UserAddressModel addressModel;
    public UserBankModel bankModel;

    public DrivingLicenseModel drivingLicenseModel;
    public PassportModel passportModel;
    public TaxationModel taxationModel;
    public UtilityBillModel utilityBillModel;
    public IdentityModel identityModelV1 = new IdentityModel(-1);
    public AddressModel addressModelV1 = new AddressModel(-1);

    public CountryCodeModel[] countryCodeModels;
    public UtilityBillTypeModel[] utilityBillTypeModels;
    String signUpInitKey = "";
    public String minAge = "";
    public String maxAge = "";
    String dateFormat = "";

    public int selectedCountry = -1;
    public ArrayList<DocTypeModel> identityDocs, addressDocs;
    public CountryCodeModel selectedCountryModel;
    public DocumentModel identityDocumentModel, addressDocumentModel;
    public HoldingDocumentModel holdingDocumentModel;

    public static AppManager getInstance() {
        return ourInstance;
    }

    private AppManager() {
    }
}
