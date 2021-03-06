package com.newgen.evolvechain.new_uis;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.View;
import android.view.Window;
import android.widget.Button;

import com.newgen.evolvechain.DialogClickListener;
import com.newgen.evolvechain.R;

/**
 * Created by onkar.gupta on 6/1/2018.
 *
 */

public class TermsDialog extends Dialog implements View.OnClickListener {

    private Context context;
    private DialogClickListener listener;

    public TermsDialog(@NonNull Context context) {
        super(context);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.popup_terms_conditions);

        findViewById(R.id.terms_link).setOnClickListener(this);
        findViewById(R.id.close_btn).setOnClickListener(this);
        findViewById(R.id.btn_accept).setOnClickListener(this);
        findViewById(R.id.privacy_link).setOnClickListener(this);

    }

    public void setListener(DialogClickListener listener) {
        this.listener = listener;
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.close_btn:
                dismiss();
                break;
            case R.id.terms_link:
                dismiss();
                listener.onTermsLinkClick();
                break;
            case R.id.privacy_link:
                dismiss();
                listener.onPrivacyClick();
                break;
            case R.id.btn_accept:
                dismiss();
                listener.onAcceptClick();
                break;
        }

    }
}
