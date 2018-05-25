package com.newgen.evolvechain.utils;

import android.content.Context;
import android.content.SharedPreferences;

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
}
