package com.newgen.evolvechain.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;

/**
 * Created by onkar.gupta on 5/18/2018.
 *
 */

public class SharedPrefManager {
    SharedPreferences mSharedPreferences;
    SharedPreferences.Editor mEditor;
    Context context;

    public SharedPrefManager(Context context) {
        this.context = context;
        mSharedPreferences = context.getSharedPreferences(AppConstants.SHARED_PREF_NAME, Context.MODE_PRIVATE);
        mEditor = mSharedPreferences.edit();
    }

    public void setInitToken(String initToken){
        mEditor.putString(AppConstants.INIT_TOKEN_PREF_KEY, initToken);
        mEditor.commit();

        AppManager.getInstance().initToken = initToken;
    }

    public String getInitToken() {
        return mSharedPreferences.getString(AppConstants.INIT_TOKEN_PREF_KEY, "");
    }

    public String getUUID() {
        return mSharedPreferences.getString(AppConstants.UUID_KEY, "");
    }

    public void setUUID(String id) {
        mEditor.putString(AppConstants.UUID_KEY, id);
        mEditor.commit();

        AppManager.getInstance().uuid = id;
    }

    private void saveUserData(String userData) {
        mEditor.putString(AppConstants.USER_DATA_KEY, userData);
        mEditor.commit();
    }

    public void saveKycId(String kycId) {
        mEditor.putString(AppConstants.KYC_ID_KEY, kycId);
        mEditor.commit();
    }

    private void savePinMd5(String pin) {
        //AppManager.getInstance().pinMd5 = pin;
        mEditor.putString(AppConstants.PIN_KEY, pin);
        mEditor.commit();
    }

    private UserBasicModel getUserData() {
        return AppUtil.getBasicModel(mSharedPreferences.getString(AppConstants.USER_DATA_KEY, ""));
    }

    private String getUserDataInString() {
        return mSharedPreferences.getString(AppConstants.USER_DATA_KEY, "");
    }

    public   String getKycId() {
        return mSharedPreferences.getString(AppConstants.KYC_ID_KEY, "");
    }

    private String getPinMd5() {
        return mSharedPreferences.getString(AppConstants.PIN_KEY, "");
    }
}
