package com.newgen.evolvechain;

import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.models.UserIdentityModel;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class AppManager {
    private static final AppManager ourInstance = new AppManager();

    public String initToken = "";
    public UserBasicModel basicModel = new UserBasicModel();
    public UserIdentityModel identityModel = new UserIdentityModel();

    public static AppManager getInstance() {
        return ourInstance;
    }

    private AppManager() {
    }
}
