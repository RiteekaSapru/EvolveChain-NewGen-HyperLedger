package com.newgen.evolvechain.new_uis;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.DocTypeModel;
import com.newgen.evolvechain.models.SubDocType;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class CountrySelectionActivity extends AppCompatActivity {
    private RadioGroup radioGroup;
    CountryCodeModel[] codeModels;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_country_selection);
        initUis();
    }

    private void initUis() {
        radioGroup = findViewById(R.id.country_radio_group);

        codeModels = AppManager.getInstance().countryCodeModels;
        RadioButton[] radioButtons = new RadioButton[codeModels.length];

        for (int i = 0; i < codeModels.length; i++) {
            radioButtons[i] = new RadioButton(this);
            radioButtons[i].setText(codeModels[i].getName());
            radioButtons[i].setId(i + 100);

            if (i == 0) {
                radioButtons[i].setChecked(true);
            }
            radioGroup.addView(radioButtons[i]);
        }
    }

    public void onProceedButtonClicked(View view) {
        int id = radioGroup.getCheckedRadioButtonId();

        AppUtil.clearCache();
        getInitToken((id-100));

//        if (id >= 0) {
//            switch (id) {
//                case 100:
//                    if (AppManager.getInstance().selectedCountry == AppConstants.SELECTED_COUNTRY_INDIA) {
//                        askToMaintainData();
//                    }
//                    else {
//                        AppManager.getInstance().selectedCountry = AppConstants.SELECTED_COUNTRY_INDIA;
//                        AppUtil.clearCache();
//                        Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
//                        startActivity(othersIntent);
//                    }
//                    break;
//                case 101:
//                    if (AppManager.getInstance().selectedCountry == AppConstants.SELECTED_COUNTRY_NORTH_AMERICA) {
//                        askToMaintainData();
//                    }
//                    else {
//                        AppManager.getInstance().selectedCountry = AppConstants.SELECTED_COUNTRY_NORTH_AMERICA;
//                        AppUtil.clearCache();
//                        Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
//                        startActivity(othersIntent);
//                    }
//                    break;
//            }
//        }
    }

    public void askToMaintainData(){
        if (AppManager.getInstance().basicModel == null && AppManager.getInstance().addressModelV1.getType() < 0 && AppManager.getInstance().identityModelV1.getType() < 0) {
            Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
            startActivity(othersIntent);
        } else {
            DialogsManager.showDialogWithTwoOptions(this,
                    "Alert",
                    "Do you want to clear previous filled data.",
                    "No",
                    "Yes",
                    new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
                            startActivity(othersIntent);
                        }
                    }, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            AppUtil.clearCache();
                            Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
                            startActivity(othersIntent);
                        }
                    });
        }
    }

    private void getInitToken(final int i) {
        String ip = Utility.getIPAddress(true);
        String uniqueId = AppManager.getInstance().uuid;

        String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.INITIALIZE;

        JSONObject bodyJson = new JSONObject();
        try {
            bodyJson.put("ip", ip);
            bodyJson.put("device_type", "android");
            bodyJson.put("device_name", Build.MANUFACTURER + " " + Build.MODEL);
            bodyJson.put("os_version", Build.VERSION.RELEASE);
            bodyJson.put("vendor_uuid", uniqueId);
            bodyJson.put("country_iso", codeModels[i].getIso());
        } catch (Exception e) {
            e.printStackTrace();
        }

        new PostTask(bodyJson.toString(), urlData, new WebConnectionListener() {
            ProgressDialog dialog;

            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(CountrySelectionActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                Log.d("Token", result);
                try {
                    JSONObject object = new JSONObject(result);
                    int successCode = object.getInt("success");
                    if (successCode == 1) {
                        String initToken = object.getString("key");
                        new SharedPrefManager(CountrySelectionActivity.this).setInitToken(initToken);
//                        AppUtil.saveSignUpInitData(result);
                        AppManager.getInstance().selectedCountryModel = codeModels[i];
                        parseDocumentData(result);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).execute();
    }

    private void parseDocumentData(String result) {
        try {
            JSONObject object = new JSONObject(result);
            JSONArray array = object.getJSONArray("documents");

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
                switch (type){
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

            Intent intent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
            startActivity(intent);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
