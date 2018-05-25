package com.newgen.evolvechain.utils;
import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.provider.Settings;
import android.support.design.widget.Snackbar;
import android.support.v4.view.ViewCompat;
import android.support.v4.view.ViewPropertyAnimatorListener;
import android.support.v4.view.animation.LinearOutSlowInInterpolator;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.animation.BounceInterpolator;
import android.view.inputmethod.InputMethodManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.newgen.evolvechain.R;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.security.MessageDigest;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static android.provider.Settings.Global.AIRPLANE_MODE_ON;

public class Utility {

    public static boolean isInternetAvailable(Context context) {
        ConnectivityManager conMan = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = conMan.getActiveNetworkInfo();
        if (netInfo != null) {
            return true;
        }
        Toast.makeText(context, "Internet connection unavailable..",
                Toast.LENGTH_SHORT).show();
        return false;
    }

    @SuppressLint("SimpleDateFormat")
    public static String getFormatedDate(String dateString,
                                         String formatSource, String formatDestination) {
        SimpleDateFormat sdf = new SimpleDateFormat(formatSource);// "yyyy-MM-dd'T'HH:mm:ssz"
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        try {
            Date date = sdf.parse(dateString);
//            String formated = new SimpleDateFormat(formatDestination)
//                    .format(date);

            SimpleDateFormat sdfDestination = new SimpleDateFormat(formatDestination);
            sdfDestination.setTimeZone(TimeZone.getDefault());
            String formated = sdfDestination.format(date);

            return formated;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    @SuppressLint("SimpleDateFormat")
    public static String getFormatedDateFromMillis(String millis, String formatDestination) {

        DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        formatter.setTimeZone(TimeZone.getTimeZone("GMT"));
        long milliSeconds = Long.parseLong(millis);
        System.out.println(milliSeconds);

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(milliSeconds);
//        System.out.println(formatter.format(calendar.getTime()));
        try {
            Date date = calendar.getTime();
//            date=formatter.format(calendar.getTime());
//            Date date = new Date(millis);
//            String formated = new SimpleDateFormat(formatDestination)
//                    .format(date);

            SimpleDateFormat sdfDestination = new SimpleDateFormat(formatDestination);
            sdfDestination.setTimeZone(TimeZone.getDefault());
            String formated = sdfDestination.format(date);

            return formated;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public static String md5(String toEncrypt) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("md5");
            digest.update(toEncrypt.getBytes());
            final byte[] bytes = digest.digest();
            final StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                sb.append(String.format("%02X", bytes[i]));
            }
            return sb.toString().toLowerCase();
        } catch (Exception exc) {
            return "";
        }
    }

    public static void snackBarLong(View v, String msg) {
        Snackbar snackbar = Snackbar.make(v, msg, Snackbar.LENGTH_LONG);
        View sbView = snackbar.getView();
        TextView textView = sbView
                .findViewById(android.support.design.R.id.snackbar_text);
        textView.setTextColor(Color.WHITE);
        textView.setMaxLines(4);
        sbView.setBackgroundColor(Color.parseColor("#096C3D"));
        snackbar.show();
    }

    public static void toast(Context context, String msg) {
        Toast.makeText(context, msg, Toast.LENGTH_SHORT).show();
    }

    public static void snackBarLong(View v, String msg, int color) {
        Snackbar snackbar = Snackbar.make(v, msg, Snackbar.LENGTH_LONG);
        View sbView = snackbar.getView();
        TextView textView = sbView
                .findViewById(android.support.design.R.id.snackbar_text);
        textView.setTextColor(Color.WHITE);
        textView.setMaxLines(4);
        sbView.setBackgroundColor(color);
        snackbar.show();
    }

    public static void showSnackBar(View view, String message) {

        final Snackbar snackbar = Snackbar.make(view, message,
                Snackbar.LENGTH_LONG);
        snackbar.setAction("hide", new OnClickListener() {

            @Override
            public void onClick(View v) {
                snackbar.dismiss();
            }
        });
        if (view instanceof FrameLayout) {
            View snackbarView = snackbar.getView();
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) snackbarView
                    .getLayoutParams();
            params.gravity = Gravity.BOTTOM;
            snackbarView.setLayoutParams(params);
        }
        ((TextView) snackbar.getView().findViewById(
                android.support.design.R.id.snackbar_text))
                .setTextColor(Color.WHITE);

        snackbar.setActionTextColor(Color.WHITE);
        snackbar.show();
    }

