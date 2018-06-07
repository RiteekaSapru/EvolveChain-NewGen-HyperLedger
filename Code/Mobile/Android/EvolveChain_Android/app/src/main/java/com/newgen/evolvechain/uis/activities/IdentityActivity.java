package com.newgen.evolvechain.uis.activities;

import android.Manifest;
import android.app.DatePickerDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NavUtils;
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
import android.widget.Spinner;

import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;
import com.newgen.evolvechain.models.documnets.TaxationModel;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.DialogsManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public class IdentityActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private EditText editTextIdentityNumber, editTextExpiryDate, editTextIssueCountry;
    private ImageView frontImage, backImage;
    private Spinner spinner;

    private static final int PICK_IMAGE_BACK = 1;
    private static final int PICK_IMAGE_FRONT = 0;

    private static final int IDENTITY_TYPE_PASSPORT = 0;
    private static final int IDENTITY_TYPE_DRIVING_LICENSE = 1;
    private static final int IDENTITY_TYPE_TAXATION = 2;
    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 1;
    private int identityType = IDENTITY_TYPE_PASSPORT;

    private Uri frontUri, backUri;

    private List<String> options = new ArrayList<>();

    Calendar myCalendar = Calendar.getInstance();
    Calendar minCalendar = Calendar.getInstance();
    Calendar maxCalendar = Calendar.getInstance();
    DatePickerDialog.OnDateSetListener date;

    String[] countryNames;
    ArrayList<CountryCodeModel> list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_identity);

        options.add("Passport");
        options.add("Driving License");
        options.add("Taxation Id");

        getMinMaxDate();
        setUpDatePicker();
        getCountryData();
        initUis();

    }

    private void getMinMaxDate() {

        int minAge = Integer.parseInt(AppManager.getInstance().minAge);
        int maxAge = Integer.parseInt(AppManager.getInstance().maxAge);

        minCalendar.set(myCalendar.get(Calendar.YEAR) - maxAge, myCalendar.get(Calendar.MONTH), myCalendar.get(Calendar.DAY_OF_MONTH));

        maxCalendar.set(myCalendar.get(Calendar.YEAR) - minAge, myCalendar.get(Calendar.MONTH), myCalendar.get(Calendar.DAY_OF_MONTH));
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
        String myFormat = "yyyy-MM -dd"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        editTextExpiryDate.setText(sdf.format(myCalendar.getTime()));
    }

    private void initUis() {
        spinner = findViewById(R.id.spinner);
        spinner.setOnItemSelectedListener(this);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<>(this, R.layout.spinner_text_layout, options);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(dataAdapter);

        setSpinnerSelection();

        editTextIdentityNumber = findViewById(R.id.edit_text_identity_number);
        editTextIssueCountry = findViewById(R.id.edit_text_issue_country);
        editTextExpiryDate = findViewById(R.id.edit_text_expiry_date);

        frontImage = findViewById(R.id.front_image);
        backImage = findViewById(R.id.back_image);
    }

    private void setSpinnerSelection() {
        if (AppManager.getInstance().identityModelV1.getType() >= 0) {
            switch (AppManager.getInstance().identityModelV1.getType()) {
                case AppConstants.DOCUMENT_TYPE_PASSPORT:
                    spinner.setSelection(IDENTITY_TYPE_PASSPORT);
                    break;
                case AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE:
                    spinner.setSelection(IDENTITY_TYPE_DRIVING_LICENSE);
                    break;
                case AppConstants.DOCUMENT_TYPE_TAXATION:
                    spinner.setSelection(IDENTITY_TYPE_TAXATION);
                    break;
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != 0) {
            switch (requestCode) {
                case PICK_IMAGE_BACK:
                    backUri = data.getData();
                    try {
                        //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), backUri);
                        backImage.setImageURI(backUri);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    break;
                case PICK_IMAGE_FRONT:
                    frontUri = data.getData();
                    try {
                        //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), frontUri);
                        frontImage.setImageURI(frontUri);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    break;
            }
        }
    }

    @Override
    public void onBackPressed() {
        NavUtils.navigateUpFromSameTask(this);
    }

    public void onBackImageClick(View view) {
        Snackbar snackbar = Snackbar.make(findViewById(R.id.identity_view), "Please provide read file permission to pick image", Snackbar.LENGTH_LONG);
        if (checkForPermission()) {
            snackbar.dismiss();
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_BACK);
        }
        else {
            snackbar.show();
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    public void onFrontImageClick(View view) {
        Snackbar snackbar = Snackbar.make(findViewById(R.id.identity_view), "Please provide read file permission to pick image", Snackbar.LENGTH_LONG);
        if (checkForPermission()) {
            snackbar.dismiss();
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_FRONT);
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

    public void onExpiryDateClick(View view) {
        if (identityType == IDENTITY_TYPE_TAXATION) {
            DatePickerDialog datePickerDialog =  new DatePickerDialog(this, date, maxCalendar
                    .get(Calendar.YEAR), maxCalendar.get(Calendar.MONTH),
                    maxCalendar.get(Calendar.DAY_OF_MONTH));


            datePickerDialog.getDatePicker().setMaxDate(maxCalendar.getTimeInMillis());
            datePickerDialog.getDatePicker().setMinDate(minCalendar.getTimeInMillis());
            datePickerDialog.show();
        }
        else {
            DatePickerDialog datePickerDialog = new DatePickerDialog(this, date, myCalendar
                    .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                    myCalendar.get(Calendar.DAY_OF_MONTH));


            datePickerDialog.getDatePicker().setMinDate(myCalendar.getTimeInMillis());
            datePickerDialog.show();
        }
    }

    public void onSaveClick(View view) {
        String identityNumber = editTextIdentityNumber.getText().toString();
        String expiryDate = editTextExpiryDate.getText().toString();
        String issueCountry = editTextIssueCountry.getText().toString();

        switch (identityType) {
            case IDENTITY_TYPE_PASSPORT:
                if (frontUri == null) {
                    DialogsManager.showErrorDialog(this, "Error", "Please add front side image");
                } else {
                    if (backUri == null) {
                        DialogsManager.showErrorDialog(this, "Error", "Please add back side image");
                    } else {
                        if (identityNumber.length() <= 0) {
                            DialogsManager.showErrorDialog(this, "Error", "Please enter Passport number");
                            editTextIdentityNumber.requestFocus();
                        } else {
                            if (expiryDate.length() <= 0) {
                                DialogsManager.showErrorDialog(this, "Error", "Please enter expiry date");
                                editTextExpiryDate.requestFocus();
                            } else {
                                if (issueCountry.length() <= 0) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please enter issue country");
                                    editTextIssueCountry.requestFocus();
                                } else {
                                    AppManager.getInstance().passportModel = new PassportModel(identityNumber, expiryDate, issueCountry, frontUri, backUri);
                                    AppManager.getInstance().identityModelV1.setType(AppConstants.DOCUMENT_TYPE_PASSPORT);
                                    //saveDataToServer(AppConstants.DOCUMENT_TYPE_PASSPORT);
                                    Intent intent = new Intent(this, OthersRegistrationActivity.class);
                                    startActivity(intent);
                                }
                            }
                        }
                    }
                }
                break;
            case IDENTITY_TYPE_DRIVING_LICENSE:
                if (frontUri == null) {
                    DialogsManager.showErrorDialog(this, "Error", "Please add front side image");
                } else {
                    if (backUri == null) {
                        DialogsManager.showErrorDialog(this, "Error", "Please add back side image");
                    } else {
                        if (identityNumber.length() <= 0) {
                            DialogsManager.showErrorDialog(this, "Error", "Please enter Driving License number");
                        } else {
                            if (expiryDate.length() <= 0) {
                                DialogsManager.showErrorDialog(this, "Error", "Please enter expiry date");
                            } else {
                                if (issueCountry.length() <= 0) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please enter issue country");
                                } else {
                                    AppManager.getInstance().drivingLicenseModel = new DrivingLicenseModel(identityNumber, expiryDate, issueCountry, frontUri, backUri);
                                    AppManager.getInstance().identityModelV1.setType(AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE);
                                    //saveDataToServer(AppConstants.DOCUMENT_TYPE_DRIVING_LICENSE);
                                    Intent intent = new Intent(this, OthersRegistrationActivity.class);
                                    startActivity(intent);
                                }
                            }
                        }
                    }
                }
                break;
            case IDENTITY_TYPE_TAXATION:
                if (frontUri == null) {
                    DialogsManager.showErrorDialog(this, "Error", "Please add front side image");
                } else {
                    if (backUri == null) {
                        DialogsManager.showErrorDialog(this, "Error", "Please add back side image");
                    } else {
                        if (identityNumber.length() <= 8) {
                            DialogsManager.showErrorDialog(this, "Error", "Please enter valid Taxation number");
                        } else {
                            if (expiryDate.length() <= 0) {
                                DialogsManager.showErrorDialog(this, "Error", "Please enter Birth date");
                            } else {
                                if (issueCountry.length() <= 0) {
                                    DialogsManager.showErrorDialog(this, "Error", "Please enter issue country");
                                } else {
                                    AppManager.getInstance().taxationModel = new TaxationModel(identityNumber, expiryDate, issueCountry, frontUri, backUri);
                                    AppManager.getInstance().identityModelV1.setType(AppConstants.DOCUMENT_TYPE_TAXATION);
                                    AppManager.getInstance().birthDateString = expiryDate;
                                    if (AppManager.getInstance().basicModel != null) {
                                        AppManager.getInstance().basicModel.setDob(expiryDate);
                                    }
                                    //saveDataToServer(AppConstants.DOCUMENT_TYPE_TAXATION);
                                    Intent intent = new Intent(this, OthersRegistrationActivity.class);
                                    startActivity(intent);
                                }
                            }
                        }
                    }
                }
                break;
        }
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        identityType = i;
        AppManager.getInstance().identityModel.setType(i);
        switch (i) {
            case 0:
                editTextIdentityNumber.setHint("Passport Number");
                editTextExpiryDate.setHint("Date of Expiry");

                if (AppManager.getInstance().passportModel != null) {
                    PassportModel passportModel = AppManager.getInstance().passportModel;
                    editTextIdentityNumber.setText(passportModel.getNumber());
                    editTextIssueCountry.setText(passportModel.getIssueCountry());
                    editTextExpiryDate.setText(passportModel.getExpiryDate());

                    frontImage.setImageURI(passportModel.getFrontUri());
                    backImage.setImageURI(passportModel.getBackUri());

                    frontUri = passportModel.getFrontUri();
                    backUri = passportModel.getBackUri();
                } else {
                    editTextIdentityNumber.setText("");
                    editTextExpiryDate.setText("");
                    editTextIssueCountry.setText("");
                    frontUri = null;
                    backUri = null;

                    frontImage.setImageResource(R.drawable.image_placeholder);
                    backImage.setImageResource(R.drawable.image_placeholder);
                }
                break;
            case 1:
                editTextIdentityNumber.setHint("Driving License Number");
                editTextExpiryDate.setHint("Date of Expiry");

                if (AppManager.getInstance().drivingLicenseModel != null) {
                    DrivingLicenseModel drivingLicenseModel = AppManager.getInstance().drivingLicenseModel;
                    editTextIdentityNumber.setText(drivingLicenseModel.getNumber());
                    editTextIssueCountry.setText(drivingLicenseModel.getIssueCountry());
                    editTextExpiryDate.setText(drivingLicenseModel.getExpiryDate());

                    frontImage.setImageURI(drivingLicenseModel.getFrontUri());
                    backImage.setImageURI(drivingLicenseModel.getBackUri());

                    frontUri = drivingLicenseModel.getFrontUri();
                    backUri = drivingLicenseModel.getBackUri();
                } else {
                    editTextIdentityNumber.setText("");
                    editTextExpiryDate.setText("");
                    editTextIssueCountry.setText("");
                    frontUri = null;
                    backUri = null;

                    frontImage.setImageResource(R.drawable.image_placeholder);
                    backImage.setImageResource(R.drawable.image_placeholder);
                }
                break;
            case 2:
                editTextIdentityNumber.setHint("Taxation Number");
                editTextExpiryDate.setHint("Date of birth");

                if (AppManager.getInstance().taxationModel != null) {
                    if (AppManager.getInstance().birthDateString.length() > 0) {
                        editTextExpiryDate.setText(AppManager.getInstance().birthDateString);
                        AppManager.getInstance().taxationModel.setDob(AppManager.getInstance().birthDateString);
                    }

                    TaxationModel taxationModel = AppManager.getInstance().taxationModel;
                    editTextIdentityNumber.setText(taxationModel.getNumber());
                    editTextIssueCountry.setText(taxationModel.getCountry());
                    editTextExpiryDate.setText(taxationModel.getDob());

                    frontImage.setImageURI(taxationModel.getFrontUri());
                    backImage.setImageURI(taxationModel.getBackUri());

                    frontUri = taxationModel.getFrontUri();
                    backUri = taxationModel.getBackUri();
                } else {
                    editTextIdentityNumber.setText("");
                    editTextExpiryDate.setText("");
                    editTextIssueCountry.setText("");
                    if (AppManager.getInstance().birthDateString.length() > 0) {
                        editTextExpiryDate.setText(AppManager.getInstance().birthDateString);
                    }
                    frontUri = null;
                    backUri = null;

                    frontImage.setImageResource(R.drawable.image_placeholder);
                    backImage.setImageResource(R.drawable.image_placeholder);
                }
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    public void onIssueCountryClick(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select your country");
        builder.setItems(countryNames, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                editTextIssueCountry.setText(list.get(i).getName());
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
                CountryCodeModel model = new CountryCodeModel(jsonObject.getString("PhoneCode"), jsonObject.getString("Country"));
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
}
