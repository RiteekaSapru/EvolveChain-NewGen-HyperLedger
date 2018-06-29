package com.newgen.evolvechain.new_uis;

import android.Manifest;
import android.app.ActionBar;
import android.app.DatePickerDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
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
import com.newgen.evolvechain.utils.Utility;
import com.newgen.evolvechain.utils.networks.SendDocumentData;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class DynamicDocumentActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private EditText optionChooser, numberText, dateText, countryText;
    private TextInputLayout dateLayer;
    private TextInputLayout optionLayer;
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
        //handleSaveData();
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

        optionLayer = findViewById(R.id.option_choose_layer);
        numberLayer = findViewById(R.id.number_layer);
        dateLayer = findViewById(R.id.date_layer);
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

        switch (docType) {
            case "Identity":
                if (AppManager.getInstance().identityDocumentModel != null) {
                    DocumentModel identityModel = AppManager.getInstance().identityDocumentModel;
                    setData(identityModel);
                }
                break;
            case "Address":
                if (AppManager.getInstance().addressDocumentModel != null) {
                    DocumentModel addressModel = AppManager.getInstance().addressDocumentModel;
                    setData(addressModel);
                }
                break;
        }

    }

    private void setData(DocumentModel documentModel) {
        //SetUpSpinner
        String typeCode = documentModel.getTypeCode();

        for (int i = 0; i < docTypes.size(); i++) {
            if (typeCode.equals(docTypes.get(i).getCode())) {
                spinner.setSelection(i);
            }
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
        String myFormat = "yyyy-MM-dd"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        dateText.setText(formattedDate(sdf.format(myCalendar.getTime())));

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
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.setType("image/*");
            intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
            intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            //intent.setAction(Intent.ACTION_GET_CONTENT);
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
        DocTypeModel typeModel = docTypes.get(i);

        if (typeModel.isExpiryDate()) {
            dateLayer.setVisibility(View.VISIBLE);
            dateText.setVisibility(View.VISIBLE);
            dateLayer.setHint("Expiry Date");
            showDateText = true;
        } else {
            dateText.setVisibility(View.GONE);
            dateLayer.setVisibility(View.GONE);
            showDateText = false;
        }

        if (typeModel.getSubDocTypes().length > 0) {
            optionLayer.setVisibility(View.VISIBLE);
            optionChooser.setVisibility(View.VISIBLE);
            optionLayer.setHint("Bill Type");

            options = new String[typeModel.getSubDocTypes().length];
            optionCodes = new String[typeModel.getSubDocTypes().length];
            for (int temp = 0; temp < options.length; temp++) {
                options[temp] = typeModel.getSubDocTypes()[temp].getName();
                optionCodes[temp] = typeModel.getSubDocTypes()[temp].getCode();
            }
            showOptionChooser = true;
        } else {
            optionLayer.setVisibility(View.GONE);
            optionChooser.setVisibility(View.GONE);
            showOptionChooser = false;

        }

        numberLayer.setHint(spinnerStrings[i] + "Number");
        countryLayer.setHint("Issue Country");
        selectedType = spinnerStrings[i];
        selectedTypeCode = typeModel.getCode();

        clearFields();
        fillSavedData(typeModel);
    }

    private void fillSavedData(DocTypeModel typeModel) {
        switch (docType){
            case "Identity":
                DocumentModel identityDocModel = null;
                if (AppManager.getInstance().identityDocumentModel != null && AppManager.getInstance().identityDocumentModel.getTypeCode().equals(typeModel.getCode())){
                    identityDocModel = AppManager.getInstance().identityDocumentModel;
                }
                else {
                    if (AppManager.getInstance().addressDocumentModel != null && AppManager.getInstance().addressDocumentModel.getTypeCode().equals(typeModel.getCode())) {
                        identityDocModel = AppManager.getInstance().addressDocumentModel;
                    }
                }

                if (identityDocModel != null) {
                    fillData(identityDocModel);
                }
                break;
            case "Address":
                DocumentModel documentModel = null;
                if (AppManager.getInstance().addressDocumentModel != null && AppManager.getInstance().addressDocumentModel.getTypeCode().equals(typeModel.getCode())){
                    documentModel = AppManager.getInstance().addressDocumentModel;
                }
                else {
                    if (AppManager.getInstance().identityDocumentModel != null && AppManager.getInstance().identityDocumentModel.getTypeCode().equals(typeModel.getCode())) {
                        documentModel = AppManager.getInstance().identityDocumentModel;
                    }
                }

                if (documentModel != null) {
                    fillData(documentModel);
                }
                break;
        }
    }

    private void fillData(DocumentModel identityDocumentModel) {
        frontUri = identityDocumentModel.getFrontUri();
        frontImage.setImageURI(frontUri);

        backUri = identityDocumentModel.getBackUri();
        backImage.setImageURI(backUri);

        setOptionChooserText(identityDocumentModel.getSubTypeCode());

        dateText.setText(formattedDate(identityDocumentModel.getExpiryDate()));
        countryText.setText(identityDocumentModel.getIssueCountry());

        numberText.setText(identityDocumentModel.getNumber());
    }

    private void setOptionChooserText(String subTypeCode) {
        for (int i = 0; i < docTypes.size(); i++) {
            DocTypeModel model = docTypes.get(i);
            if (model.getSubDocTypes().length > 0) {
                for (int j = 0; j < model.getSubDocTypes().length; j++) {
                    if (model.getSubDocTypes()[j].getCode().equals(subTypeCode)) {
                        optionChooser.setText(model.getSubDocTypes()[j].getName());
                        AppManager.getInstance().addressDocumentModel.setSubType( model.getSubDocTypes()[j].getName());
                    }
                }
            }
        }
    }

    private String formattedDate(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat showDateFormat = new SimpleDateFormat("MMM dd, yyyy");
        try {
            Date date = dateFormat.parse(dateString);
            return showDateFormat.format(date);
        }
        catch (Exception e) {
            return dateString;
        }
    }

    private String formatDateForServer(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd, yyyy");
        SimpleDateFormat showDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = dateFormat.parse(dateString);
            return showDateFormat.format(date);
        }
        catch (Exception e) {
            return dateString;
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
        String expiryDate = formatDateForServer(dateText.getText().toString());
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

    @Override
    public void onPause(){
        super.onPause();
        Utility.hideKeyBoard(this, numberText);
    }
}
