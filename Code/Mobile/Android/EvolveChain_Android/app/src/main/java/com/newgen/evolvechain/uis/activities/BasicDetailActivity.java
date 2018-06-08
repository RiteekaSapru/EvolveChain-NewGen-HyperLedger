package com.newgen.evolvechain.uis.activities;

import android.Manifest;
import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.CountDownTimer;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.PinText;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

public class BasicDetailActivity extends AppCompatActivity {

    private ImageView image;
    private EditText emailText, phoneText, firstNameText, middleNameText, lastNameText, dobText, birthPlaceText, address1Text, address2Text, streetText, cityText, stateText, countryText, areaCodeText;
    private Button resendButton, saveButton;
    private PinText otpText;
    private TextView isdCode;
    private LinearLayout otpLayout;

    private static final int VERIFYING_EMAIL = 0;
    private static final int VERIFYING_PHONE = 1;
    private static final int PICK_IMAGE = 0;
    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 1;
    String[] countryNames;
    CountryCodeModel[] list;
    String currentBodyData;
    private Uri uri;
    private String verifiedEmail = "", verifiedPhone = "";

    private int verifying;
    int count = 60;

    Calendar myCalendar = Calendar.getInstance();
    Calendar minCalendar = Calendar.getInstance();
    Calendar maxCalendar = Calendar.getInstance();
    DatePickerDialog.OnDateSetListener date;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_basic_detail);


        getMinMaxDate();
        getCountryDataFromSingleton();
        initUIs();
        setUpDatePicker();
    }

    private void getMinMaxDate() {

        int minAge = Integer.parseInt(AppManager.getInstance().minAge);
        int maxAge = Integer.parseInt(AppManager.getInstance().maxAge);

        minCalendar.set(myCalendar.get(Calendar.YEAR) - maxAge, myCalendar.get(Calendar.MONTH), myCalendar.get(Calendar.DAY_OF_MONTH));

        maxCalendar.set(myCalendar.get(Calendar.YEAR) - minAge, myCalendar.get(Calendar.MONTH), myCalendar.get(Calendar.DAY_OF_MONTH));
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != 0) {
            if (requestCode == PICK_IMAGE) {
                Uri selectedImage = data.getData();
                try {
                    //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), selectedImage);
                    uri = selectedImage;
                    image.setImageURI(uri);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void onBackPressed(){
        if (otpLayout.getVisibility() == View.VISIBLE) {
            otpLayout.setVisibility(View.GONE);
            saveButton.setVisibility(View.VISIBLE);
        }
        else {
            super.onBackPressed();
        }
    }

    private void setUpDatePicker() {
        date = new DatePickerDialog.OnDateSetListener() {

            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear,
                                  int dayOfMonth) {
                // TODO Auto-generated method stub
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                updateLabel();
            }

        };
    }

    private void updateLabel() {
        String myFormat = "yyyy-MM-dd"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        ((EditText) findViewById(R.id.edit_text_dob)).setText(sdf.format(myCalendar.getTime()));
    }

    private boolean checkForPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }

//    private void getCountryData() {
//        String data = loadJSONFromAsset();
//        parseDataToList();
//    }
//
//    public String loadJSONFromAsset() {
//        String json = null;
//        try {
//            InputStream is = this.getAssets().open("CountryList.json");
//            int size = is.available();
//            byte[] buffer = new byte[size];
//            is.read(buffer);
//            is.close();
//            json = new String(buffer, "UTF-8");
//        } catch (IOException ex) {
//            ex.printStackTrace();
//            return null;
//        }
//        return json;
//    }

    private void initUIs() {
        image = findViewById(R.id.image);
        emailText = findViewById(R.id.edit_text_email);
        phoneText = findViewById(R.id.edit_text_contact_number);
        otpLayout = findViewById(R.id.otp_layout);
        resendButton = findViewById(R.id.resend_button);
        resendButton.setEnabled(false);
        otpText = findViewById(R.id.edit_text_otp);
        isdCode = findViewById(R.id.isd_code);
        isdCode.setText(list[0].getPhoneCode());

        firstNameText = findViewById(R.id.edit_text_first_name);
        middleNameText = findViewById(R.id.edit_text_middle_name);
        lastNameText = findViewById(R.id.edit_text_last_name);

        dobText = findViewById(R.id.edit_text_dob);
        if (AppManager.getInstance().birthDateString.length() > 0) {
            dobText.setText(AppManager.getInstance().birthDateString);
        }

        birthPlaceText = findViewById(R.id.edit_text_birth_state);
        address1Text = findViewById(R.id.edit_text_address_1);
        address2Text = findViewById(R.id.edit_text_address_2);
        streetText = findViewById(R.id.edit_text_street);
        cityText = findViewById(R.id.edit_text_city);
        stateText = findViewById(R.id.edit_text_state);
        countryText = findViewById(R.id.edit_text_country);
        areaCodeText = findViewById(R.id.edit_text_area_code);
        saveButton = findViewById(R.id.button_save);

        if (AppManager.getInstance().basicModel != null) {
            UserBasicModel basicModel = AppManager.getInstance().basicModel;
            image.setImageURI(basicModel.getUri());
            emailText.setText(basicModel.getEmail());
            isdCode.setText(basicModel.getIsd());
            phoneText.setText(basicModel.getPhone());
            firstNameText.setText(basicModel.getFirstName());
            middleNameText.setText(basicModel.getMiddleName());
            lastNameText.setText(basicModel.getLastName());
            dobText.setText(basicModel.getDob());
            birthPlaceText.setText(basicModel.getPlaceBirth());
            address1Text.setText(basicModel.getAddress1());
            address2Text.setText(basicModel.getAddress2());
            streetText.setText(basicModel.getStreet());
            cityText.setText(basicModel.getCity());
            stateText.setText(basicModel.getState());
            countryText.setText(basicModel.getCountry());
            areaCodeText.setText(basicModel.getZip()) ;
        }
    }

    public void onAddImageClick(View view) {
        Snackbar snackbar = Snackbar.make(findViewById(R.id.basic_view), "Please provide read file permission to pick image", Snackbar.LENGTH_LONG);
        if (checkForPermission()) {
            snackbar.dismiss();
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);
        }
        else {
            snackbar.show();
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    public void onAddEmailClick(View view) {
        verifying = VERIFYING_EMAIL;
        String email = emailText.getText().toString();
        if (email.length() <= 0 || !isValidEmail(email)) {
            DialogsManager.showErrorDialog(this, "Error", "Please enter valid email");
        } else {

            final JSONObject object = new JSONObject();
            try {
                object.put("email", emailText.getText().toString());
            } catch (Exception e) {
                e.printStackTrace();
            }

            currentBodyData = object.toString();

            if (AppManager.getInstance().initToken.length() <= 0) {
                getInitToken(view);
            } else {
                final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_EMAIL_OTP + AppManager.getInstance().initToken;

                new PostTask(object.toString(), urlData, new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(BasicDetailActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();

                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int statusCode = jsonObject.getInt("success");
                            switch (statusCode) {
                                case 0:
                                    DialogsManager.showErrorDialog(BasicDetailActivity.this, "Error", jsonObject.getString("error"));
                                    break;
                                case 1:
                                    handleOTPLayout(VERIFYING_EMAIL);
                                    break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(BasicDetailActivity.this, "Error", result);
                        }
                    }
                }).execute();
            }
        }
    }

    private void handleOTPLayout(final int verifying) {
        count = 60;
        otpLayout.setVisibility(View.VISIBLE);
        saveButton.setVisibility(View.GONE);

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

    public void onAddPhoneClick(View view) {
        verifying = VERIFYING_PHONE;
        String phone = phoneText.getText().toString();
        if (phone.length() <= 0) {
            DialogsManager.showErrorDialog(this, "Error", "Please enter valid email");
        } else {

            final JSONObject object = new JSONObject();
            try {
                object.put("mobile", phone);
                object.put("country_code", isdCode.getText().toString());
            } catch (Exception e) {
                e.printStackTrace();
            }

            currentBodyData = object.toString();

            if (AppManager.getInstance().initToken.length() <= 0) {
                getInitToken(view);
            } else {
                final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_PHONE_OTP + AppManager.getInstance().initToken;

                new PostTask(object.toString(), urlData, new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(BasicDetailActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();

                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int statusCode = jsonObject.getInt("success");
                            switch (statusCode) {
                                case 0:
                                    DialogsManager.showErrorDialog(BasicDetailActivity.this, "Error", jsonObject.getString("error"));
                                    break;
                                case 1:
                                    handleOTPLayout(VERIFYING_PHONE);
                                    break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(BasicDetailActivity.this, "Error", result);
                        }
                    }
                }).execute();
            }
        }
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
        } catch (Exception e) {
            e.printStackTrace();
        }

        new PostTask(bodyJson.toString(), urlData, new WebConnectionListener() {
            ProgressDialog dialog;

            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(BasicDetailActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                try {
                    JSONObject object = new JSONObject(result);
                    int successCode = object.getInt("success");
                    if (successCode == 1) {
                        String initToken = object.getString("key");
                        new SharedPrefManager(BasicDetailActivity.this).setInitToken(initToken);
                        onAddEmailClick(view);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    DialogsManager.showErrorDialog(BasicDetailActivity.this, "Error", "We are having some connection issue with server, please try after some time");
                }
            }
        }).execute();
    }

    public static boolean isValidEmail(CharSequence target) {
        return (!TextUtils.isEmpty(target) && Patterns.EMAIL_ADDRESS.matcher(target).matches());
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
                resendButton.setBackgroundColor(ContextCompat.getColor(BasicDetailActivity.this, R.color.colorDarkGray));
            }
        }.start();
    }

    private void callCheckPIN(int verifying) {
        if (otpText.getText().toString().trim().length() == 6) {
            image.requestFocus();
            Utility.hideKeyBoard(BasicDetailActivity.this, this.findViewById(android.R.id.content).getRootView());
            verifyToken(otpText.getText().toString(), verifying);
        }
    }

    private void verifyToken(String s, int verifying) {
        String otpMd5 = Utility.md5(s);

        switch (verifying) {
            case AppConstants.VERIFICATION_TYPE_EMAIL:
                String verifyEmailUrl = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.VERIFY_EMAIL + AppManager.getInstance().initToken;
                try {
                    JSONObject object = new JSONObject(currentBodyData);
                    object.put("email_code", otpMd5);

                    verifyService(object.toString(), verifyEmailUrl, AppConstants.VERIFICATION_TYPE_EMAIL);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                break;

            case AppConstants.VERIFICATION_TYPE_PHONE:
                String verifyPhoneUrl = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.VERIFY_PHONE + AppManager.getInstance().initToken;
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
                dialog = ProgressDialog.show(BasicDetailActivity.this, "", "Loading...");
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
                            Animation shake = AnimationUtils.loadAnimation(BasicDetailActivity.this, R.anim.shake);
                            otpText.startAnimation(shake);
                            break;
                        case 1:
                            otpLayout.setVisibility(View.GONE);
                            saveButton.setVisibility(View.VISIBLE);

                            if (VERIFICATION_TYPE == AppConstants.VERIFICATION_TYPE_EMAIL) {
                                //AppManager.getInstance().basicModel.setEmail(valueData);
                                //disableEditText(emailText);
                                verifiedEmail = emailText.getText().toString();
                            } else {
                                if (VERIFICATION_TYPE == AppConstants.VERIFICATION_TYPE_PHONE) {
                                    //AppManager.getInstance().basicModel.setContactNumber(valueData);
                                    //disableEditText(phoneText);
                                    verifiedPhone = phoneText.getText().toString();
                                }
                            }
                            break;
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    DialogsManager.showErrorDialog(BasicDetailActivity.this, "Error", result);
                    otpLayout.setVisibility(View.GONE);
                    saveButton.setVisibility(View.VISIBLE);
                }
            }
        }).execute();
    }

    private void disableEditText(EditText emailText) {
        emailText.setCursorVisible(false);
        emailText.setFocusable(false);
        emailText.setFocusableInTouchMode(false);
    }

    public void onResendClick(View view) {
        count = 60;
        resendClickHandle(view, verifying);
    }

    private void resendClickHandle(View view, int i) {
        resendButton.setEnabled(false);
        otpText.setText("");
        resendButton.setBackgroundColor(ContextCompat.getColor(BasicDetailActivity.this, android.R.color.darker_gray));

        if (i == VERIFYING_EMAIL) {
            onAddEmailClick(view);
        } else {
            onAddPhoneClick(view);
        }
    }

    public void onISDCodeClick(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select your country");
        builder.setItems(countryNames, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                isdCode.setText(list[i].getPhoneCode());
            }
        });
        builder.create().show();
    }

    private void getCountryDataFromSingleton() {
        list = AppManager.getInstance().countryCodeModels;

        countryNames = new String[list.length];

        for (int i = 0; i < list.length; i++) {
            countryNames[i] = list[i].getName();
        }
    }

    public void onBirthDateClick(View view) {
        DatePickerDialog datePickerDialog =  new DatePickerDialog(BasicDetailActivity.this, date, maxCalendar
                .get(Calendar.YEAR), maxCalendar.get(Calendar.MONTH),
                maxCalendar.get(Calendar.DAY_OF_MONTH));


        datePickerDialog.getDatePicker().setMaxDate(maxCalendar.getTimeInMillis());
        datePickerDialog.getDatePicker().setMinDate(minCalendar.getTimeInMillis());
        datePickerDialog.show();
    }

    public void onSaveClick(View view) {
        String firstName = firstNameText.getText().toString();
        String lastName = lastNameText.getText().toString();
        String middleName = middleNameText.getText().toString();
        String dob = dobText.getText().toString();
        String birthPlace = birthPlaceText.getText().toString();
        String address1 = address1Text.getText().toString();
        String address2 = address2Text.getText().toString();
        String street = streetText.getText().toString();
        String city = cityText.getText().toString();
        String state = stateText.getText().toString();
        String country = countryText.getText().toString();
        String areaCode = areaCodeText.getText().toString();
        verifiedEmail = emailText.getText().toString();
        String isd = isdCode.getText().toString();


        if (uri == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please choose image");
        } else {
            if (verifiedEmail.length() <= 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please verify your email");
                emailText.requestFocus();
            } else {
                if (verifiedPhone.length() <= 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please verify your phone");
                    phoneText.requestFocus();
                } else {
                    if (firstName.length() <= 0) {
                        DialogsManager.showErrorDialog(this, "Error", "Please fill first name");
                        firstNameText.requestFocus();
                    } else {
                        if (lastName.length() <= 0) {
                            DialogsManager.showErrorDialog(this, "Error", "Please fill last name");
                            lastNameText.requestFocus();
                        } else {
                            if (dob.length() <= 0) {
                                DialogsManager.showErrorDialog(this, "Error", "Please fill Date of birth");
                                dobText.requestFocus();
                            } else {
                                if (birthPlace.length() <= 0) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please fill place of birth");
                                    birthPlaceText.requestFocus();
                                } else {
                                    if (address1.length() <= 0) {
                                        DialogsManager.showErrorDialog(this, "Error", "Please fill address");
                                        address1Text.requestFocus();
                                    } else {
                                        if (street.length() <= 0) {
                                            DialogsManager.showErrorDialog(this, "Error", "Please fill street");
                                            streetText.requestFocus();
                                        } else {
                                            if (city.length() <= 0) {
                                                DialogsManager.showErrorDialog(this, "Error", "Please fill City");
                                                cityText.requestFocus();
                                            } else {
                                                if (areaCode.length() <= 4) {
                                                    DialogsManager.showErrorDialog(this, "Error", "Please enter valid zip code");
                                                    areaCodeText.requestFocus();
                                                } else {
                                                    if (state.length() <= 0) {
                                                        DialogsManager.showErrorDialog(this, "Error", "Please fill state");
                                                        stateText.requestFocus();
                                                    } else {
                                                        if (country.length() <= 0) {
                                                            DialogsManager.showErrorDialog(this, "Error", "Please fill country");
                                                            countryText.requestFocus();
                                                        } else {
                                                            AppManager.getInstance().basicModel = new UserBasicModel(
                                                                    verifiedEmail, verifiedPhone, isd,
                                                                    firstName, middleName, lastName,
                                                                    dob, birthPlace,
                                                                    address1, address2, street, city,
                                                                    areaCode, state, country,
                                                                    uri);
                                                            AppManager.getInstance().birthDateString = dob;
                                                            if (AppManager.getInstance().taxationModel != null) {
                                                                AppManager.getInstance().taxationModel.setDob(dob);
                                                            }
                                                            Intent intent = new Intent(BasicDetailActivity.this, OthersRegistrationActivity.class);
                                                            startActivity(intent);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public void onCountrySelectionClicked(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select your country");
        builder.setItems(countryNames, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                countryText.setText(list[i].getName());
            }
        });
        builder.create().show();
    }
}