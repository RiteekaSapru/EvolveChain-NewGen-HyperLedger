package com.newgen.evolvechain.utils;

import com.newgen.evolvechain.models.AddressModel;
import com.newgen.evolvechain.models.IdentityModel;
import com.newgen.evolvechain.models.UserAddressModel;
import com.newgen.evolvechain.models.UserBankModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.models.UserIdentityModel;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;
import com.newgen.evolvechain.models.documnets.TaxationModel;
import com.newgen.evolvechain.models.documnets.UtilityBillModel;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class AppManager {
    private static final AppManager ourInstance = new AppManager();

    public String initToken = "";
    public UserBasicModel basicModel;
    public UserIdentityModel identityModel = new UserIdentityModel();
    public UserAddressModel addressModel;
    public UserBankModel bankModel;

    public DrivingLicenseModel drivingLicenseModel;
    public PassportModel passportModel;
    public TaxationModel taxationModel;
    public UtilityBillModel utilityBillModel;
    public IdentityModel identityModelV1 = new IdentityModel(-1);
    public AddressModel addressModelV1 = new AddressModel(-1);

    public static AppManager getInstance() {
        return ourInstance;
    }

    private AppManager() {
    }
}
