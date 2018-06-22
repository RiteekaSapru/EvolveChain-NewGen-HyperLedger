package com.newgen.evolvechain.new_uis;

import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.newgen.evolvechain.BasicDataListener;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.new_uis.OthersRegistrationActivity;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.Utility;
import com.newgen.evolvechain.utils.networks.SendBasicData;

public class AddressDetailActivity extends AppCompatActivity {

    private EditText address1Text, address2Text, streetText, cityText, stateText, countryText, areaCodeText;

    String[] countryNames;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_address_detail);

        initUis();
        fillUis();
    }

    private void fillUis() {
        UserBasicModel basicModel = AppManager.getInstance().basicModel;
        if (basicModel != null && (basicModel.getAddress1() != null && basicModel.getAddress1().length() > 0)) {
            address1Text.setText(basicModel.getAddress1());
            address2Text.setText(basicModel.getAddress2());
            streetText.setText(basicModel.getStreet());
            cityText.setText(basicModel.getCity());
            stateText.setText(basicModel.getState());
            countryText.setText(basicModel.getCountry());
            areaCodeText.setText(basicModel.getZip());
        }
    }

    private void initUis() {
        address1Text = findViewById(R.id.edit_text_address_1);
        address2Text = findViewById(R.id.edit_text_address_2);
        streetText = findViewById(R.id.edit_text_street);
        cityText = findViewById(R.id.edit_text_city);
        stateText = findViewById(R.id.edit_text_state);

        countryText = findViewById(R.id.edit_text_country);
        countryText.setText(AppManager.getInstance().selectedCountryModel.getName());

        areaCodeText = findViewById(R.id.edit_text_area_code);
    }

    public void onCountrySelectionClicked(View view) {
        if (AppManager.getInstance().selectedCountry == AppConstants.SELECTED_COUNTRY_NORTH_AMERICA) {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Select your country");
            builder.setItems(countryNames, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    countryText.setText(countryNames[i]);
                }
            });
            builder.create().show();
        }
    }

    public void onSaveClick(View view) {
        String address1 = address1Text.getText().toString();
        String address2 = address2Text.getText().toString();
        String street = streetText.getText().toString();
        String city = cityText.getText().toString();
        String state = stateText.getText().toString();
        String country = countryText.getText().toString();
        String areaCode = areaCodeText.getText().toString();

        if (address1.length() <= 0) {
            address1Text.requestFocus();
            address1Text.setError("Please fill address");
        } else {
            if (street.length() <= 0) {
                streetText.requestFocus();
                streetText.setError("Please fill street");
            } else {
                if (city.length() <= 0) {
                    cityText.requestFocus();
                    cityText.setError("Please fill city");
                } else {
                    if (areaCode.length() < 6) {
                        areaCodeText.requestFocus();
                        areaCodeText.setError("Please fill valid zip");

                    } else {
                        if (state.length() <= 0) {
                            stateText.requestFocus();
                            stateText.setError("Please fill state");

                        } else {
                            if (country.length() <= 0) {
                                countryText.requestFocus();
                                countryText.setError("Please fill country");

                            } else {
                                AppManager.getInstance().basicModel.setAddress1(address1);
                                AppManager.getInstance().basicModel.setAddress2(address2);
                                AppManager.getInstance().basicModel.setStreet(street);
                                AppManager.getInstance().basicModel.setCity(city);
                                AppManager.getInstance().basicModel.setState(state);
                                AppManager.getInstance().basicModel.setCountry(country);
                                AppManager.getInstance().basicModel.setZip(areaCode);
                                sendBasicData();
                            }
                        }
                    }
                }
            }
        }

    }

    private void sendBasicData() {
        SendBasicData sendBasicData = new SendBasicData(this);
        sendBasicData.saveBasicTask(new BasicDataListener() {
            @Override
            public void succeed() {
                Intent intent = new Intent(AddressDetailActivity.this, OthersRegistrationActivity.class);
                startActivity(intent);
            }

            @Override
            public void failed() {
                AppManager.getInstance().basicModel.setAddress1(null);
                AppManager.getInstance().basicModel.setAddress2(null);
                AppManager.getInstance().basicModel.setStreet(null);
                AppManager.getInstance().basicModel.setCity(null);
                AppManager.getInstance().basicModel.setState(null);
                AppManager.getInstance().basicModel.setCountry(null);
                AppManager.getInstance().basicModel.setZip(null);
                Intent intent = new Intent(AddressDetailActivity.this, OthersRegistrationActivity.class);
                startActivity(intent);
            }
        });
    }

    @Override
    public void onPause(){
        super.onPause();
        Utility.hideKeyBoard(this, stateText);
    }
}
