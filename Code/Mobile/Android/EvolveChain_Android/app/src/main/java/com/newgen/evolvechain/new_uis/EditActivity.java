package com.newgen.evolvechain.new_uis;

import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.design.widget.TextInputLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioGroup;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.DocTypeModel;
import com.newgen.evolvechain.models.DocumentModel;
import com.newgen.evolvechain.models.SubDocType;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.DownloadAndSaveImageTask;
import com.newgen.evolvechain.network_layer.ImageLoaderListener;
import com.newgen.evolvechain.network_layer.ImageLoaderTask;
import com.newgen.evolvechain.network_layer.ImageLoaderWithoutViewTask;
import com.newgen.evolvechain.network_layer.ImageSaverListener;
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

    private EditText contactText, codeText;
    private TextInputLayout contactTextWrapper;
    private RadioGroup radioGroup;
    private int count = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit);
        initUis();
    }

    private void initUis() {
        radioGroup = findViewById(R.id.radio_group);
        contactText = findViewById(R.id.contact_text);
        contactTextWrapper = findViewById(R.id.contact_text_wrapper);
        codeText = findViewById(R.id.code_text);
    }

    public void onSaveClick(View view) {
        String userContactType = "";
        int id = radioGroup.getCheckedRadioButtonId();
        switch (id) {
            case R.id.radio_email:
                userContactType = "email";
                break;
            case R.id.radio_phone:
                userContactType = "phone";
                break;
        }

        String contactValue = contactText.getText().toString();
        String code = codeText.getText().toString();

        if (contactValue.length() == 0) {
            contactText.setError("Please fill " + userContactType);
            return;
        }
        if (code.length() == 0) {
            codeText.setError("Please fill code send to " + userContactType);
            return;
        }

        try {
            JSONObject object = new JSONObject();
            object.put("resubmit_pin", Utility.md5(code));
            object.put("user_contact_type", userContactType);
            object.put("email", contactValue);

            String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.RE_SUBMIT_INIT;

            new PostTask(object.toString(), url, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(EditActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                    if (AppUtil.isSuccess(result)) {
                        parseData(result);
                    } else {
                        DialogsManager.showErrorDialog(EditActivity.this, "Error", AppUtil.getError(result));
                    }
                }
            }).execute();
        } catch (Exception e) {
            e.printStackTrace();
            DialogsManager.showErrorDialog(EditActivity.this, "Error", "Some problem occurred please try after some time");
        }
    }

    private void parseData(String result) {
        try {
            JSONObject jsonObject = new JSONObject(result);

            String email = jsonObject.getString("email");
            String phone = jsonObject.getString("phone");
            String isd = jsonObject.getString("country_code");

            AppManager.getInstance().initToken = jsonObject.getString("appkey");

            //GetImages
            JSONArray documentArray = jsonObject.getJSONArray("documents");
            parseDocumentData(documentArray);

            JSONObject basicObject = jsonObject.getJSONObject("BasicInfo");
            JSONObject identityObject = jsonObject.getJSONObject("IdentityInfo");
            JSONObject addressObject = jsonObject.getJSONObject("AddressInfo");

            String[] imageUrls = new String[]{
                    basicObject.getJSONArray("DocImages").getJSONObject(0).getString("url"),
                    identityObject.getJSONArray("DocImages").getJSONObject(0).getString("url"),
                    identityObject.getJSONArray("DocImages").getJSONObject(1).getString("url"),
                    addressObject.getJSONArray("DocImages").getJSONObject(0).getString("url"),
                    addressObject.getJSONArray("DocImages").getJSONObject(1).getString("url"),
            };

            downloadImages(imageUrls, basicObject, email, phone, isd, identityObject, addressObject);


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void downloadImages(final String[] imageUrls, final JSONObject basicObject, final String email, final String phone, final String isd, final JSONObject identityObject, final JSONObject addressObject) {
        new ImageLoaderWithoutViewTask(this, imageUrls, new ImageLoaderListener() {
            @Override
            public void onTaskStart() {

            }

            @Override
            public void onLoadComplete(Uri[] uris) {
                try {
                    parseBasicData(basicObject, email, phone, isd, uris[0]);

                    parseAddressData(addressObject, uris[3], uris[4]);

                    parseIdentityData(identityObject, uris[1], uris[2]);

                    Intent intent = new Intent(EditActivity.this, OthersRegistrationActivity.class);
                    startActivity(intent);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }

            }
        }).execute();
    }

    private void parseIdentityData(JSONObject identityObject, Uri uris, Uri uri) throws Exception {
        JSONObject docDetails = identityObject.getJSONObject("DocDetails");
        String number = docDetails.getString("number");
        String expiryDate = docDetails.getString("expiry_date");
        String country = docDetails.getString("country");
        String documentTypeCode = docDetails.getString("document_type");
        String subType = "";
        try {
            subType = docDetails.getString("sub_document_type");
        }
        catch (Exception e) {
            e.printStackTrace();
            subType = "";
        }

        AppManager.getInstance().identityDocumentModel = new DocumentModel("", documentTypeCode, number, expiryDate, country, "", subType,uris, uri);

    }

    private void parseAddressData(JSONObject addressObject, Uri uris, Uri uri) throws Exception {
        JSONObject docDetails = addressObject.getJSONObject("DocDetails");
        String number = docDetails.getString("number");
        String expiryDate = docDetails.getString("expiry_date");
        String country = docDetails.getString("country");
        String documentTypeCode = docDetails.getString("document_type");
        String subType = "";
        try {
            subType = docDetails.getString("sub_document_type");
        }
        catch (Exception e) {
            e.printStackTrace();
            subType = "";
        }
        AppManager.getInstance().addressDocumentModel = new DocumentModel("", documentTypeCode, number, expiryDate, country, "", subType,uris, uri);

    }

    private void parseBasicData(JSONObject basicObject, final String email, final String phone, final String isd, Uri uris) throws Exception {
        JSONObject dcoDetails = basicObject.getJSONObject("DocDetails");
        final String firstName = dcoDetails.getString("firstname");
        final String middleName = dcoDetails.getString("middlename");
        final String lastName = dcoDetails.getString("lastname");
        final String dob = dcoDetails.getString("dob");
        final String city = dcoDetails.getString("city");
        final String address1 = dcoDetails.getString("address1");
        final String address2 = dcoDetails.getString("address2");
        final String zip = dcoDetails.getString("zip");
        final String state = dcoDetails.getString("state");
        final String country = dcoDetails.getString("country");
        AppManager.getInstance().selectedCountryModel = new CountryCodeModel("91", country, "IND", "9999999999", true);
        final String street = dcoDetails.getString("street");
        final String placeOfBirth = dcoDetails.getString("place_of_birth");


        AppManager.getInstance().basicModel = new UserBasicModel(email, phone, isd,
                firstName, middleName, lastName,
                dob, placeOfBirth,
                address1, address2,
                street, city, zip,
                state, country,
                uris);
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

    public void onPhoneClick(View view) {
        contactTextWrapper.setHint("Contact Number");
    }

    public void onEmailClick(View view) {
        contactTextWrapper.setHint("Email");
    }
}
