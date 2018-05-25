package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.CountDownTimer;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.Utility;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;

import org.json.JSONObject;

public class OTPActivity extends AppCompatActivity {

    private int count = 60;
    private Button resendButton;
    private static int VERIFICATION_TYPE;
    private String bodyData, urlData, valueData;
    private EditText editTextOTP;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otp);

        initUIs();
        startTimer();
        VERIFICATION_TYPE = getIntent().getIntExtra("type", AppConstants.VERIFICATION_TYPE_EMAIL);
        bodyData = getIntent().getStringExtra("data");
        urlData = getIntent().getStringExtra("url");
        valueData = getIntent().getStringExtra("value");
    }

    private void startTimer() {

        new CountDownTimer(60000, 1000){

            @Override
            public void onTick(long l) {
                count--;
                resendButton.setText("Resend: " + count);
            }

            @Override
            public void onFinish() {
                resendButton.setEnabled(true);
                resendButton.setText("Resend");
                resendButton.setBackgroundColor(ContextCompat.getColor(OTPActivity.this, R.color.colorDarkGray));
            }
        }.start();
    }

    private void initUIs() {
        resendButton = findViewById(R.id.resend_button);
        editTextOTP = findViewById(R.id.edit_text_otp);
    }

    public void onVerifyClick(View view) {

        String otpMd5 = getMd5Otp(editTextOTP.getText().toString());

        switch (VERIFICATION_TYPE){
            case AppConstants.VERIFICATION_TYPE_EMAIL:
                String verifyEmailUrl = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.VERIFY_EMAIL + AppManager.getInstance().initToken;
                try {
                    JSONObject object = new JSONObject(bodyData);
                    object.put("email_code", otpMd5);

                    verifyService(object.toString(), verifyEmailUrl, AppConstants.VERIFICATION_TYPE_EMAIL);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }

                break;

            case AppConstants.VERIFICATION_TYPE_PHONE:
                String verifyPhoneUrl = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.VERIFY_PHONE + AppManager.getInstance().initToken;
                try {
                    JSONObject object = new JSONObject(bodyData);
                    object.put("phone_code", otpMd5);
                    verifyService(object.toString(), verifyPhoneUrl, AppConstants.VERIFICATION_TYPE_PHONE);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
                    break;
        }
    }

    private void verifyService(String s, String url, final int VERIFICATION_TYPE) {
        new PostTask(s, url, new WebConnectionListener() {
            ProgressDialog dialog;
            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(OTPActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                try {
                    JSONObject object = new JSONObject(result);
                    int successCode = object.getInt("success");
                    switch (successCode) {
                        case 0:
                            break;
                        case 1:
                            if (VERIFICATION_TYPE == AppConstants.VERIFICATION_TYPE_EMAIL) {
                                //AppManager.getInstance().basicModel.setEmail(valueData);
                            }
                            else {
                                if (VERIFICATION_TYPE == AppConstants.VERIFICATION_TYPE_PHONE) {
                                    //AppManager.getInstance().basicModel.setContactNumber(valueData);
                                }
                            }
                            Intent intent = new Intent(OTPActivity.this, BasicDetailsActivity.class);
                            startActivity(intent);
                            break;
                    }

                }
                catch (Exception e) {
                    e.printStackTrace();
                    DialogsManager.showErrorDialog(OTPActivity.this, "Error", result);
                }
            }
        }).execute();
    }

    private String getMd5Otp(String s) {
        return Utility.md5(s);
    }

    public void onResendClick(View view) {
        resendButton.setEnabled(false);

        new PostTask(bodyData, urlData, new WebConnectionListener() {
            ProgressDialog dialog;
            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(OTPActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                try {
                    JSONObject object = new JSONObject(result);
                    int successCode = object.getInt("success");
                    switch (successCode) {
                        case 0:
                            startTimer();
                            break;
                        case 1:
                            break;
                    }

                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).execute();
    }
}
