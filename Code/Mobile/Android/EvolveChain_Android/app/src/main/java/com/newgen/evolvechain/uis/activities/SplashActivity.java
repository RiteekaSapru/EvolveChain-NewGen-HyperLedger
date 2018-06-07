package com.newgen.evolvechain.uis.activities;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;

import org.json.JSONObject;

public class SplashActivity extends AppCompatActivity {

    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

//        if (!(new SharedPrefManager(this).getInitToken().length() > 0)) {
//            getInitToken();
//        }
//        else {
//            AppManager.getInstance().initToken = new SharedPrefManager(this).getInitToken();
//            Log.d("initToken", AppManager.getInstance().initToken);
//        }

        checkForPermission();
    }

    private void checkForPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    public void onSignUpClick(View view) {
        getInitToken();
    }

    public void onAlreadyHaveIdClick(View view) {
        Intent intent = new Intent(this, SignInActivity.class);
        startActivity(intent);
    }

    private void getInitToken() {
        String ip = Utility.getIPAddress(true);
        String uniqueId = AppManager.getInstance().uuid;

        String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.INITIALIZE;

        JSONObject bodyJson = new JSONObject();
        try {
            bodyJson.put("ip", ip);
            bodyJson.put("device_type", "android");
            bodyJson.put("device_name", Build.MANUFACTURER + " " + Build.MODEL);
            bodyJson.put("os_version", Build.VERSION.RELEASE);
            bodyJson.put("vendor_uuid", uniqueId);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        new PostTask(bodyJson.toString(), urlData, new WebConnectionListener() {
            @Override
            public void onTaskStart() {
                Log.d("Getting token started", "here");
            }

            @Override
            public void onTaskComplete(String result) {
                Log.d("Token", result);
                try {
                    JSONObject object = new JSONObject(result);
                    int successCode = object.getInt("success");
                    if (successCode == 1) {
                        String initToken = object.getString("key");
                        new SharedPrefManager(SplashActivity.this).setInitToken(initToken);
                        AppUtil.saveSignUpInitData(result);

                        Intent intent = new Intent(SplashActivity.this, CountrySelectionActivity.class);
                        startActivity(intent);
                    }
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).execute();
    }
}
