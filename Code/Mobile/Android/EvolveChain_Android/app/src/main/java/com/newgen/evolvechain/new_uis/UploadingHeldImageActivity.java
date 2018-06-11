package com.newgen.evolvechain.new_uis;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.HoldingDocumentModel;
import com.newgen.evolvechain.network_layer.MultiPartTaskUsingBitmap;
import com.newgen.evolvechain.network_layer.WebConnectionListener;
import com.newgen.evolvechain.utils.AppConstants;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.AppUtil;
import com.newgen.evolvechain.utils.DialogsManager;

import java.util.HashMap;
import java.util.Map;

public class UploadingHeldImageActivity extends AppCompatActivity {
    private static final int PICK_IMAGE = 0;
    private static final int MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE = 1;

    private Uri uri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_uploading_holded_image);

        ((TextView) findViewById(R.id.code_text)).setText("Code: 9909");
    }

    public void onInfoClick(View view) {
        DialogsManager.showErrorDialog(this, "Instructions", getString(R.string.selfie_instructions));
    }

    public void onImageClick(View view) {
        Snackbar snackbar = Snackbar.make(findViewById(R.id.base_view), "Please provide read file permission to pick image", Snackbar.LENGTH_LONG);
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            snackbar.dismiss();
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);

        } else {
            snackbar.show();
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    MY_PERMISSIONS_REQUEST_READ_EXTERNAL_STORAGE);
        }
    }

    public void onSaveClick(View view) {
        if (uri == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please select image");
        } else {
            Map<String, String> params = new HashMap<>(1);
            params.put("step", "face");
            params.put("substep", "face");
            //TODO: Change value
            params.put("number", "9990");

            String urlToSave = AppConstants.SERVER_ADDRESS + AppConstants.KYC_METHOD_NAME + AppConstants.SAVE_BASIC_INFO + AppManager.getInstance().initToken;
            String[] fileField = new String[]{"file[]"};
            String[] filePaths = new String[]{AppUtil.getPath(this, uri)};
            final Uri[] uris = new Uri[]{uri};


            new MultiPartTaskUsingBitmap(this, uris, urlToSave, params, filePaths, fileField, "image/jpeg",
                    new WebConnectionListener() {
                        ProgressDialog dialog;

                        @Override
                        public void onTaskStart() {
                            dialog = ProgressDialog.show(UploadingHeldImageActivity.this, "", "Loading...");
                        }

                        @Override
                        public void onTaskComplete(String result) {
                            dialog.dismiss();
                            boolean isSuccess = AppUtil.isSuccess(result);
                            if (isSuccess) {
                                AppManager.getInstance().holdingDocumentModel = new HoldingDocumentModel("9990", uri);
                                finish();
                            } else {
                                DialogsManager.showErrorDialog(UploadingHeldImageActivity.this, "Error", "Some error occurred. Please try after some time.");
                            }
                        }
                    }).execute();
        }
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != 0) {
            Uri tempUri = data.getData();
            try {
                //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), backUri);
                if (requestCode == PICK_IMAGE) {
                    uri = tempUri;
                    ((ImageView) findViewById(R.id.image)).setImageURI(uri);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
