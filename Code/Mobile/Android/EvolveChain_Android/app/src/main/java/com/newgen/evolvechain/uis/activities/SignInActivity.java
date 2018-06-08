package com.newgen.evolvechain.uis.activities;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

public class SignInActivity extends AppCompatActivity {

    private EditText pinText, idText;
    private boolean isDataAvailable = false;
    private String kycId, pinMd5;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        initUi();

        getDataFromPrefOrSingleton();
    }

    @Override
    public void onResume(){
        super.onResume();
//
    }

    private void getDataFromPrefOrSingleton() {
        kycId = AppManager.getInstance().kycId;
        pinMd5 = AppManager.getInstance().pinMd5;

        UserBasicModel basicModel = AppManager.getInstance().basicModelAfterSignIn;

        if (kycId.length() < 0 || pinMd5.length() < 0 || basicModel == null) {
            isDataAvailable = false;
        } else {
            idText.setText(kycId);
            idText.setFocusable(false);
            idText.setFocusableInTouchMode(false);
            idText.setLongClickable(false);
            pinText.requestFocus();
            isDataAvailable = true;
        }
    }

    private void initUi() {
        pinText = findViewById(R.id.edit_text_pin);
        idText = findViewById(R.id.edit_text_kyc_id);
    }

    public void onGenerateClick(View view) {
        Intent intent = new Intent(this, GeneratePinActivity.class);
        startActivity(intent);
    }

    public void onSignInClick(View view) {

        if (isDataAvailable) {
            String userPin = pinText.getText().toString();
            if (pinMd5.equals(Utility.md5(userPin))) {
                AppManager.getInstance().isUserVerified = true;
                Intent intent = new Intent(SignInActivity.this, UserProfileActivity.class);
                startActivity(intent);
            } else {
                DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Wrong Pin, Please enter correct pin", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        pinText.setText("");

                    }
                });
            }

        } else {

            final String pin = pinText.getText().toString();
            final String id = idText.getText().toString();

            if (id.length() <= 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please Enter KYC Id");
            } else {
                if (pin.length() <= 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please Enter Pin");
                } else {
                    String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.LOGIN;
                    JSONObject object = new JSONObject();
                    try {
                        object.put("ekyc_id", id);
                        object.put("pin", Utility.md5(pin));
                        object.put("vendor_uuid", AppManager.getInstance().uuid);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    new PostTask(object.toString(), url, new WebConnectionListener() {
                        ProgressDialog dialog;

                        @Override
                        public void onTaskStart() {
                            dialog = ProgressDialog.show(SignInActivity.this, "", "Loading...");
                        }

                        @Override
                        public void onTaskComplete(String result) {
                            dialog.dismiss();
                            boolean isSuccess = AppUtil.isSuccess(result);
                            if (isSuccess) {
                                UserBasicModel basicModel = AppUtil.getBasicModel(result);
                                saveUserModelToSharedPref(result, id, Utility.md5(pin));
                                if (basicModel != null) {
                                    AppManager.getInstance().basicModelAfterSignIn = basicModel;
                                    AppManager.getInstance().isUserVerified = true;
                                    Intent intent = new Intent(SignInActivity.this, UserProfileActivity.class);
                                    startActivity(intent);
                                } else {
                                    DialogsManager.showErrorDialogWithOkHandle(SignInActivity.this, "Error", "Some problem occurred", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialogInterface, int i) {
                                            pinText.setText("");
                                            idText.setText("");
                                        }
                                    });
                                }
                            } else {
                                handleErrorCodes(result);
                            }
                        }
                    }).execute();
                }
            }
        }
    }

    private void handleErrorCodes(String result) {
        try {
            JSONObject object = new JSONObject(result);
            String errorCode = object.getString("error_code");
            String errorMessage = object.getString("error");

            switch (errorCode) {
                case "E00":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E01":
                    DialogsManager.showErrorDialogWithOkHandle(this, "Error", errorMessage, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            AppUtil.clearUserData(SignInActivity.this);
                            Intent intent = new Intent(SignInActivity.this, GeneratePinActivity.class);
                            startActivity(intent);
                        }
                    });
                    break;
                case "E02":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E03":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E04":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E05":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E06":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E07":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E08":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E09":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E100":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            DialogsManager.showErrorDialogWithOkHandle(SignInActivity.this, "Error", "Some problem occurred", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    pinText.setText("");
                    idText.setText("");
                }
            });
        }
    }

    private void saveUserModelToSharedPref(String result, String kycId, String pinMd5) {
        SharedPrefManager prefManager = new SharedPrefManager(this);
        prefManager.saveUserData(result);
        prefManager.saveKycId(kycId);
        prefManager.savePinMd5(pinMd5);
    }
}