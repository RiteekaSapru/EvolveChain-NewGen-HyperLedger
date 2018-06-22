package com.newgen.evolvechain.new_uis;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.newgen.evolvechain.DialogClickListener;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.network_layer.GetTask;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.network_layer.WebConnectionListener;

import org.json.JSONArray;
import org.json.JSONObject;

public class SplashActivity extends AppCompatActivity implements DialogClickListener {

    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 0;
    private static final int MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        checkForPermission();
    }

    private void checkForPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION);
        }
    }

    public void onSignUpClick(View view) {
        TermsDialog dialog = new TermsDialog(this);
        dialog.setListener(this);
        dialog.show();
    }

    public void onAlreadyHaveIdClick(View view) {
        getCountryList(0);
    }

    private void getCountryList(int i) {
        final int tempI = i;
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
                parseCountries(result, tempI);
            }
        }).execute();
    }

    private void parseCountries(String result, int tempI) {
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
            switch (tempI) {
                case 0:
                    Intent signInIntent = new Intent(this, SignInActivity.class);
                    startActivity(signInIntent);
                    break;
                case 1:
                    Intent intent = new Intent(SplashActivity.this, CountrySelectionActivity.class);
                    startActivity(intent);
                    break;
                case 2:
                    Intent editIntent = new Intent(this, EditActivity.class);
                    startActivity(editIntent);
                    break;
            }
        } catch (Exception e) {
            DialogsManager.showErrorDialog(this, "Error", "Some problem occurred, please try again after some time");
            e.printStackTrace();
        }
    }

    public void onEditClick(View view) {
        getCountryList(2);
    }

    //Dialog Listener
    @Override
    public void onTermsLinkClick() {
        try {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://evolvechain.org/terms"));
            startActivity(browserIntent);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPrivacyClick() {
        try {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://evolvechain.org/privacy"));
            startActivity(browserIntent);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onAcceptClick() {
        Log.d("accept", "clicked");
        getCountryList(1);
    }
}
