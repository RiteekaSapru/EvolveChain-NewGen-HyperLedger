package com.newgen.evolvechain.uis.activities;

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
import com.newgen.evolvechain.utils.DialogsManager;

import org.json.JSONObject;

public class GeneratePinActivity extends AppCompatActivity {

    private EditText idText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_pin);
        idText = findViewById(R.id.edit_text_kyc_id);
    }

    public void onGetOtpClick(View view) {
        final String id = idText.getText().toString();

        if (id.length() <= 0) {
            DialogsManager.showErrorDialog(this, "Error", "Please Enter KYC Id");
        } else {
            String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_PIN;// + AppManager.getInstance().initToken;
            final JSONObject object = new JSONObject();
            try {
                object.put("ekyc_id", id);
            } catch (Exception e) {
                e.printStackTrace();
            }

            new PostTask(object.toString(), url, new WebConnectionListener() {
                ProgressDialog dialog;

                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(GeneratePinActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();


                    try {
                        JSONObject object1 = new JSONObject(result);
                        int statusCode = object1.getInt("success");
                        switch (statusCode){
                            case 0:
                                DialogsManager.showErrorDialog(GeneratePinActivity.this, "Error", object1.getString("error"));
                                break;
                            case 1:
                                Intent intent = new Intent(GeneratePinActivity.this, GeneratePinStep2Activity.class);
                                intent.putExtra("kyc_id", id);
                                startActivity(intent);
                                break;
                        }
                    }
                    catch (Exception e) {
                        DialogsManager.showErrorDialog(GeneratePinActivity.this, "Error", "Some error occurred, please try later");
                    }

                }
            }).execute();
        }
    }

}
