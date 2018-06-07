package com.newgen.evolvechain.utils;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

import com.newgen.evolvechain.models.CountryCodeModel;
import com.newgen.evolvechain.models.UserBasicModel;
import com.newgen.evolvechain.models.documnets.UtilityBillTypeModel;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Objects;

/**
 * Created by onkar.gupta on 5/29/2018.
 *
 */

public class AppUtil {

    public static void clearCache() {
        AppManager.getInstance().basicModel = null;
        AppManager.getInstance().addressModelV1.setType(-1);
        AppManager.getInstance().identityModelV1.setType(-1);
        AppManager.getInstance().passportModel = null;
        AppManager.getInstance().taxationModel = null;
        AppManager.getInstance().drivingLicenseModel = null;
        AppManager.getInstance().utilityBillModel = null;
        AppManager.getInstance().birthDateString = "";
    }

    public static String getPath(Context context, Uri uri) {
        String result = "";
        String[] projection = {MediaStore.Images.Media.DATA};
        try {
            Cursor cursor = context.getContentResolver().query(uri, projection, null, null, null);
            if (cursor == null) {
                result = uri.getPath();
            } else {
                cursor.moveToFirst();
                int idx = cursor.getColumnIndex(MediaStore.Images.Media.DATA);
                result = cursor.getString(idx);
                cursor.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public static boolean isSuccess(String result) {
        boolean success = false;
        try {
            JSONObject object = new JSONObject(result);
            int successCode = object.getInt("success");
            switch (successCode) {
                case 0:
                    success = false;
                    break;
                case 1:
                    success = true;
                    break;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            success = false;
        }

        return success;
    }

    public static String checkNullValue(String string) {
        if (string == null || Objects.equals(string, "null")){
            return "";
        }
        else {
            return string;
        }
    }

    public static boolean isNullValue(String s) {
        return s == null || s.equals("null");
    }

    public static String getError(String result) {
        String error = "";
        try {
            JSONObject object = new JSONObject(result);
            error = object.getString("error");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return error;
    }

    public static UserBasicModel getBasicModel(String result) {
        UserBasicModel userBasicModel = null;

        try {
            JSONObject object = new JSONObject(result);
            userBasicModel = new UserBasicModel(
                    object.getString("email"),
                    object.getString("phone"),
                    object.getString("country_code"),
                    object.getString("firstname"),
                    object.getString("middlename"),
                    object.getString("lastname"),
                    object.getString("dob"),
                    object.getString("place_of_birth"),
                    object.getString("address1"),
                    object.getString("address2"),
                    object.getString("address2"),
                    object.getString("city"),
                    object.getString("zip"),
                    object.getString("state"),
                    object.getString("country"),
                    Uri.parse(object.getString("profile_pic"))
            );

            AppManager.getInstance().loginToken = object.getString("appkey");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return userBasicModel;
    }

    public static void clearUserData(Context context) {
        AppManager.getInstance().pinMd5 = "";
        AppManager.getInstance().kycId = "";
        AppManager.getInstance().basicModelAfterSignIn = null;

        SharedPrefManager prefManager = new SharedPrefManager(context);
        prefManager.savePinMd5("");
        prefManager.saveKycId("");
        prefManager.saveUserData("");
    }

    public static boolean saveSignUpInitData(String result) {
        boolean isSuccess;
        try {
            JSONObject object = new JSONObject(result);

            //Saving key
            AppManager.getInstance().signUpInitKey = object.getString("key");

            JSONObject initConfigJson = object.getJSONObject("init_config");

            //Saving countries
            JSONArray countriesArray = initConfigJson.getJSONArray("COUNTRIES");
            saveCountries(countriesArray);

            //Saving age limit
            JSONObject ageObject = initConfigJson.getJSONObject("AGE_LIMIT");
            String minAge = ageObject.getString("MIN");
            String maxAge = ageObject.getString("MAX");
            AppManager.getInstance().minAge = minAge;
            AppManager.getInstance().maxAge = maxAge;

            //Saving DateFormat
            AppManager.getInstance().dateFormat = initConfigJson.getString("DATE_FORMAT");

            //Saving Utility Bill Type
            JSONArray billTypeObject = initConfigJson.getJSONArray("USA_UTILITY_BILL_TYPE");
            saveBillTypes(billTypeObject);


            isSuccess = true;
        }
        catch (Exception e) {
            isSuccess = false;
            e.printStackTrace();
        }

        return isSuccess;
    }

    private static void saveBillTypes(JSONArray billTypeObject) throws Exception{
        UtilityBillTypeModel[] billTypeModels = new UtilityBillTypeModel[billTypeObject.length()];

        for (int i = 0; i < billTypeModels.length; i++) {
            JSONObject object = billTypeObject.getJSONObject(i);
            UtilityBillTypeModel model = new UtilityBillTypeModel(object.getString("CODE"), object.getString("NAME"));
            billTypeModels[i] = model;
        }

        AppManager.getInstance().utilityBillTypeModels = billTypeModels;
    }

    private static void saveCountries(JSONArray countriesArray) throws Exception{
        CountryCodeModel[] codeModels = new CountryCodeModel[countriesArray.length()];

        for (int i = 0; i<countriesArray.length(); i++) {
            JSONObject object = countriesArray.getJSONObject(i);
            CountryCodeModel model = new CountryCodeModel(object.getString("PHONE_CODE"), object.getString("NAME"));
            codeModels[i] = model;
        }

        AppManager.getInstance().countryCodeModels = codeModels;
    }
}
