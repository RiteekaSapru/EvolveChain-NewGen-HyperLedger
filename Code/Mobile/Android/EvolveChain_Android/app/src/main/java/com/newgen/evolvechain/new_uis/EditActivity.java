package com.newgen.evolvechain.new_uis;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.CountDownTimer;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.InputFilter;
import android.text.TextWatcher;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.DocTypeModel;
import com.newgen.evolvechain.models.DocumentModel;
import com.newgen.evolvechain.models.HoldingDocumentModel;
import com.newgen.evolvechain.models.SubDocType;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.ImageLoaderListener;
import com.newgen.evolvechain.network_layer.ImageLoaderWithoutViewTask;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class EditActivity extends AppCompatActivity {
    private TextView isdCode;
    CountryCodeModel[] countryCodeModels;
    String[] countryCodes;
    private LinearLayout otpLayout;
    private EditText contactText, otpText;
    private Button resendButton;
    char[] phoneFormat;

    private int count = 60;
    CountDownTimer timer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit);
        initUis();
    }

    @Override
    protected void onResume(){
        super.onResume();
        otpText.setText("");
        otpLayout.setVisibility(View.GONE);
    }

    private void initUis() {
        isdCode = findViewById(R.id.isd_code);
        otpLayout = findViewById(R.id.otp_layout);
        contactText = findViewById(R.id.contact_text);
        Utility.openKeyBoard(this, contactText);
        resendButton = findViewById(R.id.resend_btn);
        otpText = findViewById(R.id.otp_text);

        countryCodeModels = AppManager.getInstance().countryCodeModels;
        countryCodes = new String[countryCodeModels.length];
        for (int i = 0; i < countryCodeModels.length; i++) {
            countryCodes[i] = countryCodeModels[i].getName();

            if (i == 0) {
                isdCode.setText(countryCodeModels[0].getPhoneCode());
                phoneFormat = countryCodeModels[0].getPhoneFormat().toCharArray();
                contactText.setFilters(new InputFilter[]{new InputFilter.LengthFilter(phoneFormat.length)});
            }
        }

        setIdTextWatcher();
        otpText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                if (editable.toString().length() == 6) {
                    onContClick(findViewById(R.id.cont_btn));
                }
            }
        });

    }

    private void setIdTextWatcher() {
        contactText.addTextChangedListener(new TextWatcher() {
            boolean change = true;

            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (charSequence.length() > phoneFormat.length) {
                    return;
                }
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                change = i2 != 0;
            }

            @Override
            public void afterTextChanged(Editable editable) {
                if (phoneFormat.length > editable.toString().length() && editable.length() > 1) {
                    if (change) {
                        if (phoneFormat[editable.toString().length()] == '-') {
                            editable.append('-');
                        }
                    } else {
                        if (editable.length() > 1 && editable.charAt(editable.length() - 1) == '-') {
                            editable.delete(editable.length() - 2, editable.length());

                            String d = editable.toString();
                        }
                    }
                }
            }
        });
    }

    private void parseData(String result) {
        try {
            JSONObject jsonObject = new JSONObject(result);

            String email = jsonObject.getString("email");
            String phone = jsonObject.getString("phone");
            String isd = jsonObject.getString("country_code");

            getCountry(isd);

            AppManager.getInstance().initToken = jsonObject.getString("appkey");

            //GetImages
            JSONArray documentArray = jsonObject.getJSONArray("documents");
            parseDocumentData(documentArray);

            JSONObject basicObject = jsonObject.getJSONObject("BasicInfo");
            JSONObject identityObject = jsonObject.getJSONObject("IdentityInfo");
            JSONObject addressObject = jsonObject.getJSONObject("AddressInfo");
            JSONObject holdingDocObject = jsonObject.getJSONObject("FaceInfo");

            String img1 = "";
            if (basicObject.getJSONArray("DocImages").length() > 0) {
                img1 = basicObject.getJSONArray("DocImages").getJSONObject(0).getString("url");
            }
            String img2 = "";
            if (identityObject.getJSONArray("DocImages").length() > 0) {
                img2 = identityObject.getJSONArray("DocImages").getJSONObject(0).getString("url");
            }
            String img3 = "";
            if (identityObject.getJSONArray("DocImages").length() > 1) {
                img3 = identityObject.getJSONArray("DocImages").getJSONObject(1).getString("url");
            }
            String img4 = "";
            if (addressObject.getJSONArray("DocImages").length() > 0) {
                img4 = addressObject.getJSONArray("DocImages").getJSONObject(0).getString("url");
            }
            String img5 = "";
            if (addressObject.getJSONArray("DocImages").length() > 1) {
                img5 = addressObject.getJSONArray("DocImages").getJSONObject(1).getString("url");
            }
            String img6 = "";
            if (holdingDocObject.getJSONArray("DocImages").length() > 0) {
                img6 = holdingDocObject.getJSONArray("DocImages").getJSONObject(0).getString("url");
            }

            String[] imageUrls = new String[]{
                    img1,
                    img2,
                    img3,
                    img4,
                    img5,
                    img6
            };

            downloadImages(imageUrls, basicObject, email, phone, isd, identityObject, addressObject, holdingDocObject);


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getCountry(String isd) {

        if (countryCodeModels != null) {
            for (int i = 0; i < countryCodeModels.length; i++) {
                if (countryCodeModels[i].getPhoneCode().equals(isd)) {
                    AppManager.getInstance().selectedCountryModel = countryCodeModels[i];
                }
            }
        }
    }

    private void downloadImages(final String[] imageUrls, final JSONObject basicObject, final String email, final String phone, final String isd, final JSONObject identityObject, final JSONObject addressObject, final JSONObject holdingDocObject) {
        new ImageLoaderWithoutViewTask(this, imageUrls, new ImageLoaderListener() {
            ProgressDialog dialog;

            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(EditActivity.this, "", "Loading...");
            }

            @Override
            public void onLoadComplete(Uri[] uris) {
                dialog.dismiss();
                try {
                    parseBasicData(basicObject, email, phone, isd, uris[0]);

                    parseAddressData(addressObject, uris[3], uris[4]);

                    parseIdentityData(identityObject, uris[1], uris[2]);

                    parseHoldingDocObject(holdingDocObject, uris[5]);

                    Intent intent = new Intent(EditActivity.this, OthersRegistrationActivity.class);
                    startActivity(intent);
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        }).execute();
    }

    private void parseHoldingDocObject(JSONObject holdingDocObject, Uri uri) {
        try {
            JSONObject docDetails = holdingDocObject.getJSONObject("DocDetails");
            String number = docDetails.getString("number");
            AppManager.getInstance().holdingDocumentModel = new HoldingDocumentModel(number, uri);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void parseIdentityData(JSONObject identityObject, Uri uris, Uri uri) {
        try {
            JSONObject docDetails = identityObject.getJSONObject("DocDetails");
            String number = docDetails.getString("number");
            String expiryDate = docDetails.getString("expiry_date");
            String country = docDetails.getString("country");
            String documentType = "";
            String documentTypeCode = "";
            String subType = "";
            String subDocType = "";
            try {
                subType = docDetails.getString("sub_document_type");
                documentTypeCode = docDetails.getString("document_type");
                ArrayList<DocTypeModel> docTypes = AppManager.getInstance().addressDocs;
                for (int i = 0; i < docTypes.size(); i++) {
                    DocTypeModel model = docTypes.get(i);
                    if (model.getCode().equals(documentTypeCode)) {
                        documentType = model.getName();
                    }
                    if (model.getSubDocTypes().length > 0) {
                        for (int j = 0; j < model.getSubDocTypes().length; j++) {
                            if (model.getSubDocTypes()[j].getCode().equals(subType)) {
                                subDocType = model.getSubDocTypes()[j].getName();
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                subType = "";
            }

            AppManager.getInstance().identityDocumentModel = new DocumentModel(documentType, documentTypeCode, number, expiryDate, country, subDocType , subType, uris, uri);
        } catch (Exception e) {
            AppManager.getInstance().identityDocumentModel = null;
        }
    }

    private void parseAddressData(JSONObject addressObject, Uri uris, Uri uri) {
        try {
            JSONObject docDetails = addressObject.getJSONObject("DocDetails");
            String number = docDetails.getString("number");
            String expiryDate = docDetails.getString("expiry_date");
            String country = docDetails.getString("country");
            String documentType = "";
            String documentTypeCode = "";// = docDetails.getString("document_type");
            String subType = "";
            String subDocType = "";
            try {
                subType = docDetails.getString("sub_document_type");
                documentTypeCode = docDetails.getString("document_type");
                ArrayList<DocTypeModel> docTypes = AppManager.getInstance().addressDocs;
                for (int i = 0; i < docTypes.size(); i++) {
                    DocTypeModel model = docTypes.get(i);
                    if (model.getCode().equals(documentTypeCode)) {
                        documentType = model.getName();
                    }
                    if (model.getSubDocTypes().length > 0) {
                        for (int j = 0; j < model.getSubDocTypes().length; j++) {
                            if (model.getSubDocTypes()[j].getCode().equals(subType)) {
                                subDocType = model.getSubDocTypes()[j].getName();
                            }
                        }
                    }
                }


            } catch (Exception e) {
                e.printStackTrace();
                subType = "";
            }
            AppManager.getInstance().addressDocumentModel = new DocumentModel(documentType, documentTypeCode, number, expiryDate, country, subDocType, subType, uris, uri);
        } catch (Exception e) {
            AppManager.getInstance().addressDocumentModel = null;
        }
    }

    private void parseBasicData(JSONObject basicObject, final String email, final String phone, final String isd, Uri uris) {
        try {
            JSONObject dcoDetails = basicObject.getJSONObject("DocDetails");
            final String firstName = dcoDetails.getString("firstname");
            final String middleName = dcoDetails.getString("middlename");
            final String lastName = dcoDetails.getString("lastname");
            final String gender = dcoDetails.getString("gender");
            final String dob = dcoDetails.getString("dob");
            final String city = dcoDetails.getString("city");
            final String address1 = dcoDetails.getString("address1");
            final String address2 = dcoDetails.getString("address2");
            final String zip = dcoDetails.getString("zip");
            final String state = dcoDetails.getString("state");
            final String country = dcoDetails.getString("country");
            final String street = dcoDetails.getString("street");
            final String placeOfBirth = dcoDetails.getString("place_of_birth");


            AppManager.getInstance().basicModel = new UserBasicModel(email, phone, isd,
                    firstName, middleName, lastName, gender,
                    dob, placeOfBirth,
                    address1, address2,
                    street, city, zip,
                    state, country,
                    uris);
        } catch (Exception e) {
            AppManager.getInstance().basicModel = new UserBasicModel(email, phone, isd);
        }
    }

    private void parseDocumentData(JSONArray array) throws Exception {

        ArrayList<DocTypeModel> identityDocTypes = new ArrayList<>();
        ArrayList<DocTypeModel> addressDocTypes = new ArrayList<>();

        for (int i = 0; i < array.length(); i++) {

            JSONObject documentObject = array.getJSONObject(i);
            String name = documentObject.getString("name");
            String code = documentObject.getString("code");
            boolean expiryDate = documentObject.getBoolean("expiry_date");

            JSONArray subDocArray = documentObject.getJSONArray("sub_docs");
            SubDocType[] subDocTypes = new SubDocType[subDocArray.length()];
            for (int j = 0; j < subDocArray.length(); j++) {
                JSONObject subDocObject = subDocArray.getJSONObject(j);
                String subCode = subDocObject.getString("code");
                String subName = subDocObject.getString("name");
                subDocTypes[j] = new SubDocType(subCode, subName);
            }

            String type = documentObject.getString("type");
            DocTypeModel model = new DocTypeModel(name, code, expiryDate, subDocTypes);
            switch (type) {
                case "A":
                    addressDocTypes.add(model);
                    break;
                case "I":
                    identityDocTypes.add(model);
                    break;
                case "B":
                    addressDocTypes.add(model);
                    identityDocTypes.add(model);
                    break;
            }
        }

        AppManager.getInstance().identityDocs = identityDocTypes;
        AppManager.getInstance().addressDocs = addressDocTypes;


    }

    public void onIsdClick(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setItems(countryCodes, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                isdCode.setText(countryCodeModels[i].getPhoneCode());
                phoneFormat = countryCodeModels[i].getPhoneFormat().toCharArray();
                contactText.setFilters(new InputFilter[]{new InputFilter.LengthFilter(phoneFormat.length)});
            }
        });
        builder.setTitle("Choose country");
        builder.create().show();
    }

    public void onNextClick(View view) {
        String contact = contactText.getText().toString();
        String isd = isdCode.getText().toString();

        if (contact.length() <= 0) {
            contactText.setError("Please fill contact number");
            return;
        }

        try {
            JSONObject object = new JSONObject();
            object.put("mobile", contact);
            object.put("isd_code", isd);
            object.put("vendor_uuid", AppManager.getInstance().uuid);

            String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.RE_SUBMIT_VERIFCATION;

            new PostTask(object.toString(), url, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    Utility.hideKeyBoard(EditActivity.this, contactText);
                    dialog = ProgressDialog.show(EditActivity.this, "", "Sending OTP...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                    if (AppUtil.isSuccess(result)) {
                        getAppKey(result);
                        handleOtpLayout();
                    } else {
                        DialogsManager.showErrorDialog(EditActivity.this, "Error", AppUtil.getError(result));
                    }
                }
            }).execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getAppKey(String result) {
        try {
            JSONObject object = new JSONObject(result);
            AppManager.getInstance().initToken = object.getString("key");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleOtpLayout() {
        otpLayout.setVisibility(View.VISIBLE);
        otpText.requestFocus();
        Utility.openKeyBoard(this, otpText);
        startTimer();
    }

    private void startTimer() {
        count = 60;
        resendButton.setEnabled(false);
        timer = new CountDownTimer(60000, 1000) {
            @Override
            public void onTick(long l) {
                count--;
                resendButton.setText("Resend: " + count);
            }

            @Override
            public void onFinish() {
                resendButton.setEnabled(true);
                resendButton.setText("Resend");
            }
        };
        timer.start();
    }

    public void onResendClick(View view) {
        onNextClick(findViewById(R.id.btn));
    }

    public void onContClick(View view) {
        String otp = otpText.getText().toString();

        if (otp.length() < 6) {
            DialogsManager.showErrorDialog(this, "Error", "Please fill otp");
            return;
        }

        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("vendor_uuid", AppManager.getInstance().uuid);
            jsonObject.put("resubmit_pin", Utility.md5(otp));
            jsonObject.put("appkey", AppManager.getInstance().initToken);

            String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.RE_SUBMIT_INIT;

            new PostTask(jsonObject.toString(), url, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    Utility.hideKeyBoard(EditActivity.this, otpText);
                    dialog = ProgressDialog.show(EditActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                    Utility.hideKeyBoard(EditActivity.this, otpText);
                    if (AppUtil.isSuccess(result)) {
                        parseData(result);
                    } else {
                        Animation shake = AnimationUtils.loadAnimation(EditActivity.this, R.anim.shake);
                        otpText.startAnimation(shake);
                    }

                }
            }).execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPause(){
        super.onPause();
        Utility.hideKeyBoard(this, otpText);
    }
}
