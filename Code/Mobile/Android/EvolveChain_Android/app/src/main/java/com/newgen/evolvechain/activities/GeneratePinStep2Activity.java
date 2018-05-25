package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

import java.util.UUID;

public class GeneratePinStep2Activity extends AppCompatActivity {

    private String kycId;
    private EditText otpText, pinText, rePinText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_pin_step2);

        if (getIntent().getStringExtra("kyc_id") != null) {
            kycId = getIntent().getStringExtra("kyc_id");
        }

        initUi();
    }

    private void initUi() {
        otpText = findViewById(R.id.edit_text_otp);
        pinText = findViewById(R.id.edit_text_code);
        rePinText = findViewById(R.id.edit_text_re_code);
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
        }
        else {
            if (pin.length() <= 0) {
                DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Please enter Pin", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        pinText.requestFocus();
                    }
                });
            }
            else {
                if (rePin.length() <= 0 || !pin.equals(rePin)) {
                    DialogsManager.showErrorDialogWithOkHandle(this, "Error", "Both Pins are not same", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            rePinText.requestFocus();
                        }
                    });
                }

                else {
                    callGeneratePinTask(otp, pin);
                }
            }
        }
    }

    private void callGeneratePinTask(String otp, String pin) {
        JSONObject object = new JSONObject();
        try{
            object.put("ekyc_id", kycId);
            object.put("pin", Utility.md5(pin));
            object.put("pin_otp", Utility.md5(otp));
            object.put("vendor_uuid", UUID.randomUUID().toString());

            String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.SET_PIN + AppManager.getInstance().initToken;

            new PostTask(object.toString(), url, new WebConnectionListener() {
                ProgressDialog dialog;
                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(GeneratePinStep2Activity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                }
            }).execute();

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
