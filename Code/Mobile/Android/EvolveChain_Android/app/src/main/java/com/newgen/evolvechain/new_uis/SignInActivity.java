package com.newgen.evolvechain.new_uis;

import android.Manifest;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.text.Editable;
import android.text.InputFilter;
import android.text.TextWatcher;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.EditText;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.network_layer.GetTask;
import com.newgen.evolvechain.network_layer.PostTask;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.utils.PinText;
import com.newgen.evolvechain.utils.SharedPrefManager;
import com.newgen.evolvechain.utils.Utility;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

public class SignInActivity extends AppCompatActivity {

    private PinText pinText;
    private EditText idText;
    private TextView phoneCodeText;
    private CountryCodeModel[] countryCodeModels;
    String[] countries;
    double[] latlon;
    char[] phoneFormat;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        countryCodeModels = AppManager.getInstance().countryCodeModels;

        if (countryCodeModels != null) {
            initUi();
        } else {
            getCountryData();
        }

        Location location = getLastKnownLocation();
        if (location != null) {
            latlon = new double[]{location.getLatitude(), location.getLongitude()};
        }

    }

    private Location getLastKnownLocation() {
        LocationManager mLocationManager = (LocationManager) getApplicationContext().getSystemService(LOCATION_SERVICE);
        assert mLocationManager != null;
        List<String> providers = mLocationManager.getProviders(true);
        Location bestLocation = null;
        for (String provider : providers) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                Location l = mLocationManager.getLastKnownLocation(provider);

                if (l == null) {
                    continue;
                }
                if (bestLocation == null || l.getAccuracy() < bestLocation.getAccuracy()) {
                    // Found best last known location: %s", l);
                    bestLocation = l;
                }
            }
        }

        return bestLocation;
    }

    @Override
    public void onResume() {
        super.onResume();
//
    }

    private void initUi() {
        pinText = findViewById(R.id.edit_text_pin);
        idText = findViewById(R.id.edit_text_kyc_id);
        phoneCodeText = findViewById(R.id.edit_text_phone_code);

        idText.requestFocus();
        Utility.openKeyBoard(this, idText);

        setIdTextWatcher();

        countries = new String[countryCodeModels.length];
        if (countries.length > 0) {
            phoneCodeText.setText(countryCodeModels[0].getPhoneCode());
            phoneFormat = countryCodeModels[0].getPhoneFormat().toCharArray();
            idText.setFilters(new InputFilter[]{new InputFilter.LengthFilter(phoneFormat.length)});
        }

        if (new SharedPrefManager(this).getISD().length() > 0) {
            for (CountryCodeModel countryCodeModel : countryCodeModels) {
                if (new SharedPrefManager(this).getISD().equals(countryCodeModel.getPhoneCode())) {
                    phoneCodeText.setText(countryCodeModel.getPhoneCode());
                    phoneFormat = countryCodeModel.getPhoneFormat().toCharArray();
                    idText.setFilters(new InputFilter[]{new InputFilter.LengthFilter(phoneFormat.length)});
                }
            }
        }

        if (AppManager.getInstance().isd != null && AppManager.getInstance().phone != null && AppManager.getInstance().isd.length() > 0 && AppManager.getInstance().phone.length() > 0) {
            idText.setText(AppManager.getInstance().phone);
            phoneCodeText.setText(AppManager.getInstance().isd);
            pinText.requestFocus();
            Utility.openKeyBoard(this, pinText);
        }

//        idText.setTransformationMethod(new KycIdTransformation());

        idText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                idText.setSelection(idText.getText().length());
            }
        });


        pinText.setOnPinEnteredListener(new PinText.OnPinEnteredListener() {
            @Override
            public void onPinEntered(CharSequence str) {
                if (str.length() == 6) {
                    onSignInClick(findViewById(R.id.sign_in_btn));
                }
            }
        });
    }

    private void setIdTextWatcher() {
        idText.addTextChangedListener(new TextWatcher() {
            boolean chnage = true;

            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (i2 == 0) {
                    chnage = false;
                } else {
                    chnage = true;
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {
                if (phoneFormat.length > editable.toString().length() && editable.length() > 1) {
                    if (chnage) {
                        if (phoneFormat[editable.toString().length()] == '-') {
                            editable.append('-');
                        }
                    } else {
                        if (editable.charAt(editable.length() - 1) == '-' && editable.length() > 1) {
                            editable.delete(editable.length()-2, editable.length());

                            String d = editable.toString();
                        }
                    }
                }
            }
        });
    }

    private void getCountryData() {
        String urlData = AppConstants.SERVER_ADDRESS + "web/getcountrylist";

        new GetTask(urlData, new WebConnectionListener() {
            ProgressDialog dialog;

            @Override
            public void onTaskStart() {
                dialog = ProgressDialog.show(SignInActivity.this, "", "Loading...");
            }

            @Override
            public void onTaskComplete(String result) {
                dialog.dismiss();
                parseCountries(result);
            }
        }).execute();
    }

    private void parseCountries(String result) {
        try {
            JSONArray object = new JSONArray(result);
            CountryCodeModel[] codeModels = new CountryCodeModel[object.length()];
            for (int i = 0; i < object.length(); i++) {
                JSONObject object1 = object.getJSONObject(i);

                //Saving age limit
                JSONObject ageObject = object1.getJSONObject("age_limit");
                String minAge = ageObject.getString("min");
                String maxAge = ageObject.getString("max");
                AppManager.getInstance().minAge = minAge;
                AppManager.getInstance().maxAge = maxAge;

                CountryCodeModel model = new CountryCodeModel(object1.getString("phone_code"), object1.getString("name"), object1.getString("iso"), object1.getString("phone_format"), object1.getBoolean("is_active"));
                codeModels[i] = model;

            }
            AppManager.getInstance().countryCodeModels = codeModels;
            countryCodeModels = codeModels;
            initUi();
        } catch (Exception e) {
            DialogsManager.showErrorDialog(this, "Error", "Some problem occurred, please try again after some time");
            e.printStackTrace();
        }
    }

    public void onGenerateClick(View view) {
        if (idText.getText().toString().length() > 0) {
            AppManager.getInstance().kycId = idText.getText().toString();
        }
        Intent intent = new Intent(this, GeneratePinActivity.class);
        startActivity(intent);
    }

    public void onSignInClick(View view) {

        Utility.hideKeyBoard(this, idText);

        final String pin = pinText.getText().toString();
        final String id = idText.getText().toString();

        if (id.length() <= 0) {
            DialogsManager.showErrorDialog(this, "Error", "Please Enter Contact number");
        } else {
            if (pin.length() <= 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please Enter Pin");
            } else {
                String url = AppConstants.SERVER_ADDRESS + AppConstants.METHOD_NAME + AppConstants.LOGIN;
                JSONObject object = new JSONObject();
                try {
                    object.put("mobile", id);
                    object.put("isd_code", phoneCodeText.getText().toString());
                    object.put("pin", Utility.md5(pin));
                    object.put("vendor_uuid", AppManager.getInstance().uuid);

                    if (latlon != null) {
                        object.put("latitude", latlon[0]);
                        object.put("longitude", latlon[1]);
                    }
                    TelephonyManager manager = (TelephonyManager) this.getSystemService(Context.TELEPHONY_SERVICE);
                    if (manager != null) {
                        object.put("network_provider", manager.getNetworkOperatorName());
                        object.put("iso_country_code", manager.getNetworkCountryIso());
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }

                new PostTask(object.toString(), url, new WebConnectionListener() {
                    ProgressDialog dialog;

                    @Override
                    public void onTaskStart() {
                        dialog = ProgressDialog.show(SignInActivity.this, "", "Loading...");
                    }

                    @Override
                    public void onTaskComplete(String result) {
                        dialog.dismiss();
                        boolean isSuccess = AppUtil.isSuccess(result);
                        if (isSuccess) {
                            UserBasicModel basicModel = AppUtil.getBasicModel(result);
                            saveKycId(result);
                            if (basicModel != null) {
                                AppManager.getInstance().basicModelAfterSignIn = basicModel;
                                AppManager.getInstance().isUserVerified = true;
                                Intent intent = new Intent(SignInActivity.this, UserProfileActivity.class);
                                startActivity(intent);
                            } else {
                                DialogsManager.showErrorDialogWithOkHandle(SignInActivity.this, "Error", "Some problem occurred", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        pinText.setText("");
                                        idText.setText("");
                                    }
                                });
                            }
                        } else {
                            handleErrorCodes(result, id);
                        }
                    }
                }).execute();
            }
        }
        //}
    }

    private void saveKycId(String result) {
        try {
            JSONObject object = new JSONObject(result);
            AppManager.getInstance().kycId = object.getString("kyc_id");
            SharedPrefManager prefManager = new SharedPrefManager(this);
            prefManager.saveContactNumber(object.getString("phone"), object.getString("country_code"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleErrorCodes(String result, String id) {
        try {
            JSONObject object = new JSONObject(result);
            String errorCode = object.getString("error_code");
            String errorMessage = object.getString("error");

            switch (errorCode) {
                case "E00":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E01":
                    AppManager.getInstance().kycId = id;
                    DialogsManager.showErrorDialogWithOkHandle(this, "Error", errorMessage, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            Intent intent = new Intent(SignInActivity.this, GeneratePinActivity.class);
                            startActivity(intent);
                        }
                    });
                    break;
                case "E02":
                    Animation shake = AnimationUtils.loadAnimation(this, R.anim.shake);
                    pinText.startAnimation(shake);
                    pinText.setText("");
                    break;
                case "E03":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E04":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E05":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E06":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E07":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E08":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E09":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E100":
                    DialogsManager.showErrorDialog(this, "Error", errorMessage);
                    break;
                case "E21":
                    DialogsManager.showErrorDialogWithOkHandle(this, "Error", errorMessage, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            Intent intent = new Intent(SignInActivity.this, EditActivity.class);
                            startActivity(intent);
                        }
                    });
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            DialogsManager.showErrorDialogWithOkHandle(SignInActivity.this, "Error", "Some problem occurred", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    pinText.setText("");
                    idText.setText("");
                }
            });
        }
    }

    public void onClearKycIdClick(View view) {
        idText.setText("");
    }

    public void onPhoneCodeClick(View view) {
        for (int i = 0; i < countries.length; i++) {
            countries[i] = countryCodeModels[i].getName();
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select country");
        builder.setItems(countries, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                phoneCodeText.setText(countryCodeModels[i].getPhoneCode());
                phoneFormat = countryCodeModels[i].getPhoneFormat().toCharArray();
                idText.setFilters(new InputFilter[]{new InputFilter.LengthFilter(phoneFormat.length)});
            }
        });

        builder.create().show();
    }

    @Override
    public void onBackPressed(){
        Intent a = new Intent(Intent.ACTION_MAIN);
        a.addCategory(Intent.CATEGORY_HOME);
        a.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(a);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                Intent intent = new Intent(this, SplashActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                break;
        }
        return true;
    }

    @Override
    public void onPause(){
        super.onPause();
        Utility.hideKeyBoard(this, pinText);
    }
}
