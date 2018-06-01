package com.newgen.evolvechain.utils;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
 */

public class AppConstants {

    public static final String SERVER_ADDRESS = "http://192.168.60.130:4600/";
    public static final String METHOD_NAME = "app/";
    public static final String KYC_METHOD_NAME = "kyc/";

    public static final String INITIALIZE = "initialize";

    public static final String GENERATE_EMAIL_OTP = "generateEmailOtp/";
    public static final String VERIFY_EMAIL = "verifyemail/";

    public static final String GENERATE_PHONE_OTP = "generateMobileOTP/";
    public static final String VERIFY_PHONE = "verifymobile/";

    public static final String SAVE_BASIC_INFO = "saveKycDocument/";
    public static final String SUBMIT_KYC_DOCUMENT = "SubmitKycDocument";

    public static final String LOGIN = "Login";

    public static final String GENERATE_PIN = "GeneratePin";

    public static final String SET_PIN = "SetPin";


    //SharedPref Constants
    static final String SHARED_PREF_NAME = "EvolveChain";
    static final String INIT_TOKEN_PREF_KEY = "InitToken";
    static final String UUID_KEY = "UUID_KEY";
    static final String USER_DATA_KEY = "user_data";
    static final String KYC_ID_KEY = "kyc_id";
    static final String PIN_KEY = "pin_md5";

    //
    public static final int VERIFICATION_TYPE_EMAIL = 0;
    public static final int VERIFICATION_TYPE_PHONE = 1;

    //Document Types
    public static final int DOCUMENT_TYPE_PASSPORT = 0;
    public static final int DOCUMENT_TYPE_DRIVING_LICENSE = 1;
    public static final int DOCUMENT_TYPE_TAXATION = 2;
    public static final int DOCUMENT_TYPE_UTILITY_BILL = 3;
}
