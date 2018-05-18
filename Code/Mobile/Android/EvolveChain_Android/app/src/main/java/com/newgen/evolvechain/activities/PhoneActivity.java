package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.newgen.evolvechain.AppConstants;
import com.newgen.evolvechain.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

public class PhoneActivity extends AppCompatActivity {
    String[] countryNames;
    ArrayList<CountryCodeModel> list;
    TextView isdCode;
    EditText mobileNumber;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_phone);
        isdCode = findViewById(R.id.isd_code);
        initUis();

        getCountryData();
    }

    private void initUis() {
        isdCode = findViewById(R.id.isd_code);
        mobileNumber = findViewById(R.id.mobile_number);
    }

    private void getCountryData() {
        String data = loadJSONFromAsset();
        parseDataToList(data);
    }

    private void parseDataToList(String data) {
        list = new ArrayList<>();

        try {
            JSONArray object = new JSONArray(data);

            for (int i = 0; i < object.length(); i++) {
                JSONObject jsonObject = object.getJSONObject(i);
                CountryCodeModel model = new CountryCodeModel(jsonObject.getString("PhoneCode"), jsonObject.getString("Country"));
                list.add(model);
            }

            Log.d("size", "size");

            countryNames = new String[list.size()];

            for (int i = 0; i < list.size(); i++) {
                countryNames[i] = list.get(i).getName();
            }

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void onISDCodeClick(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select your country");
        builder.setItems(countryNames, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                isdCode.setText(list.get(i).getPhoneCode());
            }
        });
        builder.create().show();
    }

    public void onGetOtpClick(View view) {
        if (mobileNumber.getText().toString().length() > 0) {

            final JSONObject object = new JSONObject();
            try {
                object.put("mobile", mobileNumber.getText().toString());
                object.put("country_code", isdCode.getText().toString());
            }
            catch (Exception e){
                e.printStackTrace();
            }

            final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_PHONE_OTP + AppManager.getInstance().initToken;

            new PostTask(object.toString(), urlData, new WebConnectionListener() {
                ProgressDialog dialog;
                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(PhoneActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                    try {
                        JSONObject jsonObject = new JSONObject(result);
                        int successCode = jsonObject.getInt("success");
                        if (successCode == 1) {
                            Intent intent = new Intent(PhoneActivity.this, OTPActivity.class);
                            intent.putExtra("type", AppConstants.VERIFICATION_TYPE_PHONE);
                            intent.putExtra("data", object.toString());
                            intent.putExtra("url", urlData);
                            intent.putExtra("value", isdCode.getText().toString() + mobileNumber.getText().toString());
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

    public String loadJSONFromAsset() {
        String json = null;
        try {
            InputStream is = this.getAssets().open("CountryList.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;
    }
}
