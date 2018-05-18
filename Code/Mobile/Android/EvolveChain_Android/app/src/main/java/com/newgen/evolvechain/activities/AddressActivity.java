package com.newgen.evolvechain.activities;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;

import com.newgen.evolvechain.R;

import java.util.ArrayList;
import java.util.List;

public class AddressActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private EditText editTextAddress1, editTextAddress2, editTextState, editTextCountry, editTextAreaCode;
    private ImageView image1;
    private Spinner spinner;
    private LinearLayout utilityPanel, taxationPanel;

    private List<String> options = new ArrayList<>();

    private static final int PICK_IMAGE = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_address);

        options.add("Utility Bill");
        options.add("Taxation Id");

        initUis();
    }

    private void initUis() {

        spinner = findViewById(R.id.spinner);

        spinner.setOnItemSelectedListener(this);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(this, R.layout.spinner_text_layout, options);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(dataAdapter);

        editTextAddress1 = findViewById(R.id.edit_text_address_1);
        editTextAddress2 = findViewById(R.id.edit_text_address_2);
        editTextState = findViewById(R.id.edit_text_state);
        editTextCountry = findViewById(R.id.edit_text_country);
        editTextAreaCode = findViewById(R.id.edit_text_area_code);

        utilityPanel = findViewById(R.id.utility_panel);
        taxationPanel = findViewById(R.id.taxation_panel);

        image1 = findViewById(R.id.image1);
    }

    public void onSaveClick(View view) {
        String address1 = editTextAddress1.getText().toString();
        String address2 = editTextAddress2.getText().toString();
        String state = editTextState.getText().toString();
        String country = editTextCountry.getText().toString();
        String areaCode = editTextAreaCode.getText().toString();

        if (address1.length() > 0 && address2.length() > 0 && state.length() > 0 && country.length() > 0 && areaCode.length() > 0) {
            Intent intent = new Intent(this, OthersRegistrationActivity.class);
            startActivity(intent);
        }
    }

    public void onImageClick(View view) {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Uri backUri = data.getData();
        try {
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), backUri);
            image1.setImageBitmap(bitmap);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        switch (i){
            case 0:
                utilityPanel.setVisibility(View.VISIBLE);
                taxationPanel.setVisibility(View.GONE);
                break;
            case 1:
                utilityPanel.setVisibility(View.GONE);
                taxationPanel.setVisibility(View.VISIBLE);
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }
}
