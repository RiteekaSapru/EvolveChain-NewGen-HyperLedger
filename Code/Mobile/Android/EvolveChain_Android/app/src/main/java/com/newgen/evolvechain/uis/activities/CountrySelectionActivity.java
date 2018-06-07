package com.newgen.evolvechain.uis.activities;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;

public class  CountrySelectionActivity extends AppCompatActivity {
    private RadioGroup radioGroup;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_country_selection);
        initUis();
    }

    private void initUis() {
        radioGroup = findViewById(R.id.country_radio_group);

        CountryCodeModel[] codeModels = AppManager.getInstance().countryCodeModels;
        RadioButton[] radioButtons = new RadioButton[codeModels.length];

        for (int i =0; i < codeModels.length; i++) {
            radioButtons[i] = new RadioButton(this);
            radioButtons[i].setText(codeModels[i].getName());
            radioButtons[i].setId(i + 100);

            if (i == 0) {
                radioButtons[i].setChecked(true);
            }
            radioGroup.addView(radioButtons[i]);
        }
    }

    public void onProceedButtonClicked(View view) {
        int id = radioGroup.getCheckedRadioButtonId();

        if (id >= 0){
            switch (id){
                case 100:
                    DialogsManager.showErrorDialog(this, "", "Under development");
                    break;
                case 101:
                    AppUtil.clearCache();
                    Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
                    startActivity(othersIntent);
                    break;
            }
        }
    }
}
