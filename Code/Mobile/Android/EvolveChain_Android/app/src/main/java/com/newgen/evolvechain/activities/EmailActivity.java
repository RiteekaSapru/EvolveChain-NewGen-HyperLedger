package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.EditText;

import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

import java.util.UUID;

public class EmailActivity extends AppCompatActivity {

    private EditText emailText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_email);
        emailText = findViewById(R.id.edit_text_email);
    }

    public void onAddClick(View view) {
        if (isValidEmail(emailText.getText().toString())) {
            final JSONObject object = new JSONObject();
            try {
                object.put("email", emailText.getText().toString());
            }
            catch (Exception e) {
                e.printStackTrace();
            }

            if (AppManager.getInstance().initToken.length() <= 0) {
                getInitToken(view);
            }
            else {
                final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_EMAIL_OTP + AppManager.getInstance().initToken;

                new PostTask(object.toString(), urlData, new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(EmailActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();

                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int statusCode = jsonObject.getInt("success");
                            switch (statusCode) {
                                case 0:
                                    DialogsManager.showErrorDialog(EmailActivity.this, "Error", jsonObject.getString("error"));
                                    break;
                                case 1:
                                    Intent intent = new Intent(EmailActivity.this, OTPActivity.class);
                                    intent.putExtra("type", AppConstants.VERIFICATION_TYPE_EMAIL);
                                    intent.putExtra("data", object.toString());
                                    intent.putExtra("url", urlData);
                                    intent.putExtra("value", emailText.getText().toString());
                                    startActivity(intent);
                                    break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(EmailActivity.this, "Error", result);
                        }
                    }
                }).execute();
            }
        }
        else {
            if (emailText.getText().toString().length() <= 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please provide email");
            }
            else {
                DialogsManager.showErrorDialog(this, "Error", "Please provide valid email");
            }
        }
    }

    public static boolean isValidEmail(CharSequence target) {
        return (!TextUtils.isEmpty(target) && Patterns.EMAIL_ADDRESS.matcher(target).matches());
    }

    private void getInitToken(final View view) {
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
                        new SharedPrefManager(EmailActivity.this).setInitToken(initToken);
                        onAddClick(view);
                    }
                }
                catch (Exception e) {
                    e.printStackTrace();
                    DialogsManager.showErrorDialog(EmailActivity.this, "Error", e.toString());
                }
            }
        }).execute();
    }
}
