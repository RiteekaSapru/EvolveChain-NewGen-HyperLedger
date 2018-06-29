package com.newgen.evolvechain.utils;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

import com.newgen.evolvechain.DialogClickListener;

/**
 * Created by Admin on 5/21/2018.
 *
 */

public class DialogsManager {

    private static AlertDialog dialog;

    public static void showErrorDialog(Context context, String title, String message){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(title);
        builder.setMessage(message);
        builder.setNegativeButton("Ok", null);

        dialog = builder.create();
        dialog.show();
    }

    public static void showErrorDialogWithOkHandle(Context context, String title, String message, DialogInterface.OnClickListener listener){
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(title);
        builder.setMessage(message);
        builder.setNegativeButton("Ok", listener);

        dialog = builder.create();
        dialog.show();
    }

    public static void showDialogWithTwoOptions(Context context, String title, String message, String negString, String posString, DialogInterface.OnClickListener listener1, DialogInterface.OnClickListener listener2) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(title);
        builder.setMessage(message);
        builder.setNegativeButton(negString, listener1);
        builder.setPositiveButton(posString, listener2);

        dialog = builder.create();
        dialog.show();
    }

    public static void dismissErrorDialog() {
        dialog.dismiss();
    }

}
