package com.newgen.evolvechain.activities;

import android.content.Intent;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.newgen.evolvechain.AppConstants;
import com.newgen.evolvechain.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.SharedPrefManager;
import com.newgen.evolvechain.Utility;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;

import org.json.JSONObject;

import java.util.UUID;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        if (!(new SharedPrefManager(this).getInitToken().length() > 0)) {
            getInitToken();
        }
        else {
            AppManager.getInstance().initToken = new SharedPrefManager(this).getInitToken();
        }
    }

    public void onSignUpClick(View view) {
        Intent intent = new Intent(this, CountrySelectionActivity.class);
        startActivity(intent);
    }

    public void onAlreadyHaveIdClick(View view) {
        Intent intent = new Intent(this, SignInActivity.class);
        startActivity(intent);
    }

    private void getInitToken() {
        String ip = Utility.getIPAddress(true);
        String uniqueId = UUID.randomUUID().toString();

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
                    }
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).execute();
    }
}
