package com.newgen.evolvechain.utils.networks;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.newgen.evolvechain.models.DocumentModel;
import com.newgen.evolvechain.network_layer.MultiPartTaskUsingBitmap;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.new_uis.OthersRegistrationActivity;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by onkar.gupta on 6/6/2018.
 *
 */

public class SendDocumentData {
    private Context context;

    public SendDocumentData(Context context) {
        this.context = context;
    }

    public void saveDocumentTask(final DocumentModel model, final String step) {
        Map<String, String> params = new HashMap<>(5);
        String[] filePaths = new String[2];
        Uri[] uris = new Uri[2];

        params.put("step", step.toLowerCase());
        params.put("substep", model.getTypeCode());
        params.put("number", model.getNumber());
        if (model.getExpiryDate() != null) {
            params.put("expiry_date", model.getExpiryDate());
        }
        else {
            params.put("expiry_date", "");
        }
        params.put("country", model.getIssueCountry());
        if (model.getSubTypeCode() != null) {
            params.put("subdoc", model.getSubTypeCode());
        }
        else {
            params.put("subdoc", "");
        }
        params.put("iso", AppManager.getInstance().selectedCountryModel.getIso());

        filePaths[0] = AppUtil.getPath(context, model.getFrontUri());
        uris[0] = model.getFrontUri();
        filePaths[1] = AppUtil.getPath(context, model.getBackUri());
        uris[1] = model.getBackUri();

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]", "file[]"};


        new  MultiPartTaskUsingBitmap(context, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(context, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            switch (step){
                                case "Identity":
                                    AppManager.getInstance().identityDocumentModel = model;
                                    if (AppManager.getInstance().addressDocumentModel != null && AppManager.getInstance().addressDocumentModel.getTypeCode().equals(model.getTypeCode())){
                                        AppManager.getInstance().addressDocumentModel = model;
                                    }
                                    break;
                                case "Address":
                                    AppManager.getInstance().addressDocumentModel = model;
                                    if (AppManager.getInstance().identityDocumentModel != null && AppManager.getInstance().identityDocumentModel.getTypeCode().equals(model.getTypeCode())){
                                        AppManager.getInstance().identityDocumentModel = model;
                                    }
                                    break;
                            }
                            Intent intent = new Intent(context, OthersRegistrationActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                            context.startActivity(intent);
                        } else {
                            DialogsManager.showErrorDialog(context, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }

}
