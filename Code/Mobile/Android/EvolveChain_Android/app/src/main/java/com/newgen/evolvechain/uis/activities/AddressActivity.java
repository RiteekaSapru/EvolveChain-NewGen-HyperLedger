package com.newgen.evolvechain.uis.activities;

import android.Manifest;
import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;

import com.newgen.evolvechain.models.AddressModel;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;
import com.newgen.evolvechain.models.documnets.UtilityBillModel;
import com.newgen.evolvechain.models.documnets.UtilityBillTypeModel;
import com.newgen.evolvechain.network_layer.MultiPartTaskUsingBitmap;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.new_uis.OthersRegistrationActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

public class AddressActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private EditText editTextAddress, editTextType, editTextNumber, editTextidentityNumber, editTextExpiryDate, editTextCountry;
    private ImageView image1, image2;
    private LinearLayout utilityPanel, identityPanel;
    private Spinner spinner;

    private List<String> options = new ArrayList<>();

    private static final int PICK_IMAGE_1 = 0;
    private static final int PICK_IMAGE_2 = 1;
    private static final int ADDRESS_TYPE_PASSPORT = 0;
    private static final int ADDRESS_TYPE_DRIVING_LICENSE = 1;
    private static final int ADDRESS_TYPE_UTILITY_BILL = 2;
    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 1;
    private int addressType = ADDRESS_TYPE_PASSPORT;
    private Uri uri1, uri2;

    Calendar myCalendar = Calendar.getInstance();
    Calendar minCalendar = Calendar.getInstance();
    DatePickerDialog.OnDateSetListener date;

    String[] countryNames;
    ArrayList<CountryCodeModel> list;
    UtilityBillTypeModel[] typeModels;
    String currentBillType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_address);

        options.add("Passport");
        options.add("Driving License");
        options.add("Utility Bill");

        initUis();
        setUpDatePicker();
        getCountryData();
    }

    private void updateLabel() {
        String myFormat = "yyyy-MM-dd"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        editTextExpiryDate.setText(sdf.format(myCalendar.getTime()));
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

    private void initUis() {

        spinner = findViewById(R.id.spinner);

        spinner.setOnItemSelectedListener(this);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this, R.layout.spinner_text_layout, options);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(dataAdapter);

        setSpinnerSelection();

        editTextAddress = findViewById(R.id.edit_text_address);
        editTextType = findViewById(R.id.edit_text_type);
        editTextNumber = findViewById(R.id.edit_text_number);

        editTextidentityNumber = findViewById(R.id.edit_text_identity_number);
        editTextExpiryDate = findViewById(R.id.edit_text_expiry_date);
        editTextCountry = findViewById(R.id.edit_text_issue_country);

        utilityPanel = findViewById(R.id.utility_panel);
        identityPanel = findViewById(R.id.identityPanel);

        image1 = findViewById(R.id.image1);
        image2 = findViewById(R.id.image2);
    }

    private void setSpinnerSelection() {
        if (AppManager.getInstance().addressModelV1.getType() >= 0) {
            switch (AppManager.getInstance().addressModelV1.getType()) {
                case AppConstants.DOCUMENT_TYPE_PASSPORT:
                    spinner.setSelection(ADDRESS_TYPE_PASSPORT);
                    break;
                case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                    spinner.setSelection(ADDRESS_TYPE_DRIVING_LICENSE);
                    break;
                case AppConstants.DOCUMENT_TYPE_UTILITY_BILL:
                    spinner.setSelection(ADDRESS_TYPE_UTILITY_BILL);
                    break;
            }
        }
    }


    public void onSaveClick(View view) {
        switch (addressType) {
            case ADDRESS_TYPE_UTILITY_BILL:
                String address = editTextAddress.getText().toString();
                String type = editTextType.getText().toString();
                String number = editTextNumber.getText().toString();

                if (type.length() <= 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please provide type to proceed");
                    editTextType.requestFocus();
                } else {
                    if (number.length() <= 0) {
                        DialogsManager.showErrorDialog(this, "Error", "Please provide Bill number to proceed");
                        editTextNumber.requestFocus();
                    } else {
                        if (address.length() <= 0) {
                            DialogsManager.showErrorDialog(this, "Error", "Please provide Address to proceed");
                            editTextAddress.requestFocus();
                        } else {
                            if (uri1 == null) {
                                DialogsManager.showErrorDialog(this, "Error", "Please add front side of Utility bill");
                            } else {
                                if (uri2 == null) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please back side of Utility bill");
                                } else {
                                    AppManager.getInstance().utilityBillModel = new UtilityBillModel(currentBillType, number, address, uri1, uri2);
                                    AppManager.getInstance().addressModelV1.setType(AppConstants.DOCUMENT_TYPE_UTILITY_BILL);
                                    saveAddressDataToServer(AppConstants.DOCUMENT_TYPE_UTILITY_BILL);
                                }
                            }
                        }
                    }
                }
                break;
            case ADDRESS_TYPE_PASSPORT:
                String identityNumber = editTextidentityNumber.getText().toString();
                String expiryDate = editTextExpiryDate.getText().toString();
                String country = editTextCountry.getText().toString();

                if (identityNumber.length() <= 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please provide Passport number to proceed");
                } else {
                    if (expiryDate.length() <= 0) {
                        DialogsManager.showErrorDialog(this, "Error", "Please provide expiry date to proceed");
                    } else {
                        if (country.length() <= 0) {
                            DialogsManager.showErrorDialog(this, "Error", "Please provide Country to proceed");
                        } else {
                            if (uri1 == null) {
                                DialogsManager.showErrorDialog(this, "Error", "Please add front side of Passport");
                            } else {
                                if (uri2 == null) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please back side of Passport");
                                } else {
                                    AppManager.getInstance().passportModel = new PassportModel(identityNumber, expiryDate, country, uri1, uri2);
                                    AppManager.getInstance().addressModelV1 = new AddressModel(AppConstants.DOCUMENT_TYPE_PASSPORT);
                                    saveAddressDataToServer(AppConstants.DOCUMENT_TYPE_PASSPORT);
                                }
                            }
                        }

                    }
                }
                break;
            case ADDRESS_TYPE_DRIVING_LICENSE:
                String dlIdentityNumber = editTextidentityNumber.getText().toString();
                String dlExpiryDate = editTextExpiryDate.getText().toString();
                String dlCountry = editTextCountry.getText().toString();

                if (dlIdentityNumber.length() <= 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please provide Driving License number to proceed");
                } else {
                    if (dlExpiryDate.length() <= 0) {
                        DialogsManager.showErrorDialog(this, "Error", "Please provide expiry date to proceed");
                    } else {
                        if (dlCountry.length() <= 0) {
                            DialogsManager.showErrorDialog(this, "Error", "Please provide Country to proceed");
                        } else {
                            if (uri1 == null) {
                                DialogsManager.showErrorDialog(this, "Error", "Please add front side of Driving License");
                            } else {
                                if (uri2 == null) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please back side of Driving License");
                                } else {
                                    AppManager.getInstance().drivingLicenseModel = new DrivingLicenseModel(dlIdentityNumber, dlExpiryDate, dlCountry, uri1, uri2);
                                    AppManager.getInstance().addressModelV1 = new AddressModel(AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE);
                                    saveAddressDataToServer(AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE);
                                }
                            }
                        }
                    }
                }
                break;
        }

    }


    public void onImageClick(View view) {
        Snackbar snackbar = Snackbar.make(findViewById(R.id.address_view), "Please provide read file permission to pick image", Snackbar.LENGTH_LONG);
        if (checkForPermission()) {
            snackbar.dismiss();
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            switch (view.getId()) {
                case R.id.image1:
                    startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_1);
                    break;
                case R.id.image2:
                    startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_2);
                    break;
            }
        }
        else {
            snackbar.show();
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    private boolean checkForPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != 0) {
            Uri backUri = data.getData();
            try {
                //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), backUri);
                if (requestCode == PICK_IMAGE_1) {
                    uri1 = backUri;
                    image1.setImageURI(uri1);
                } else {
                    uri2 = backUri;
                    image2.setImageURI(uri2);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        addressType = i;
        switch (i) {
            case ADDRESS_TYPE_PASSPORT:
                utilityPanel.setVisibility(View.GONE);
                identityPanel.setVisibility(View.VISIBLE);
                editTextidentityNumber.setHint("Passport Number");

                if (AppManager.getInstance().passportModel != null) {
                    PassportModel passportModel = AppManager.getInstance().passportModel;

                    editTextidentityNumber.setText(passportModel.getNumber());
                    editTextCountry.setText(passportModel.getIssueCountry());
                    editTextExpiryDate.setText(passportModel.getExpiryDate());
                    image2.setImageURI(passportModel.getBackUri());
                    image1.setImageURI(passportModel.getFrontUri());

                    uri1 = passportModel.getFrontUri();
                    uri2 = passportModel.getBackUri();
                } else {
                    editTextidentityNumber.setText("");
                    editTextCountry.setText("");
                    editTextExpiryDate.setText("");
                    uri1 = null;
                    uri2 = null;

                    image1.setImageResource(R.drawable.image_placeholder);
                    image2.setImageResource(R.drawable.image_placeholder);
                }

                break;
            case ADDRESS_TYPE_DRIVING_LICENSE:
                utilityPanel.setVisibility(View.GONE);
                identityPanel.setVisibility(View.VISIBLE);
                editTextidentityNumber.setHint("Driving License Number");

                if (AppManager.getInstance().drivingLicenseModel != null) {
                    DrivingLicenseModel drivingLicenseModel = AppManager.getInstance().drivingLicenseModel;

                    editTextidentityNumber.setText(drivingLicenseModel.getNumber());
                    editTextCountry.setText(drivingLicenseModel.getIssueCountry());
                    editTextExpiryDate.setText(drivingLicenseModel.getExpiryDate());
                    image2.setImageURI(drivingLicenseModel.getBackUri());
                    image1.setImageURI(drivingLicenseModel.getFrontUri());

                    uri1 = drivingLicenseModel.getFrontUri();
                    uri2 = drivingLicenseModel.getBackUri();
                } else {
                    editTextidentityNumber.setText("");
                    editTextCountry.setText("");
                    editTextExpiryDate.setText("");
                    uri1 = null;
                    uri2 = null;

                    image1.setImageResource(R.drawable.image_placeholder);
                    image2.setImageResource(R.drawable.image_placeholder);
                }

                break;
            case ADDRESS_TYPE_UTILITY_BILL:
                utilityPanel.setVisibility(View.VISIBLE);
                identityPanel.setVisibility(View.GONE);

                if (AppManager.getInstance().utilityBillModel != null) {
                    UtilityBillModel utilityBillModel = AppManager.getInstance().utilityBillModel;

                    editTextType.setText(utilityBillModel.getType());
                    editTextNumber.setText(utilityBillModel.getNumber());
                    editTextAddress.setText(utilityBillModel.getAddress());
                    image1.setImageURI(utilityBillModel.getFrontUri());
                    image2.setImageURI(utilityBillModel.getBackUri());

                    uri1 = utilityBillModel.getFrontUri();
                    uri2 = utilityBillModel.getBackUri();
                } else {
                    editTextType.setText("");
                    editTextNumber.setText("");
                    editTextAddress.setText("");
                    uri1 = null;
                    uri2 = null;

                    image1.setImageResource(R.drawable.image_placeholder);
                    image2.setImageResource(R.drawable.image_placeholder);
                }

                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    public void onExpiryDateClick(View view) {
        DatePickerDialog datePickerDialog = new DatePickerDialog(this, date, myCalendar
                .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                myCalendar.get(Calendar.DAY_OF_MONTH));


        datePickerDialog.getDatePicker().setMinDate(minCalendar.getTimeInMillis());
        datePickerDialog.show();
    }

    public void onIssueCountryClick(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select your country");
        builder.setItems(countryNames, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                editTextCountry.setText(list.get(i).getName());
            }
        });
        builder.create().show();
    }

    private void getCountryData() {
        String data = loadJSONFromAsset();
        parseDataToList(data);
    }

    public String loadJSONFromAsset() {
        String json = null;
        try {
            InputStream is = this.getAssets().open("CountryList.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;
    }

    private void parseDataToList(String data) {
        list = new ArrayList<>();

        try {
            JSONArray object = new JSONArray(data);

            for (int i = 0; i < object.length(); i++) {
                JSONObject jsonObject = object.getJSONObject(i);
                CountryCodeModel model = new CountryCodeModel(jsonObject.getString("PhoneCode"), jsonObject.getString("Country"), "", "", true);
                list.add(model);
            }

            Log.d("size", "size");

            countryNames = new String[list.size()];

            for (int i = 0; i < list.size(); i++) {
                countryNames[i] = list.get(i).getName();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void onTypeClick(View view) {
        typeModels = AppManager.getInstance().utilityBillTypeModels;

        final String[] types = new String[typeModels.length];
        for (int i = 0; i < typeModels.length; i++) {
            types[i] = typeModels[i].getName();
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Choose Utility bill type");
        builder.setItems(types, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                editTextType.setText(types[i]);
                currentBillType = typeModels[i].getCode();
            }
        });
        builder.create().show();
    }

    private void saveAddressDataToServer(int addressType) {
        Map<String, String> params = new HashMap<>(5);
        String[] filePaths = new String[2];
        Uri[] uris = new Uri[2];

        params.put("step", "address");

        switch (addressType) {
            case AppConstants.DOCUMENT_TYPE_PASSPORT:
                params.put("substep", "passport");

                PassportModel model = AppManager.getInstance().passportModel;
                params.put("number", model.getNumber());
                params.put("expiry_date", model.getExpiryDate());
                params.put("country", model.getIssueCountry());
                params.put("document_type", "");

                filePaths[0] = AppUtil.getPath(this, model.getFrontUri());
                uris[0] = model.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, model.getBackUri());
                uris[1] = model.getBackUri();
                break;
            case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                params.put("substep", "license");

                DrivingLicenseModel licenseModel = AppManager.getInstance().drivingLicenseModel;
                params.put("number", licenseModel.getNumber());
                params.put("expiry_date", licenseModel.getExpiryDate());
                params.put("country", licenseModel.getIssueCountry());
                params.put("document_type", "");

                filePaths[0] = AppUtil.getPath(this, licenseModel.getFrontUri());
                uris[0] = licenseModel.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, licenseModel.getBackUri());
                uris[1] = licenseModel.getBackUri();
                break;
            case AppConstants.DOCUMENT_TYPE_UTILITY_BILL:
                params.put("substep", "taxation");

                UtilityBillModel billModel = AppManager.getInstance().utilityBillModel;
                params.put("number", billModel.getNumber());
                params.put("expiry_date", "");
                params.put("country", billModel.getAddress());
                params.put("document_type", billModel.getType());

                filePaths[0] = AppUtil.getPath(this, billModel.getFrontUri());
                uris[0] = billModel.getFrontUri();
                filePaths[1] = AppUtil.getPath(this, billModel.getBackUri());
                uris[1] = billModel.getBackUri();
                break;

        }

        String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
        String[] fileField = new String[]{"file[]", "file[]"};


        new MultiPartTaskUsingBitmap(this, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
                new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(AddressActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            Intent intent = new Intent(AddressActivity.this, OthersRegistrationActivity.class);
                            startActivity(intent);
                        }
                        else {
                            DialogsManager.showErrorDialog(AddressActivity.this, "Error", "Some error occurred. Please try after some time.");
                        }
                    }
                }).execute();
    }
}
