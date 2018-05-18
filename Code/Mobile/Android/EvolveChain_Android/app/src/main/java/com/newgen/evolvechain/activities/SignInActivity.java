package com.newgen.evolvechain.activities;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import com.newgen.evolvechain.R;

public class SignInActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);
    }

    public void onGenerateClick(View view) {
        Intent intent = new Intent(this, GeneratePinActivity.class);
        startActivity(intent);
    }
}
