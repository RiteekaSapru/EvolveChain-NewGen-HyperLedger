package com.newgen.evolvechain.uis.activities;

import android.app.Application;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.CountDownTimer;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.BaseActivity;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.ImageLoaderTask;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.PinText;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

public class UserProfileActivity extends BaseActivity {

    private EditText emailText, phoneText;
    private PinText otpText;
    private TextView isdText;
    private Button resendButton;
    private LinearLayout otpLayout;
    private ImageView emailImage, phoneImage;

    private boolean isEditingEmail = false;
    private boolean isEditingPhone = false;

    private static final int VERIFYING_EMAIL = 0;
    private static final int VERIFYING_PHONE = 1;
    private int verifying;
    int count = 60;


    String[] countryNames;
    String currentBodyData;
    CountryCodeModel[] list;
    String verifiedEmail, verifiedPhone;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);

        //getCountryDataFromSingleton();

        emailText = findViewById(R.id.email_text);
        phoneText = findViewById(R.id.phone_text);
        isdText = findViewById(R.id.isd_code);
        otpLayout = findViewById(R.id.otp_layout);
        resendButton = findViewById(R.id.resend_button);
        resendButton.setEnabled(false);
        otpText = findViewById(R.id.edit_text_otp);
        emailImage = findViewById(R.id.email_image);
        phoneImage = findViewById(R.id.phone_image);
