package com.newgen.evolvechain.new_uis;

import android.Manifest;
import android.app.ActionBar;
import android.app.DatePickerDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TextInputLayout;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toolbar;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.DocTypeModel;
import com.newgen.evolvechain.models.DocumentModel;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.networks.SendDocumentData;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

public class DynamicDocumentActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private EditText optionChooser, numberText, dateText, countryText;
    private TextInputLayout numberLayer;
    private TextInputLayout countryLayer;
    private ImageView frontImage, backImage;
    private Spinner spinner;

    private String[] spinnerStrings, options, optionCodes;
    private boolean showOptionChooser = false, showDateText = true;
    private String country;
    private Uri frontUri, backUri;
    private String selectedType, selectedTypeCode, docType, subTypeCode;

    Calendar myCalendar = Calendar.getInstance();
    DatePickerDialog.OnDateSetListener date;

    private static final int PICK_FRONT_IMAGE = 0;
    private static final int PICK_BACK_IMAGE = 1;
    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 1;

    private ArrayList<DocTypeModel> docTypes;
    private DocumentModel documentModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dynamic_identity);

        getData();
        setUpArrays();
        setUpSpinner();
        setUpFields();
        setUpDatePicker();
        handleSaveData();
    }

    private void getData() {
        country = AppManager.getInstance().selectedCountryModel.getName();
        docType = getIntent().getStringExtra("type");
        switch (docType) {
            case "Identity":
                docTypes = AppManager.getInstance().identityDocs;
                break;
            case "Address":
                docTypes = AppManager.getInstance().addressDocs;
                break;
        }
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(docType + " Proof");
        }
    }

    private void setUpFields() {
        frontImage = findViewById(R.id.front_image);
        backImage = findViewById(R.id.back_image);

        optionChooser = findViewById(R.id.option_chooser);
        numberText = findViewById(R.id.number_text);
        dateText = findViewById(R.id.date_text);

        countryText = findViewById(R.id.country_text);
        countryText.setText(country);

        TextInputLayout optionLayer = findViewById(R.id.option_choose_layer);
        numberLayer = findViewById(R.id.number_layer);
        TextInputLayout dateLayer = findViewById(R.id.date_layer);
        countryLayer = findViewById(R.id.country_layer);

        if (showOptionChooser) {
            optionLayer.setVisibility(View.VISIBLE);
            optionChooser.setVisibility(View.VISIBLE);
            optionLayer.setHint("Bill Type");
        } else {
            optionLayer.setVisibility(View.GONE);
            optionChooser.setVisibility(View.GONE);

        }

        if (showDateText) {
            dateLayer.setVisibility(View.VISIBLE);
            dateText.setVisibility(View.VISIBLE);
            dateLayer.setHint("Expiry Date");
        } else {
            dateText.setVisibility(View.GONE);
            dateLayer.setVisibility(View.GONE);
        }

    }

    private void handleSaveData() {
        switch (docType) {
            case "Identity":
                if (documentModel == null && AppManager.getInstance().addressDocumentModel != null) {
                    documentModel = AppManager.getInstance().addressDocumentModel;
                }
                if (AppManager.getInstance().identityDocumentModel != null) {
                    documentModel = AppManager.getInstance().identityDocumentModel;
                }
                break;
            case "Address":
                if (documentModel == null && AppManager.getInstance().identityDocumentModel != null) {
                    documentModel = AppManager.getInstance().identityDocumentModel;
                }
                if (AppManager.getInstance().addressDocumentModel != null) {
                    documentModel = AppManager.getInstance().addressDocumentModel;
                }
                break;
        }

        if (documentModel != null) {
            String typeCode = documentModel.getTypeCode();

            for (int i = 0; i < docTypes.size(); i++) {
                DocTypeModel model = docTypes.get(i);

                if (typeCode.equals(model.getCode())) {
                    switch (docType) {
                        case "Identity":
                            AppManager.getInstance().identityDocumentModel = documentModel;
                            break;
                        case "Address":
                            AppManager.getInstance().addressDocumentModel = documentModel;
                            break;
                    }
                    spinner.setSelection(i);
                }
            }
        }


    }

    private void setUpArrays() {
        spinnerStrings = new String[docTypes.size()];
        for (int i = 0; i < docTypes.size(); i++) {
            DocTypeModel docTypeModel = docTypes.get(i);
            spinnerStrings[i] = docTypeModel.getName();
        }
    }

    private void setUpSpinner() {
        spinner = findViewById(R.id.spinner);

        spinner.setOnItemSelectedListener(this);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this, R.layout.spinner_text_layout, spinnerStrings);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(dataAdapter);
    }

    private void setUpDatePicker() {
        date = new DatePickerDialog.OnDateSetListener() {

            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear,
                                  int dayOfMonth) {
                // TODO Auto-generated method stub
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                updateLabel();
            }

        };
    }

    private void updateLabel() {
        String myFormat = "dd-MMM-yyyy"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        dateText.setText(sdf.format(myCalendar.getTime()));
    }

    // Onclick from UI
    public void onSaveClick(View view) {
        saveDataTask();
    }

    public void onDateClick(View view) {
        DatePickerDialog datePickerDialog = new DatePickerDialog(this, date, myCalendar
                .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                myCalendar.get(Calendar.DAY_OF_MONTH));


        datePickerDialog.getDatePicker().setMinDate(myCalendar.getTimeInMillis());
        datePickerDialog.show();
    }

    public void onImageClick(View view) {
        Snackbar snackbar = Snackbar.make(findViewById(R.id.base_view), "Please provide read file permission to pick image", Snackbar.LENGTH_LONG);
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            snackbar.dismiss();
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            switch (view.getId()) {
                case R.id.front_image:
                    startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_FRONT_IMAGE);
                    break;
                case R.id.back_image:
                    startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_BACK_IMAGE);
                    break;
            }
        } else {
            snackbar.show();
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    public void onOptionsClick(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select bill type");
        builder.setItems(options, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                optionChooser.setText(options[i]);
                subTypeCode = optionCodes[i];
            }
        });

        builder.create().show();
    }

    // Spinner Methods
    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        DocTypeModel docTypeModel = docTypes.get(i);
        showDateText = docTypeModel.isExpiryDate();

        showOptionChooser = docTypeModel.getSubDocTypes().length > 0;
        if (showOptionChooser) {
            options = new String[docTypeModel.getSubDocTypes().length];
            optionCodes = new String[docTypeModel.getSubDocTypes().length];
            for (int temp = 0; temp < options.length; temp++) {
                options[temp] = docTypeModel.getSubDocTypes()[temp].getName();
                optionCodes[temp] = docTypeModel.getSubDocTypes()[temp].getCode();
            }
        }

        clearFields();
        numberLayer.setHint(spinnerStrings[i] + "Number");
        countryLayer.setHint("Issue Country");
        selectedType = spinnerStrings[i];
        selectedTypeCode = docTypeModel.getCode();
        setUpFields();

        switch (docType){
            case "Identity":
                if (AppManager.getInstance().identityDocumentModel != null && AppManager.getInstance().identityDocumentModel.getTypeCode()
                        .equals(docTypeModel.getCode())) {
                    DocumentModel documentModel = AppManager.getInstance().identityDocumentModel;
                    numberText.setText(documentModel.getNumber());
                    if (showOptionChooser) {
                        optionChooser.setText(documentModel.getSubType());
                    } else {
                        optionChooser.setText("");
                    }

                    if (showDateText) {
                        dateText.setText(documentModel.getExpiryDate());
                    } else {
                        dateText.setText("");
                    }

                    frontUri = documentModel.getFrontUri();
                    backUri = documentModel.getBackUri();

                    frontImage.setImageURI(frontUri);
                    backImage.setImageURI(backUri);
                }
                else {
                    optionChooser.setText("");
                    dateText.setText("");
                    frontUri = null;
                    backUri = null;
                    frontImage.setImageResource(R.drawable.image_placeholder);
                    backImage.setImageResource(R.drawable.image_placeholder);
                    numberText.setText("");
                }
                break;
            case "Address":
                DocumentModel model = AppManager.getInstance().addressDocumentModel;
                if (AppManager.getInstance().addressDocumentModel != null && AppManager.getInstance().addressDocumentModel.getTypeCode().equals(docTypeModel.getCode())) {
                    DocumentModel documentModel = AppManager.getInstance().addressDocumentModel;
                    numberText.setText(documentModel.getNumber());
                    if (showOptionChooser) {
                        optionChooser.setText(documentModel.getSubType());
                    } else {
                        optionChooser.setText("");
                    }

                    if (showDateText) {
                        dateText.setText(documentModel.getExpiryDate());
                    } else {
                        dateText.setText("");
                    }

                    frontUri = documentModel.getFrontUri();
                    backUri = documentModel.getBackUri();

                    frontImage.setImageURI(frontUri);
                    backImage.setImageURI(backUri);
                }
                else {
                    optionChooser.setText("");
                    dateText.setText("");
                    frontUri = null;
                    backUri = null;
                    frontImage.setImageResource(R.drawable.image_placeholder);
                    backImage.setImageResource(R.drawable.image_placeholder);
                    numberText.setText("");
                }
                break;
        }
    }

    private void clearFields() {
        numberText.setText("");
        dateText.setText("");
        optionChooser.setText("");
        frontUri = null;
        backUri = null;
        frontImage.setImageResource(R.drawable.image_placeholder);
        backImage.setImageResource(R.drawable.image_placeholder);

    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    private void saveDataTask() {
        String number = numberText.getText().toString();
        String expiryDate = dateText.getText().toString();
        String country = countryText.getText().toString();
        String subType = optionChooser.getText().toString();
        Uri frontUri = this.frontUri;
        Uri backUri = this.backUri;

        if (number.length() <= 0) {
            numberText.setError("Please fill document number");
            return;
        }
        if (frontUri == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please choose front side of document");
            return;
        }
        if (backUri == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please choose back side of document");
            return;
        }
        if (showOptionChooser) {
            if (subType.length() <= 0) {
                optionChooser.setError("Please choose document type");
                return;
            }
        } else {
            subType = "";
            subTypeCode = "";
        }

        if (showDateText) {
            if (expiryDate.length() <= 0) {
                dateText.setError("Please choose expiry date");
                return;
            }
        } else {
            expiryDate = "";
        }

        DocumentModel model = new DocumentModel(selectedType, selectedTypeCode, number, expiryDate, country, subType, subTypeCode, frontUri, backUri);
        new SendDocumentData(this).saveDocumentTask(model, docType);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != 0) {
            Uri uri = data.getData();
            try {
                //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), backUri);
                if (requestCode == PICK_FRONT_IMAGE) {
                    frontUri = uri;
                    frontImage.setImageURI(frontUri);
                } else {
                    backUri = uri;
                    backImage.setImageURI(backUri);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
