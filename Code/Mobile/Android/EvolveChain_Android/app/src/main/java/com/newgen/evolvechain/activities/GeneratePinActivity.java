package com.newgen.evolvechain.activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import com.newgen.evolvechain.R;

public class GeneratePinActivity extends AppCompatActivity {

    private LinearLayout otpPanel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_pin);

        initUis();
    }

    private void initUis() {
        otpPanel = findViewById(R.id.otp_panel);
    }

    public void onGetOtpClick(View view) {
        otpPanel.setVisibility(View.VISIBLE);
    }
}