    public static void startActivity(Context activity, Class activity1) {
        Intent intent = new Intent(activity, activity1);
        activity.startActivity(intent);
    }

    public static void openKeyBoard(Context mContext, View root) {
        ((InputMethodManager) mContext.getSystemService(Context.INPUT_METHOD_SERVICE))
                .toggleSoftInput(InputMethodManager.SHOW_FORCED, InputMethodManager.HIDE_IMPLICIT_ONLY)
        ;

    }

    public static void hideKeyBoard(Context mContext, View root) {
        ((InputMethodManager) mContext.getSystemService(Context.INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(root.getWindowToken(), 0);

    }

    //    public static void animShark(final Context context, final View v) {
////        new Handler().postDelayed(new Runnable() {
////            @Override
////            public void run() {
//        Animation animationShake = AnimationUtils.loadAnimation(context,
//                R.anim.shake);
//        v.startAnimation(animationShake);
////            }
////        },500);
//
//    }
//
//
    public static void shareApp(Context context) {
        try {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("text/plain");
            i.putExtra(Intent.EXTRA_SUBJECT, context.getString(R.string.app_name));
            String sAux = "\nLet me recommend you this application\n\n";
            sAux = sAux + "https://play.google.com/store/apps/details?id=" + context.getPackageName() + "\n\n";
            i.putExtra(Intent.EXTRA_TEXT, sAux);
            context.startActivity(Intent.createChooser(i, "choose one"));
        } catch (Exception e) {
            //e.toString();
        }

    }


//    public static void showLoadingDialog(Context mContext) {
//        dialog = new Dialog(mContext);
//        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
//        dialog.setContentView(R.layout.dialog_loading);
//        dialog.getWindow().setBackgroundDrawable(
//                new ColorDrawable(Color.TRANSPARENT));
//        dialog.setCancelable(false);
//        dialog.show();
//    }
//
//    public static void dismissLoadingDialog() {
//
//        if (dialog != null)
//            dialog.dismiss();
//    }

    public static void rateThisAPP(Context context) {
        Uri uri = Uri.parse("market://details?id=" + context.getPackageName());
        Intent goToMarket = new Intent(Intent.ACTION_VIEW, uri);
        goToMarket.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY
                | Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET
                | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
        try {
            context.startActivity(goToMarket);
        } catch (ActivityNotFoundException e) {
            context.startActivity(new Intent(Intent.ACTION_VIEW,
                    Uri.parse("http://play.google.com/store/apps/details?id="
                            + context.getPackageName())));
        }
    }

    public static void log(String log) {
        Log.d("TAG", log);
    }

    public static void openGoogleMap(Context context, double sLat, double sLng, String dLat, String dLng) {
//        String uri = String.format(Locale.ENGLISH, "geo:%f,%f", Double.parseDouble(lat), Double.parseDouble(lng));
//        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
//        context.startActivity(intent);

        String uri = String.format(Locale.ENGLISH, "http://maps.google.com/maps?saddr=%f,%f&daddr=%f,%f", sLat, sLng, Double.parseDouble(dLat), Double.parseDouble(dLng));
        Utility.log("MAP URL  " + uri);
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
        context.startActivity(intent);
    }

    public static void loadImage(String imageURL, ImageView imageview) {
        imageview.setImageURI(null);
        imageview.setImageURI(Uri.parse(imageURL));
    }

    public static boolean isValidEmail(CharSequence target) {
        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(target);
        return matcher.matches();

//        return !TextUtils.isEmpty(target) && android.util.Patterns.EMAIL_ADDRESS.matcher(target).matches();
    }

    public static boolean isValidPassword(CharSequence passwrod) {
        return passwrod.toString().trim().length() >= 6;
    }

    public static boolean isValidMobile(CharSequence phone) {
        if (TextUtils.isEmpty(phone)) {
            return false;
        } else {
            return android.util.Patterns.PHONE.matcher(phone).matches();
        }
    }

//    public static boolean isValidMobile(CharSequence mobile) {
//        if (mobile.toString().trim().length() < 6 || mobile.toString().trim().length() > 20)
//            return false;
//        return true;
//    }

    public static void callOnPhoneClick(Context mContext, String phoneNumber) {
        Intent i = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phoneNumber));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mContext.startActivity(i);
    }

