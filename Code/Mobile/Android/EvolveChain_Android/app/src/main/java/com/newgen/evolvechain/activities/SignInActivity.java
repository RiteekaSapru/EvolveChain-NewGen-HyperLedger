package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.Intent;
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
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONObject;

import java.util.UUID;

public class SignInActivity extends AppCompatActivity {

    private EditText pinText, idText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        initUi();
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

        String pin = pinText.getText().toString();
        String id = idText.getText().toString();

        if (id.length() <= 0) {
            DialogsManager.showErrorDialog(this, "Error", "Please Enter KYC Id");
        } else {
            if (pin.length() <= 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please Enter Pin");
            } else {


                String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.LOGIN + AppManager.getInstance().initToken;
                JSONObject object = new JSONObject();
                try {
                    object.put("ekyc_id", id);
                    object.put("pin", pin);
                    object.put("vendor_uuid", UUID.randomUUID().toString());
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

                    }
                }).execute();
            }
        }
    }
}
