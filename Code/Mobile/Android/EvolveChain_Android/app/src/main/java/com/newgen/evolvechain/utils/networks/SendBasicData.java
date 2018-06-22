package com.newgen.evolvechain.utils.networks;

import android.app.ProgressDialog;
import android.content.Context;
import android.net.Uri;

import com.newgen.evolvechain.BasicDataListener;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.MultiPartTaskUsingBitmap;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by onkar.gupta on 6/6/2018.
 *
 */

public class SendBasicData {
    private Context context;

    public SendBasicData(Context context) {
        this.context = context;
    }


    public void saveBasicTask(final BasicDataListener listener) {
        UserBasicModel basicModel = AppManager.getInstance().basicModel;

        if (basicModel.getAddress1() != null) {

            Map<String, String> params = new HashMap<>(12);
            params.put("step", "basic");
            params.put("firstname", basicModel.getFirstName());
            params.put("middlename", basicModel.getMiddleName());
            params.put("lastname", basicModel.getLastName());
            params.put("dob", basicModel.getDob());
            params.put("gender", basicModel.getGender());
            params.put("city", basicModel.getCity());
            params.put("address1", basicModel.getAddress1());
            params.put("address2", basicModel.getAddress2());
            params.put("street", basicModel.getStreet());
            params.put("zip", basicModel.getZip());
            params.put("country", basicModel.getCountry());
            params.put("state", basicModel.getState());
            params.put("place_of_birth", basicModel.getPlaceBirth());
            params.put("substep", "basic");
            params.put("iso", AppManager.getInstance().selectedCountryModel.getIso());

            String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
            String[] fileField = new String[]{"file[]"};
            String[] filePaths = new String[]{AppUtil.getPath(context, basicModel.getUri())};

            Uri[] uris = new Uri[]{basicModel.getUri()};


            new MultiPartTaskUsingBitmap(context, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
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
                                listener.succeed();
                            } else {
                                DialogsManager.showErrorDialog(context, "Error", "Some error occurred. Please try after some time.");
                            }
                        }
                    }).execute();
        }
        else {
            listener.failed();
        }
    }
}
