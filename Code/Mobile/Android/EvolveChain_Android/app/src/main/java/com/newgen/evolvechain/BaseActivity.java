package com.newgen.evolvechain;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;

import com.newgen.evolvechain.new_uis.SignInActivity;

/**
 * Created by onkar.gupta on 5/30/2018.
 *
 */

public class BaseActivity extends AppCompatActivity{

    boolean doLogin = false;

    @Override
    protected void onStop(){
        super.onStop();
        doLogin = true;
    }

    @Override
    protected void onStart(){
        super.onStart();
        if (doLogin) {
            Intent intent = new Intent(this, SignInActivity.class);
            intent.putExtra("do_login", doLogin);
            doLogin = true;
            startActivity(intent);
        }
    }
}