//        isdText.setText(list[0].getPhoneCode());

        UserBasicModel basicModel = AppManager.getInstance().basicModelAfterSignIn;
        verifiedEmail = basicModel.getEmail();
        verifiedPhone = basicModel.getPhone();

        setUpUi(basicModel);
    }

    @Override
    public void onBackPressed(){
        if (otpLayout.getVisibility() == View.VISIBLE) {
            otpLayout.setVisibility(View.GONE);
        }
        else {
            if (isEditingEmail) {
                emailText.setFocusableInTouchMode(false);
                emailText.setFocusable(false);
                emailText.clearFocus();
                Utility.hideKeyBoard(this, findViewById(R.id.profile_content));
                emailImage.setImageResource(R.drawable.ic_create_black_24dp);
                isEditingEmail = !isEditingEmail;
            } else {
                if (isEditingPhone) {
                    phoneText.setFocusableInTouchMode(false);
                    phoneText.setFocusable(false);
                    phoneText.clearFocus();
                    Utility.hideKeyBoard(this, findViewById(R.id.profile_content));

                    phoneImage.setImageResource(R.drawable.ic_create_black_24dp);
                    isEditingPhone = !isEditingPhone;
                } else {
                    Intent intent = new Intent(Intent.ACTION_MAIN);
                    intent.addCategory(Intent.CATEGORY_HOME);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                }
            }
        }
    }

    private void setUpUi(UserBasicModel basicModel) {
        String name = "";
        if (AppUtil.isNullValue(basicModel.getMiddleName())) {
            name = AppUtil.checkNullValue(basicModel.getFirstName()) + " " + AppUtil.checkNullValue(basicModel.getLastName());
        }
        else {
            name = AppUtil.checkNullValue(basicModel.getFirstName()) + " " + basicModel.getMiddleName() +" " + AppUtil.checkNullValue(basicModel.getLastName());
        }
        ((TextView) findViewById(R.id.name)).setText(name);
        ((TextView) findViewById(R.id.id_text)).setText(AppManager.getInstance().kycId);
        ((TextView) findViewById(R.id.email_text)).setText(basicModel.getEmail());
        ((TextView) findViewById(R.id.phone_text)).setText(basicModel.getPhone());
        ((TextView) findViewById(R.id.dob_text)).setText(basicModel.getDob());
        ((TextView) findViewById(R.id.place_birth_text)).setText(basicModel.getPlaceBirth());
        ((TextView) findViewById(R.id.address_text)).setText(basicModel.getAddress1() + " " + AppUtil.checkNullValue(basicModel.getAddress2()));
        ((TextView) findViewById(R.id.street_text)).setText(basicModel.getStreet());
        ((TextView) findViewById(R.id.city_text)).setText(basicModel.getCity());
        ((TextView) findViewById(R.id.zip_text)).setText(basicModel.getZip());
        ((TextView) findViewById(R.id.state_text)).setText(basicModel.getState());
        ((TextView) findViewById(R.id.country_text)).setText(basicModel.getCountry());

        new ImageLoaderTask(basicModel.getUri().toString(), ((ImageView) findViewById(R.id.profile_image))).execute();

    }

    public void onSettingClick(View view) {
        Intent intent = new Intent(this, SettingActivity.class);
        startActivity(intent);
    }

    public void onEmailChangeClick(View view) {
        ImageView imageView = (ImageView) view;
        if (isEditingEmail) {
            emailText.setFocusableInTouchMode(false);
            emailText.setFocusable(false);
            emailText.clearFocus();
            Utility.hideKeyBoard(this, findViewById(R.id.profile_content));

            if (!emailText.getText().toString().equals(verifiedEmail)) {
                changeEmail();
            }

            imageView.setImageResource(R.drawable.ic_create_black_24dp);
        } else {
            imageView.setImageResource(R.drawable.ic_check_black_24dp);
            emailText.setFocusable(true);
            emailText.setFocusableInTouchMode(true);
            emailText.requestFocus();
            Utility.openKeyBoard(this, findViewById(R.id.profile_content));
        }

        isEditingEmail = !isEditingEmail;
    }

    public void onPhoneChangeClick(View view) {
        ImageView imageView = (ImageView) view;
        if (isEditingPhone) {
            phoneText.setFocusableInTouchMode(false);
            phoneText.setFocusable(false);
            phoneText.clearFocus();
            Utility.hideKeyBoard(this, findViewById(R.id.profile_content));

            if (!phoneText.getText().toString().equals(verifiedPhone)) {
                changePhone();
            }

            imageView.setImageResource(R.drawable.ic_create_black_24dp);
        } else {
            imageView.setImageResource(R.drawable.ic_check_black_24dp);
            phoneText.setFocusable(true);
            phoneText.setFocusableInTouchMode(true);
            phoneText.requestFocus();
            Utility.openKeyBoard(this, findViewById(R.id.profile_content));
        }

        isEditingPhone = !isEditingPhone;
    }

    public static boolean isValidEmail(CharSequence target) {
        return (!TextUtils.isEmpty(target) && Patterns.EMAIL_ADDRESS.matcher(target).matches());
    }

    private void changeEmail() {
        verifying = VERIFYING_EMAIL;
        String email = emailText.getText().toString();
        if (!isValidEmail(email)) {
            DialogsManager.showErrorDialog(this, "Error", "Please enter valid email");
            emailText.setText(verifiedEmail);
        } else {

            final JSONObject object = new JSONObject();
            try {
                object.put("email", email);
            } catch (Exception e) {
                e.printStackTrace();
            }

            currentBodyData = object.toString();
            final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_EMAIL_OTP + AppManager.getInstance().loginToken;

            new PostTask(object.toString(), urlData, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(UserProfileActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();

                    try {
                        JSONObject jsonObject = new JSONObject(result);
                        int statusCode = jsonObject.getInt("success");
                        switch (statusCode) {
                            case 0:
                                DialogsManager.showErrorDialog(UserProfileActivity.this, "Error", jsonObject.getString("error"));
                                break;
                            case 1:
                                handleOTPLayout(VERIFYING_EMAIL);
                                break;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        DialogsManager.showErrorDialog(UserProfileActivity.this, "Error", result);
                    }
                }
            }).execute();
        }
    }

    private void changePhone() {
        verifying = VERIFYING_PHONE;
        String phone = phoneText.getText().toString();
        if (phone.length() <= 0) {
            DialogsManager.showErrorDialog(this, "Error", "Please enter contact number");
            phoneText.setText(verifiedPhone);
        } else {

            final JSONObject object = new JSONObject();
            try {
                object.put("mobile", phone);
                object.put("country_code", isdText.getText().toString());
            } catch (Exception e) {
                e.printStackTrace();
            }

            currentBodyData = object.toString();
            final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_PHONE_OTP + AppManager.getInstance().loginToken;

            new PostTask(object.toString(), urlData, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(UserProfileActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();

                    try {
                        JSONObject jsonObject = new JSONObject(result);
                        int statusCode = jsonObject.getInt("success");
                        switch (statusCode) {
                            case 0:
                                DialogsManager.showErrorDialog(UserProfileActivity.this, "Error", jsonObject.getString("error"));
                                break;
                            case 1:
                                handleOTPLayout(VERIFYING_PHONE);
                                break;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        DialogsManager.showErrorDialog(UserProfileActivity.this, "Error", result);
                    }
                }
            }).execute();
        }

    }

    public void onISDCodeClick(View view) {
        if (isEditingEmail) {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Select your country");
            builder.setItems(countryNames, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    isdText.setText(list[i].getPhoneCode());
                }
            });
            builder.create().show();
        }
    }

    private void getCountryDataFromSingleton() {
        list = AppManager.getInstance().countryCodeModels;

        countryNames = new String[list.length];

        for (int i = 0; i < list.length; i++) {
            countryNames[i] = list[i].getName();
        }
    }

    private void handleOTPLayout(final int verifying) {
        count = 60;
        otpLayout.setVisibility(View.VISIBLE);

        resendButton.setBackgroundColor(ContextCompat.getColor(this, android.R.color.darker_gray));
        resendButton.setEnabled(false);
        startTimer();
        otpText.setFocusable(true);
        otpText.setFocusableInTouchMode(true);
        otpText.requestFocus();

        otpText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                if (str.toString().length() == 6) {
                    callCheckPIN(verifying);
                }
            }
        });
    }

    private void startTimer() {

        new CountDownTimer(60000, 1000) {

            @Override
            public void onTick(long l) {
                count--;
                resendButton.setText("Resend: " + count);
            }

            @Override
            public void onFinish() {
                resendButton.setEnabled(true);
                resendButton.setText("Resend");
                resendButton.setBackgroundColor(ContextCompat.getColor(UserProfileActivity.this, R.color.colorDarkGray));
            }
        }.start();
    }

    private void callCheckPIN(int verifying) {
        if (otpText.getText().toString().trim().length() == 6) {
            Utility.hideKeyBoard(UserProfileActivity.this, this.findViewById(android.R.id.content).getRootView());
            verifyToken(otpText.getText().toString(), verifying);
        }
    }

    private void verifyToken(String s, int verifying) {
        String otpMd5 = Utility.md5(s);

        switch (verifying) {
            case AppConstants.VERIFICATION_TYPE_EMAIL:
                String verifyEmailUrl = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.VERIFY_EMAIL + AppManager.getInstance().loginToken;
                try {
                    JSONObject object = new JSONObject(currentBodyData);
                    object.put("email_code", otpMd5);

                    verifyService(object.toString(), verifyEmailUrl, AppConstants.VERIFICATION_TYPE_EMAIL);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                break;

            case AppConstants.VERIFICATION_TYPE_PHONE:
                String verifyPhoneUrl = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.VERIFY_PHONE + AppManager.getInstance().loginToken;
                try {
                    JSONObject object = new JSONObject(currentBodyData);
                    object.put("phone_code", otpMd5);
                    verifyService(object.toString(), verifyPhoneUrl, AppConstants.VERIFICATION_TYPE_PHONE);
                } catch (Exception e) {
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
                dialog = ProgressDialog.show(UserProfileActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                otpText.setText("");
                try {
                    JSONObject object = new JSONObject(result);
                    int successCode = object.getInt("success");
                    switch (successCode) {
                        case 0:
                            Animation shake = AnimationUtils.loadAnimation(UserProfileActivity.this, R.anim.shake);
                            otpText.startAnimation(shake);
                            break;
                        case 1:
                            otpLayout.setVisibility(View.GONE);

                            if (VERIFICATION_TYPE == AppConstants.VERIFICATION_TYPE_EMAIL) {
                                changeToSharePrefData(VERIFICATION_TYPE);
                            } else {
                                if (VERIFICATION_TYPE == AppConstants.VERIFICATION_TYPE_PHONE) {
                                    changeToSharePrefData(VERIFICATION_TYPE);
                                }
                            }
                            break;
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    DialogsManager.showErrorDialog(UserProfileActivity.this, "Error", result);
                    otpLayout.setVisibility(View.GONE);
                }
            }
        }).execute();
    }

    private void changeToSharePrefData(int verification_type) {
        switch (verification_type) {
            case AppConstants.VERIFICATION_TYPE_EMAIL:
                try {
                    verifiedEmail = emailText.getText().toString();
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case AppConstants.VERIFICATION_TYPE_PHONE:
                try {
                    verifiedPhone = phoneText.getText().toString();
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
                break;
        }
    }

    public void onResendClick(View view) {
        count = 60;
        resendClickHandle(view, verifying);
    }
    private void resendClickHandle(View view, int i) {
        resendButton.setEnabled(false);
        otpText.setText("");
        resendButton.setBackgroundColor(ContextCompat.getColor(UserProfileActivity.this, android.R.color.darker_gray));

        if (i == VERIFYING_EMAIL) {
            changeEmail();
        } else {
            changePhone();
        }
    }
}
