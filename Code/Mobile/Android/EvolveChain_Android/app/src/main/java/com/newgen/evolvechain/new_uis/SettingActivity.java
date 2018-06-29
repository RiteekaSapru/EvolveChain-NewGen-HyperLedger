package com.newgen.evolvechain.new_uis;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NavUtils;
import android.view.MenuItem;
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
        Intent intent = new Intent(this, ChangePinActivity.class);
        startActivity(intent);
    }

    public void onLogoutClick(View view) {
        AppUtil.clearUserData(this);
        Intent intent = new Intent(this, SplashActivity.class);
        startActivity(intent);
    }

    @Override
    public void onBackPressed(){
        NavUtils.navigateUpFromSameTask(this);
    }
}