    public static void animateButton(View itemView, final AnimationListener listener) {
//        ViewCompat.setScaleX(itemView, 0.80f);
//        ViewCompat.setScaleY(itemView, 0.80f);

        ViewCompat.animate(itemView).scaleX(0.80f).scaleY(0.80f).setDuration(50).setInterpolator(null).setListener(new ViewPropertyAnimatorListener() {
            @Override
            public void onAnimationStart(View view) {
                view.setEnabled(false);
            }

            @Override
            public void onAnimationEnd(View view) {
                ViewCompat.animate(view)
                        .scaleX(1)
                        .scaleY(1)
                        .setDuration(200)
                        .setInterpolator(new BounceInterpolator())
                        .setListener(new ViewPropertyAnimatorListener() {
                            @Override
                            public void onAnimationStart(View view) {

                            }

                            @Override
                            public void onAnimationEnd(View view) {
                                if (listener != null)
                                    listener.onAnimationEnd();
                                view.setEnabled(true);
                            }

                            @Override
                            public void onAnimationCancel(View view) {
                                view.setEnabled(true);
                            }
                        })
                        .start();
            }

            @Override
            public void onAnimationCancel(View view) {
                view.setEnabled(true);
            }
        }).start();
    }

    public static void animateScaleView(View itemView, final AnimationListener listener) {

        ViewCompat.animate(itemView).scaleX(0.5f).scaleY(0.5f).setDuration(50).setStartDelay(100).setInterpolator(null).setListener(new ViewPropertyAnimatorListener() {
            @Override
            public void onAnimationStart(View view) {
                view.setEnabled(false);
            }

            @Override
            public void onAnimationEnd(View view) {
                ViewCompat.animate(view)
                        .scaleX(1)
                        .scaleY(1)
                        .setDuration(200)
                        .setInterpolator(new LinearOutSlowInInterpolator())
                        .setListener(new ViewPropertyAnimatorListener() {
                            @Override
                            public void onAnimationStart(View view) {

                            }

                            @Override
                            public void onAnimationEnd(View view) {
                                if (listener != null)
                                    listener.onAnimationEnd();
                                view.setEnabled(true);
                            }

                            @Override
                            public void onAnimationCancel(View view) {
                                view.setEnabled(true);
                            }
                        })
                        .start();
            }

            @Override
            public void onAnimationCancel(View view) {
                view.setEnabled(true);
            }
        }).start();
    }

    public static boolean isAirplaneModeOn(Context context) {
        ContentResolver contentResolver = context.getContentResolver();
        return Settings.System.getInt(contentResolver, AIRPLANE_MODE_ON, 0) != 0;
    }


    public static void openURL(Context context, String url) {
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setData(Uri.parse(url));
        context.startActivity(i);
    }

    public static String getFormatedFloatVal(Double f) {
        BigDecimal num = new BigDecimal(f);
        DecimalFormat decimalFormat = new DecimalFormat("#.########");
        return decimalFormat.format(num);
    }

    public static String loadJSONFromAsset(Context context) {
        String json = null;
        try {
            InputStream is = context.getAssets().open("CountryList.json");
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

    public static String getIPAddress(boolean useIPv4) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        String sAddr = addr.getHostAddress();
                        //boolean isIPv4 = InetAddressUtils.isIPv4Address(sAddr);
                        boolean isIPv4 = sAddr.indexOf(':') < 0;

                        if (useIPv4) {
                            if (isIPv4)
                                return sAddr;
                        } else {
                            if (!isIPv4) {
                                int delim = sAddr.indexOf('%'); // drop ip6 zone suffix
                                return delim < 0 ? sAddr.toUpperCase() : sAddr.substring(0, delim).toUpperCase();
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) {
        } // for now eat exceptions
        return "";
    }

    public static  String getDateFromTimeStamp(long time, String formatDestination) {

        Date date = new Date(time*1000); // *1000 is to convert seconds to milliseconds
        SimpleDateFormat sdf = new SimpleDateFormat(formatDestination); // the format of your date
//        sdf.setTimeZone(TimeZone.getTimeZone("GMT-4"));

        return sdf.format(date);

    }

    private String changeDateFormat(String date, String oldFormat, String newFormat) {

        String formatedDate = "";
        SimpleDateFormat dateFormat = new SimpleDateFormat(oldFormat);
        Date myDate = null;
        try {
            myDate = dateFormat.parse(date);
        } catch (java.text.ParseException e) {
            e.printStackTrace();
        }

        SimpleDateFormat timeFormat = new SimpleDateFormat(newFormat);
        formatedDate = timeFormat.format(myDate);


        return formatedDate;

    }

    public interface AnimationListener {
        void onAnimationEnd();
    }

}
