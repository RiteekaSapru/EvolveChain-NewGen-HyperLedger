package com.newgen.evolvechain.new_uis;

import android.content.Intent;
import android.os.Handler;
import android.support.v4.app.ActivityOptionsCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.SharedPrefManager;

import java.util.UUID;

public class StartActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        if (!(new SharedPrefManager(this).getUUID().length() > 0)) {
            String androidId = UUID.randomUUID().toString();
            new SharedPrefManager(this).setUUID(androidId);
        }
        else {
            AppManager.getInstance().uuid = new SharedPrefManager(this).getUUID();
        }

        String phone = new SharedPrefManager(this).getNumber();
        String isd = new SharedPrefManager(this).getISD();


        if (phone.length() > 0 && isd.length() > 0) {

            AppManager.getInstance().phone = phone;
            AppManager.getInstance().isd = isd;

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
