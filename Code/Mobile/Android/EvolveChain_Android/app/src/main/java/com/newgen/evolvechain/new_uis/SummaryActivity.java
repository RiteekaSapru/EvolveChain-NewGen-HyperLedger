package com.newgen.evolvechain.new_uis;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.newgen.evolvechain.DialogClickListener;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.adpaters.AddressAdapter;
import com.newgen.evolvechain.adpaters.BasicInfoAdapter;
import com.newgen.evolvechain.adpaters.DocumentAdapter;
import com.newgen.evolvechain.models.HoldingDocumentModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;
import com.newgen.evolvechain.models.documnets.TaxationModel;
import com.newgen.evolvechain.models.documnets.UtilityBillModel;
import com.newgen.evolvechain.network_layer.MultiPartTaskUsingBitmap;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class SummaryActivity extends AppCompatActivity implements DialogClickListener {

    private RecyclerView basicList, identityList, addressList, addressInfoList;
    private TextView codeText;
    private ImageView imageView;
    private int identityType, addressType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_summary);

        //getIntentData();

        initUis();
        fillLists();
    }

    private void getIntentData() {
        identityType = getIntent().getIntExtra("identity_type", -1);
        addressType = getIntent().getIntExtra("address_type", -1);
    }

    private void fillLists() {
        basicList.setLayoutManager(new LinearLayoutManager(this));
        identityList.setLayoutManager(new LinearLayoutManager(this));
        addressList.setLayoutManager(new LinearLayoutManager(this));
        addressInfoList.setLayoutManager(new LinearLayoutManager(this));

        basicList.setAdapter(new BasicInfoAdapter(AppManager.getInstance().basicModel));
        basicList.setNestedScrollingEnabled(true);

        addressInfoList.setAdapter(new AddressAdapter(AppManager.getInstance().basicModel));

        identityList.setAdapter(new DocumentAdapter(AppManager.getInstance().identityDocumentModel));
        addressList.setAdapter(new DocumentAdapter(AppManager.getInstance().addressDocumentModel));

        HoldingDocumentModel  model = AppManager.getInstance().holdingDocumentModel;

        if (AppManager.getInstance().holdingDocumentModel != null) {
            try {
                imageView.setImageURI(AppManager.getInstance().holdingDocumentModel.getUri());
                codeText.setText(AppManager.getInstance().holdingDocumentModel.getCode());
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void initUis() {
        basicList = findViewById(R.id.basic_info_list);
        identityList = findViewById(R.id.identity_list);
        addressList = findViewById(R.id.address_list);
        addressInfoList = findViewById(R.id.address_info_list);
        codeText = findViewById(R.id.code_text);
        imageView = findViewById(R.id.img);
    }

    public void onSubmitClick(View view) {
        TermsDialog dialog = new TermsDialog(this);
        dialog.setListener(this);
        //dialog.show();

        callSubmitData();
    }

    private void saveBasicDataToServer(final int identityType, final int addressType) {
        UserBasicModel basicModel = AppManager.getInstance().basicModel;
        Map<String, String> params = new HashMap<>(11);
        params.put("step", "basic");
        params.put("firstname", basicModel.getFirstName());
        params.put("middlename", basicModel.getMiddleName());
        params.put("lastname", basicModel.getLastName());
        params.put("dob", basicModel.getDob());
        params.put("city", basicModel.getCity());
        params.put("address1", basicModel.getAddress1());
        params.put("zip", basicModel.getZip());
        params.put("country", basicModel.getCountry());
        params.put("state", basicModel.getState());
        params.put("place_of_birth", basicModel.getPlaceBirth());
        params.put("substep", "basic");

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]"};
        String[] filePaths = new String[]{AppUtil.getPath(this, basicModel.getUri())};
        Uri[] uris = new Uri[]{basicModel.getUri()};


        new MultiPartTaskUsingBitmap(this, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(SummaryActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            saveIdentityDataToServer(identityType, addressType);
                        }
                        else {
                            DialogsManager.showErrorDialog(SummaryActivity.this, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }

    private void saveIdentityDataToServer(int identityType, final int addressType) {
        Map<String, String> params = new HashMap<>(5);
        String[] filePaths = new String[2];
        Uri[] uris = new Uri[2];

        params.put("step", "identity");

        switch (identityType) {
            case AppConstants.DOCUMENT_TYPE_PASSPORT:
                params.put("substep", "passport");

                PassportModel model = AppManager.getInstance().passportModel;
                params.put("number", model.getNumber());
                params.put("expiry_date", model.getExpiryDate());
                params.put("country", model.getIssueCountry());

                filePaths[0] = AppUtil.getPath(this, model.getFrontUri());
                uris[0] = model.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, model.getBackUri());
                uris[1] = model.getBackUri();
                break;
            case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                params.put("substep", "license");

                DrivingLicenseModel licenseModel = AppManager.getInstance().drivingLicenseModel;
                params.put("number", licenseModel.getNumber());
                params.put("expiry_date", licenseModel.getExpiryDate());
                params.put("country", licenseModel.getIssueCountry());

                filePaths[0] = AppUtil.getPath(this, licenseModel.getFrontUri());
                uris[0] = licenseModel.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, licenseModel.getBackUri());
                uris[1] = licenseModel.getBackUri();
                break;
            case AppConstants.DOCUMENT_TYPE_TAXATION:
                params.put("substep", "taxation");

                TaxationModel taxationModel = AppManager.getInstance().taxationModel;
                params.put("number", taxationModel.getNumber());
                params.put("expiry_date", taxationModel.getDob());
                params.put("country", taxationModel.getCountry());

                filePaths[0] = AppUtil.getPath(this, taxationModel.getFrontUri());
                uris[0] = taxationModel.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, taxationModel.getBackUri());
                uris[1] = taxationModel.getBackUri();
                break;

        }

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]", "file[]"};


        new MultiPartTaskUsingBitmap(this, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(SummaryActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            saveAddressDataToServer(addressType);
                        }
                        else {
                            DialogsManager.showErrorDialog(SummaryActivity.this, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }

    private void saveAddressDataToServer(int addressType) {
        Map<String, String> params = new HashMap<>(5);
        String[] filePaths = new String[2];
        Uri[] uris = new Uri[2];

        params.put("step", "address");

        switch (addressType) {
            case AppConstants.DOCUMENT_TYPE_PASSPORT:
                params.put("substep", "passport");

                PassportModel model = AppManager.getInstance().passportModel;
                params.put("number", model.getNumber());
                params.put("expiry_date", model.getExpiryDate());
                params.put("country", model.getIssueCountry());
                params.put("document_type", "");

                filePaths[0] = AppUtil.getPath(this, model.getFrontUri());
                uris[0] = model.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, model.getBackUri());
                uris[1] = model.getBackUri();
                break;
            case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                params.put("substep", "license");

                DrivingLicenseModel licenseModel = AppManager.getInstance().drivingLicenseModel;
                params.put("number", licenseModel.getNumber());
                params.put("expiry_date", licenseModel.getExpiryDate());
                params.put("country", licenseModel.getIssueCountry());
                params.put("document_type", "");

                filePaths[0] = AppUtil.getPath(this, licenseModel.getFrontUri());
                uris[0] = licenseModel.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, licenseModel.getBackUri());
                uris[1] = licenseModel.getBackUri();
                break;
            case AppConstants.DOCUMENT_TYPE_UTILITY_BILL:
                params.put("substep", "taxation");

                UtilityBillModel billModel = AppManager.getInstance().utilityBillModel;
                params.put("number", billModel.getNumber());
                params.put("expiry_date", "");
                params.put("country", billModel.getAddress());
                params.put("document_type", billModel.getType());

                filePaths[0] = AppUtil.getPath(this, billModel.getFrontUri());
                uris[0] = billModel.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, billModel.getBackUri());
                uris[1] = billModel.getBackUri();
                break;

        }

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]", "file[]"};


        new MultiPartTaskUsingBitmap(this, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(SummaryActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            callSubmitData();
                        }
                        else {
                            DialogsManager.showErrorDialog(SummaryActivity.this, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }

    private void callSubmitData() {
        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SUBMIT_KYC_DOCUMENT;
        try{
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("app_key", AppManager.getInstance().initToken);

            new PostTask(jsonObject.toString(), urlToSave, new WebConnectionListener() {
                ProgressDialog dialog;
                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(SummaryActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                    boolean isSuccess = AppUtil.isSuccess(result);
                    if (isSuccess) {
                        DialogsManager.showErrorDialogWithOkHandle(SummaryActivity.this, "Success", "Your data has been submitted please check your email after sometime", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                AppUtil.clearNewCache();

                                Intent intent = new Intent(SummaryActivity.this, SignInActivity.class);
                                startActivity(intent );
                            }
                        });
                    }
                    else {
                        DialogsManager.showErrorDialog(SummaryActivity.this, "Error", "Some error occurred. Please try after some time.");
                    }
                }
            }).execute();

        }
        catch (Exception e) {
            e.printStackTrace();
            DialogsManager.showErrorDialog(SummaryActivity.this, "Error", "Some error occurred. Please try after some time.");
        }

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
        callSubmitData();
    }
}
