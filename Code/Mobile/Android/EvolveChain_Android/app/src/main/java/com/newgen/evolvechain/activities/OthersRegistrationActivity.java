package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.newgen.evolvechain.CellClickListener;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.adpaters.OptionsAdapter;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;
import com.newgen.evolvechain.models.documnets.TaxationModel;
import com.newgen.evolvechain.models.documnets.UtilityBillModel;
import com.newgen.evolvechain.network_layer.MultiPartTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;

import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class OthersRegistrationActivity extends AppCompatActivity implements CellClickListener {

    RecyclerView optionsList;
    private ArrayList<String> optionDataList;
    private OptionsAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_others_registration);

        initUis();
        makeOptionDataList();
        setUpList();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (adapter != null) {
            adapter = new OptionsAdapter(optionDataList, this);
            optionsList.setAdapter(adapter);
        }
    }

    @Override
    public void onBackPressed() {
        NavUtils.navigateUpFromSameTask(this);
    }

    private void setUpList() {
        optionsList.setLayoutManager(new GridLayoutManager(this, 1));
        adapter = new OptionsAdapter(optionDataList, this);
        optionsList.setAdapter(adapter);
    }

    private void initUis() {
        optionsList = findViewById(R.id.options);
    }

    private void makeOptionDataList() {
        optionDataList = new ArrayList<>();
        optionDataList.add("Basic Details");
        optionDataList.add("Identity Proof");
        optionDataList.add("Address Proof");
    }

    @Override
    public void onCellClick(int pos) {
        switch (pos) {
            case 0:
                Intent basicIntent = new Intent(this, BasicDetailActivity.class);
                startActivity(basicIntent);
                break;
            case 1:
                Intent identityIntent = new Intent(this, IdentityActivity.class);
                startActivity(identityIntent);
                break;
            case 2:
                Intent addressIntent = new Intent(this, AddressActivity.class);
                startActivity(addressIntent);
                break;
            case 3:
                Intent bankIntent = new Intent(this, BankDetailActivity.class);
                startActivity(bankIntent);
                break;
        }
    }

    public void onSaveClick(View view) {
        int identityType = AppManager.getInstance().identityModelV1.getType();
        int addressType = AppManager.getInstance().addressModelV1.getType();

        if (AppManager.getInstance().basicModel == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please fill basic details");
        } else {
            if (identityType < 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please fill identity details");
            } else {
                if (addressType < 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please fill address details");
                } else {
                    saveBasicDataToServer(identityType, addressType);
                }
            }
        }
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
        params.put("substep", "basic");

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]"};
        String[] filePaths = new String[]{getPath(basicModel.getUri())};


        new MultiPartTask(urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(OthersRegistrationActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int successCode = jsonObject.getInt("success");
                            if (successCode == 0) {
                                DialogsManager.showErrorDialog(OthersRegistrationActivity.this, "Error", "Some error occurred. Please try after some time");
                            } else {
                                if (successCode == 1) {
                                    saveIdentityDataToServer(identityType, addressType);
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(OthersRegistrationActivity.this, "Error", "Some error occurred. Please try after some time");
                        }
                    }
                }).execute();
    }

    private void saveIdentityDataToServer(int identityType, final int addressType) {
        Map<String, String> params = new HashMap<>(5);
        String[] filePaths = new String[2];

        params.put("step", "identity");

        switch (identityType) {
            case AppConstants.DOCUMENT_TYPE_PASSPORT:
                params.put("substep", "passport");

                PassportModel model = AppManager.getInstance().passportModel;
                params.put("number", model.getNumber());
                params.put("expiry_date", model.getExpiryDate());
                params.put("country", model.getIssueCountry());

                filePaths[0] = getPath(model.getFrontUri());
                filePaths[1] = getPath(model.getBackUri());
                break;
            case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                params.put("substep", "license");

                DrivingLicenseModel licenseModel = AppManager.getInstance().drivingLicenseModel;
                params.put("number", licenseModel.getNumber());
                params.put("expiry_date", licenseModel.getExpiryDate());
                params.put("country", licenseModel.getIssueCountry());

                filePaths[0] = getPath(licenseModel.getFrontUri());
                filePaths[1] = getPath(licenseModel.getBackUri());
                break;
            case AppConstants.DOCUMENT_TYPE_TAXATION:
                params.put("substep", "taxation");

                TaxationModel taxationModel = AppManager.getInstance().taxationModel;
                params.put("number", taxationModel.getNumber());
                params.put("expiry_date", taxationModel.getDob());
                params.put("country", taxationModel.getCountry());

                filePaths[0] = getPath(taxationModel.getFrontUri());
                filePaths[1] = getPath(taxationModel.getBackUri());
                break;

        }

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]", "file[]"};


        new MultiPartTask(urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(OthersRegistrationActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int successCode = jsonObject.getInt("success");
                            if (successCode == 0) {
                                DialogsManager.showErrorDialog(OthersRegistrationActivity.this, "Error", "Some error occurred. Please try after some time.");
                            } else {
                                if (successCode == 1) {
                                    saveAddressDataToServer(addressType);
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(OthersRegistrationActivity.this, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }

    private void saveAddressDataToServer(int addressType) {
        Map<String, String> params = new HashMap<>(5);
        String[] filePaths = new String[2];

        params.put("step", "address");

        switch (addressType) {
            case AppConstants.DOCUMENT_TYPE_PASSPORT:
                params.put("substep", "passport");

                PassportModel model = AppManager.getInstance().passportModel;
                params.put("number", model.getNumber());
                params.put("expiry_date", model.getExpiryDate());
                params.put("country", model.getIssueCountry());
                params.put("document_type", "");

                filePaths[0] = getPath(model.getFrontUri());
                filePaths[1] = getPath(model.getBackUri());
                break;
            case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                params.put("substep", "license");

                DrivingLicenseModel licenseModel = AppManager.getInstance().drivingLicenseModel;
                params.put("number", licenseModel.getNumber());
                params.put("expiry_date", licenseModel.getExpiryDate());
                params.put("country", licenseModel.getIssueCountry());
                params.put("document_type", "");

                filePaths[0] = getPath(licenseModel.getFrontUri());
                filePaths[1] = getPath(licenseModel.getBackUri());
                break;
            case AppConstants.DOCUMENT_TYPE_UTILITY_BILL:
                params.put("substep", "taxation");

                UtilityBillModel billModel = AppManager.getInstance().utilityBillModel;
                params.put("number", billModel.getNumber());
                params.put("expiry_date", "");
                params.put("country", billModel.getAddress());
                params.put("document_type", billModel.getType());

                filePaths[0] = getPath(billModel.getFrontUri());
                filePaths[1] = getPath(billModel.getBackUri());
                break;

        }

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]", "file[]"};


        new MultiPartTask(urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(OthersRegistrationActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            int successCode = jsonObject.getInt("success");
                            if (successCode == 0) {
                                DialogsManager.showErrorDialog(OthersRegistrationActivity.this, "Error", "Some error occurred. Please try after some time.");
                            } else {
                                if (successCode == 1) {
                                    DialogsManager.showErrorDialogWithOkHandle(OthersRegistrationActivity.this, "", "Data Successfully saved", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialogInterface, int i) {
                                        }
                                    });
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            DialogsManager.showErrorDialog(OthersRegistrationActivity.this, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }


    public String getPath(Uri uri) {
        String result = "";
        String[] proj = {MediaStore.Images.Media.DATA};
        try {
            Cursor cursor = this.getContentResolver().query(uri, proj, null, null, null);
            if (cursor == null) {
                result = uri.getPath();
            } else {
                cursor.moveToFirst();
                int idx = cursor.getColumnIndex(MediaStore.Images.Media.DATA);
                result = cursor.getString(idx);
                cursor.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
