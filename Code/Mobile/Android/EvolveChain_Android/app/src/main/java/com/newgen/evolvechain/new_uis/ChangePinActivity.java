package com.newgen.evolvechain.new_uis;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.PinText;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

public class ChangePinActivity extends AppCompatActivity {

    private PinText oldPinText, pinText, rePinText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_pin);

        initUis();
    }

    private void initUis() {
        oldPinText = findViewById(R.id.edit_text_old_pin);
        Utility.openKeyBoard(this, oldPinText);
        pinText = findViewById(R.id.edit_text_code);
        rePinText = findViewById(R.id.edit_text_re_code);

        oldPinText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                if (str.length() == 6) {
                    pinText.requestFocus();
                }
            }
        });

        pinText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                if (str.length() == 6) {
                    rePinText.requestFocus();
                }
            }
        });

        rePinText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                if (str.length() == 6) {
                    callChangePinTask();
                }
            }
        });
    }

    private void callChangePinTask() {
        String[] strings = getAllString();
        if (strings[0].length() < 6) {
            DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please enter old pin", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    oldPinText.setText("");
                    oldPinText.requestFocus();
                }
            });
        } else {
            if (strings[1].length() < 6) {
                DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please enter new pin", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        pinText.setText("");
                        pinText.requestFocus();
                    }
                });
            } else {
                if (strings[2].length() < 6) {
                    DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please re-enter new pin", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            rePinText.setText("");
                            rePinText.requestFocus();
                        }
                    });
                } else {
                    if (!strings[2].equals(strings[1])) {
                        DialogsManager.showErrorDialog(this, "Error", getString(R.string.pin_mismatched));
                    } else {
                        runTask(strings);
                    }
                }
            }
        }
    }

    private void runTask(final String[] strings) {
        String kycId = AppManager.getInstance().kycId;
        if (kycId != null && kycId.length() > 0) {
            try {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("ekyc_id", kycId);
                jsonObject.put("pin", Utility.md5(strings[0]));
                jsonObject.put("new_pin", Utility.md5(strings[1]));

                String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.CHANGE_PIN;

                new PostTask(jsonObject.toString(), url, new WebConnectionListener() {
                    ProgressDialog dialog;
                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(ChangePinActivity.this, "", getString(R.string.saving_pin));
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            DialogsManager.showErrorDialogWithOkHandle(ChangePinActivity.this, "", "Pin has been changed successfully", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialogInterface, int i) {
                                    //finish();
                                    AppUtil.clearUserData(ChangePinActivity.this);
                                    Intent intent = new Intent(ChangePinActivity.this, SignInActivity.class);
                                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                    startActivity(intent);
                                }
                            });
                        }
                        else {
                            DialogsManager.showErrorDialog(ChangePinActivity.this, "Error", AppUtil.getError(result));
                        }
                    }
                }).execute();
            } catch (Exception e) {
                e.printStackTrace();
                DialogsManager.showErrorDialog(ChangePinActivity.this, "Error", "Some error occurred.");
            }
        }
    }

    private String[] getAllString() {
        String oldPin = oldPinText.getText().toString();
        String pin = pinText.getText().toString();
        String rePin = rePinText.getText().toString();

        return new String[]{oldPin, pin, rePin};
    }

    public void onChangePinClick(View view) {
        callChangePinTask();
    }

    @Override
    public void onBackPressed(){
        NavUtils.navigateUpFromSameTask(this);
    }

    @Override
    public void onPause(){
        super.onPause();
        Utility.hideKeyBoard(this, pinText);
    }
}
