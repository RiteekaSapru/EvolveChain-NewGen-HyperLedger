package com.newgen.evolvechain;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
 */

public class AppConstants {

    public static final String SERVER_ADDRESS = "http://192.168.60.130:4600/";
    public static final String METHOD_NAME = "app/";

    public static final String INITIALIZE = "initialize";

    public static final String GENERATE_EMAIL_OTP = "generateEmailOtp/";
    public static final String VERIFY_EMAIL = "verifyemail/";

    public static final String GENERATE_PHONE_OTP = "generateMobileOTP/";
    public static final String VERIFY_PHONE = "verifymobile/";


    //SharedPref Constants
    public static final String SHARED_PREF_NAME = "EvolveChain";
    public static final String INIT_TOKEN_PREF_KEY = "InitToken";

    //
    public static final int VERIFICATION_TYPE_EMAIL = 0;
    public static final int VERIFICATION_TYPE_PHONE = 1;

}
