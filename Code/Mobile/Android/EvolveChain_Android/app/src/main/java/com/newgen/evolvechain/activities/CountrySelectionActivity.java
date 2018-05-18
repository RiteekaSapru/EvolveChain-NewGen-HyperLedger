package com.newgen.evolvechain.activities;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;

import com.newgen.evolvechain.R;

public class  CountrySelectionActivity extends AppCompatActivity {

    private static final int SELECTED_COUNTRY_INDIA = 0;
    private static final int SELECTED_COUNTRY_OTHERS = 1;

    private static int selectedOption = -1;
    private Button proceedButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_country_selection);
        initUis();
    }

    private void initUis() {
        proceedButton = findViewById(R.id.btn_proceed);
        proceedButton.setEnabled(false);
    }

    public void onCountrySelectionClicked(View view) {
        boolean isChecked = ((RadioButton) view).isChecked();

        switch (view.getId()){
            case R.id.radioButtonIndia:
                if (isChecked){
                    selectedOption = 0;
                    proceedButton.setEnabled(true);
                }
                break;
            case R.id.radioButtonOthers:
                if (isChecked){
                    selectedOption = 1;
                    proceedButton.setEnabled(true);
                }
                break;
        }
    }

    public void onProceedButtonClicked(View view) {
        if (selectedOption >= 0){
            switch (selectedOption){
                case SELECTED_COUNTRY_INDIA:
//                    Intent indiaIntent = new Intent(CountrySelectionActivity.this, IndiaRegistrationActivity.class);
//                    startActivity(indiaIntent);
                    break;
                case SELECTED_COUNTRY_OTHERS:
                    Intent othersIntent = new Intent(CountrySelectionActivity.this, OthersRegistrationActivity.class);
                    startActivity(othersIntent);
                    break;
            }
        }
    }
}
