package com.newgen.evolvechain.uis.activities;

import android.content.Intent;
import android.os.Handler;
import android.provider.Settings;
import android.support.v4.app.ActivityOptionsCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.SharedPrefManager;

import java.util.UUID;

public class StartActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        if (!(new SharedPrefManager(this).getUUID().length() > 0)) {
            String androidId = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
            new SharedPrefManager(this).setUUID(androidId);
        }
        else {
            AppManager.getInstance().uuid = new SharedPrefManager(this).getUUID();
        }

        String kycId = new SharedPrefManager(this).getKycId();
        //String pinMd5 = new SharedPrefManager(this).getPinMd5();
//        UserBasicModel basicModel = null;
//        if (new SharedPrefManager(this).getUserDataInString().length() > 0) {
//            basicModel = new SharedPrefManager(this).getUserData();
//        }


        //showTestAlert();


        if (kycId.length() > 0) {

            AppManager.getInstance().kycId = kycId;

            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                public void run() {
                    openSignInActivity();
                }
            }, 2000);
        } else {
            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                public void run() {
                    openStartActivity();
                }
            }, 2000);
        }
    }

    private void showTestAlert() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setView(R.layout.popup_terms_conditions);
        builder.create().show();
    }

    private void openStartActivity() {
        Intent intent = new Intent(this, SplashActivity.class);
        ActivityOptionsCompat options = ActivityOptionsCompat.makeSceneTransitionAnimation(this, findViewById(R.id.image), "splash_image");
        startActivity(intent, options.toBundle());
    }

    private void openSignInActivity() {
        Intent intent = new Intent(this, SignInActivity.class);
        ActivityOptionsCompat options = ActivityOptionsCompat.makeSceneTransitionAnimation(this, findViewById(R.id.image), "splash_image");
        startActivity(intent, options.toBundle());
    }
}
