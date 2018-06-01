package com.newgen.evolvechain.uis.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.newgen.evolvechain.BaseActivity;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.AppUtil;

public class SettingActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);
    }

    public void onChangePinClick(View view) {
    }

    public void onLogoutClick(View view) {
        AppUtil.clearUserData(this);
        Intent intent = new Intent(this, SplashActivity.class);
        startActivity(intent);
    }
}
