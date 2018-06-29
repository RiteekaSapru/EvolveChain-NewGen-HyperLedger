package com.newgen.evolvechain.new_uis;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.PinText;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

public class GeneratePinStep2Activity extends AppCompatActivity {

    private String kycId;
    private PinText otpText, pinText, rePinText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_pin_step2);


        kycId = AppManager.getInstance().kycId;

        initUi();
    }

    private void initUi() {
        otpText = findViewById(R.id.edit_text_otp);
        Utility.openKeyBoard(this, otpText);
        pinText = findViewById(R.id.edit_text_code);
        rePinText = findViewById(R.id.edit_text_re_code);

        setUpPinListener();
    }

    private void setUpPinListener() {
        otpText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                pinText.requestFocus();
            }
        });

        pinText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                rePinText.requestFocus();
            }
        });

        rePinText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                onChangePinClick(findViewById(R.id.change_pin_btn));
            }
        });
    }

    public void onChangePinClick(View view) {
        String otp = otpText.getText().toString();
        String pin = pinText.getText().toString();
        String rePin = rePinText.getText().toString();

        if (otp.length() <= 0) {
            DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please enter OTP", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    otpText.requestFocus();
                }
            });
        } else {
            if (pin.length() <= 0) {
                DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please enter Pin", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        pinText.requestFocus();
                    }
                });
            } else {
                if (rePin.length() <= 0) {//|| !pin.equals(rePin)) {
                    DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please re-enter pin", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            rePinText.requestFocus();
                        }
                    });
                } else {
                    if (!pin.equals(rePin)) {
                        DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Pin dows not matches with re-pin", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                rePinText.requestFocus();
                            }
                        });
                    } else {
                        callGeneratePinTask(otp, pin);
                    }
                }
            }
        }
    }

    private void callGeneratePinTask(String otp, String pin) {
        JSONObject object = new JSONObject();
        try {
            object.put("ekyc_id", kycId);
            object.put("pin", Utility.md5(pin));
            object.put("pin_otp", Utility.md5(otp));
            object.put("vendor_uuid", AppManager.getInstance().uuid);

            String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.SET_PIN;// + AppManager.getInstance().initToken;

            new PostTask(object.toString(), url, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(GeneratePinStep2Activity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    if (AppUtil.isSuccess(result)) {
                        Intent intent = new Intent(GeneratePinStep2Activity.this, SignInActivity.class);
                        startActivity(intent);
                    } else {
                        DialogsManager.showErrorDialogWithOkHandle(GeneratePinStep2Activity.this, "Error", AppUtil.getError(result), new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                pinText.setText("");
                                rePinText.setText("");
                                otpText.setText("");
                            }
                        });
                    }
                    dialog.dismiss();
                }
            }).execute();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
