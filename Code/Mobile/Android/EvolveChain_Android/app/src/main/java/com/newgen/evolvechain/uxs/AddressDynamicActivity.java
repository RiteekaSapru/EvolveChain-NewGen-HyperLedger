package com.newgen.evolvechain.uxs;

import android.net.Uri;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.Spinner;

import com.newgen.evolvechain.FragmentCommunicator;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.uxs.fragments.DrivingLicenseFragment;
import com.newgen.evolvechain.uxs.fragments.PassportFragment;

public class AddressDynamicActivity extends AppCompatActivity implements
         AdapterView.OnItemSelectedListener,
        PassportFragment.OnFragmentInteractionListener,
        DrivingLicenseFragment.OnFragmentInteractionListener{

    FrameLayout container;
    Spinner spinner;
    Button saveButton;

    String[] addressTypes;
    public FragmentCommunicator fragmentCommunicator;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_address_dynamic);

        addressTypes = new String[]{"Passport", "Driving License", "Taxation"};
        initUis();
    }

    private void initUis() {
        container = findViewById(R.id.container);

        spinner = findViewById(R.id.spinner);
        spinner.setOnItemSelectedListener(this);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this, R.layout.spinner_text_layout, addressTypes);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(dataAdapter);

        saveButton = findViewById(R.id.btn_save);
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {

        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();

        switch (i){
            case 0:
                PassportFragment passportFragment = new PassportFragment();
                transaction.add(R.id.container, passportFragment);
                break;
            case 1:
                DrivingLicenseFragment drivingLicenseFragment = new DrivingLicenseFragment();
                transaction.add(R.id.container, drivingLicenseFragment);
                break;
            case 2:
                break;
            case 3:
                break;

        }
        transaction.commit();

    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    public void onSaveClick(View view) {
        fragmentCommunicator.saveCall();
    }
}
