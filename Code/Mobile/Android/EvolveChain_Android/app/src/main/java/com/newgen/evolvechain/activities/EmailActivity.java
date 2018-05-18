package com.newgen.evolvechain.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.EditText;

import com.newgen.evolvechain.AppConstants;
import com.newgen.evolvechain.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;

import org.json.JSONObject;

public class EmailActivity extends AppCompatActivity {

    private EditText emailText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_email);
        emailText = findViewById(R.id.edit_text_email);
    }

    public void onAddClick(View view) {
        if (isValidEmail(emailText.getText().toString())) {
            final JSONObject object = new JSONObject();
            try {
                object.put("email", emailText.getText().toString());
            }
            catch (Exception e) {
                e.printStackTrace();
            }

            final String urlData = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.GENERATE_EMAIL_OTP + AppManager.getInstance().initToken;

            new PostTask(object.toString(), urlData, new WebConnectionListener() {
                ProgressDialog dialog;
                @Override
                public void onTaskStart() {
                    dialog = ProgressDialog.show(EmailActivity.this, "", "Loading...");
                }

                @Override
                public void onTaskComplete(String result) {
                    dialog.dismiss();
                    Intent intent = new Intent(EmailActivity.this, OTPActivity.class);
                    intent.putExtra("type", AppConstants.VERIFICATION_TYPE_EMAIL);
                    intent.putExtra("data", object.toString());
                    intent.putExtra("url", urlData);
                    intent.putExtra("value", emailText.getText().toString());
                    startActivity(intent);
                }
            }).execute();
        }
    }

    public static boolean isValidEmail(CharSequence target) {
        return (!TextUtils.isEmpty(target) && Patterns.EMAIL_ADDRESS.matcher(target).matches());
    }
}
