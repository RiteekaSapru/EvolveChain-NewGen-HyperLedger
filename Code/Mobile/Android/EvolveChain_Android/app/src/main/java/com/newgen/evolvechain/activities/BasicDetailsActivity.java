package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.util.Patterns;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

import java.util.UUID;

public class BasicDetailsActivity extends AppCompatActivity {

    private static final int PICK_IMAGE = 1;
    private static final int VERIFYING_EMAIL = 0;
    private static final int VERIFYING_PHONE = 1;

    private Uri uri;

    private ImageView userImage;
   // private Button emailButton, phoneButton;
    private EditText editTextFirstName, editTextLastName, editTextMiddleName, editTextEmail, editTextPhone, editTextEnterOTP;
    private LinearLayout otpLayout;
    private Button resendButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_basic_details);
        initUi();
    }

    @Override
    protected void onResume(){
        super.onResume();
//        if (AppManager.getInstance().basicModel.getContactNumber() != null) {
//            //phoneButton.setText(AppManager.getInstance().basicModel.getContactNumber());
//        }
//        if (AppManager.getInstance().basicModel.getEmail() != null) {
//            //emailButton.setText(AppManager.getInstance().basicModel.getEmail());
//        }
    }

    private void initUi() {
        userImage = findViewById(R.id.image);
        //emailButton = findViewById(R.id.button_email);
        //phoneButton = findViewById(R.id.button_phone);

        editTextFirstName = findViewById(R.id.edit_text_first_name);
        editTextMiddleName = findViewById(R.id.edit_text_middle_name);
        editTextLastName = findViewById(R.id.edit_text_last_name);

        otpLayout = findViewById(R.id.otp_layout);
        editTextEmail = findViewById(R.id.edit_text_email);
        editTextPhone = findViewById(R.id.edit_text_contact_number);

        editTextEnterOTP = findViewById(R.id.edit_text_enter_otp);
        resendButton = findViewById(R.id.resend_button);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if (resultCode != 0) {
            if (requestCode == PICK_IMAGE) {
                Uri selectedImage = data.getData();
                try {
                    Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), selectedImage);
                    userImage.setImageBitmap(bitmap);
                    uri = selectedImage;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void onBackPressed(){
        NavUtils.navigateUpFromSameTask(this);
    }

    public void onAddImageClick(View view) {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);
    }

    public void onAddEmailClick(View view) {
        if (editTextEmail.getText().toString().length() <= 0) {
            DialogsManager.showErrorDialog(this, "Error","Please enter email");
        }
        else {
            handleOtpLayout(VERIFYING_EMAIL, view);
        }
//        Intent intent = new Intent(this, EmailActivity.class);
//        startActivity(intent);
    }

    private void handleOtpLayout(int i, View view) {
        otpLayout.setVisibility(View.VISIBLE);
        onAddClick(view);
    }

    public void onAddPhoneClick(View view) {
//        Intent intent = new Intent(this, PhoneActivity.class);
//        startActivity(intent);
    }


    public void onSaveClick(View view) {
        String firstName = editTextFirstName.getText().toString();
        String middleName = editTextMiddleName.getText().toString();
        String lastName = editTextLastName.getText().toString();

        if (firstName.length() > 0 && middleName.length() > 0 && lastName.length() > 0 && uri != null) {
//            AppManager.getInstance().basicModel.setFirstName(firstName);
//            AppManager.getInstance().basicModel.setMiddleName(middleName);
//            AppManager.getInstance().basicModel.setLastName(lastName);
//            AppManager.getInstance().basicModel.setUri(uri);

            Intent intent = new Intent(this, OthersRegistrationActivity.class);
            startActivity(intent);
        }
        else {
            DialogsManager.showErrorDialog(this, "Error", "Please fill all the details");
        }
    }

    public void onAddClick(View view) {
        if (isValidEmail(editTextEmail.getText().toString())) {
            final JSONObject object = new JSONObject();
            try {
                object.put("email", editTextEmail.getText().toString());
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
                        dialog = ProgressDialog.show(BasicDetailsActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();

                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int statusCode = jsonObject.getInt("success");
                            switch (statusCode) {
                                case 0:
                                    DialogsManager.showErrorDialog(BasicDetailsActivity.this, "Error", jsonObject.getString("error"));
                                    break;
                                case 1:
                                    break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(BasicDetailsActivity.this, "Error", result);
                        }
                    }
                }).execute();
            }
        }
        else {
            if (editTextEmail.getText().toString().length() <= 0) {
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
                        new SharedPrefManager(BasicDetailsActivity.this).setInitToken(initToken);
                        onAddClick(view);
                    }
                }
                catch (Exception e) {
                    e.printStackTrace();
                    DialogsManager.showErrorDialog(BasicDetailsActivity.this, "Error", e.toString());
                }
            }
        }).execute();
    }
}
