package com.newgen.evolvechain.uis.activities;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.network_layer.GetTask;
import com.newgen.evolvechain.new_uis.EditActivity;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.new_uis.CountrySelectionActivity;

import org.json.JSONArray;
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
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    public void onSignUpClick(View view) {
        getCountryList();
    }

    public void onAlreadyHaveIdClick(View view) {
        Intent intent = new Intent(this, SignInActivity.class);
        startActivity(intent);
    }

    private void getCountryList() {
        String urlData = AppConstants.SERVER_ADDRESS + "web/getcountrylist";

        new GetTask(urlData, new WebConnectionListener() {
            ProgressDialog dialog;

            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(SplashActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                parseCountries(result);
            }
        }).execute();
    }

    private void parseCountries(String result) {
        try {
            JSONArray object = new JSONArray(result);
            CountryCodeModel[] codeModels = new CountryCodeModel[object.length()];
            for (int i = 0; i < object.length(); i++) {
                JSONObject object1 = object.getJSONObject(i);

                //Saving age limit
                JSONObject ageObject = object1.getJSONObject("age_limit");
                String minAge = ageObject.getString("min");
                String maxAge = ageObject.getString("max");
                AppManager.getInstance().minAge = minAge;
                AppManager.getInstance().maxAge = maxAge;


                CountryCodeModel model = new CountryCodeModel(object1.getString("phone_code"), object1.getString("name"), object1.getString("iso"), object1.getString("phone_format"), object1.getBoolean("is_active"));
                codeModels[i] = model;


            }
            AppManager.getInstance().countryCodeModels = codeModels;
            Intent intent = new Intent(SplashActivity.this, CountrySelectionActivity.class);
            startActivity(intent);
        } catch (Exception e) {
            DialogsManager.showErrorDialog(this, "Error", "Some problem occurred, please try again after some time");
            e.printStackTrace();
        }
    }

    public void onEditClick(View view) {
        Intent intent = new Intent(this, EditActivity.class);
        startActivity(intent);
    }
}
