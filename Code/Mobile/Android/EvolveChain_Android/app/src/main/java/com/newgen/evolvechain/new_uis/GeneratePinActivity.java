package com.newgen.evolvechain.new_uis;

import android.app.ProgressDialog;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
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

public class GeneratePinActivity extends AppCompatActivity {

    private EditText idText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_pin);
        idText = findViewById(R.id.edit_text_kyc_id);
        setUpIdTextWatcher();
        Utility.openKeyBoard(this, idText);

    }

    private void setUpIdTextWatcher() {
        //idText.setTransformationMethod(new KycIdTransformation());
        idText.addTextChangedListener(new TextWatcher() {
            boolean change = true;
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                change = i2 != 0;
            }

            @Override
            public void afterTextChanged(Editable editable) {
                if (change) {
                    if (editable.toString().length() == 3 || editable.toString().length() == 8 || editable.toString().length() == 13) {
                        editable.append('-');
                    }
                }
            }
        });
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
                                AppManager.getInstance().kycId = id;
                                Intent intent = new Intent(GeneratePinActivity.this, GeneratePinStep2Activity.class);
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

    public void onClearClick(View view) {
        idText.setText("");
    }
}
