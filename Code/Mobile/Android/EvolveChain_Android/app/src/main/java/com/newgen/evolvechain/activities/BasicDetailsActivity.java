package com.newgen.evolvechain.activities;

import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.newgen.evolvechain.AppManager;
import com.newgen.evolvechain.R;

public class BasicDetailsActivity extends AppCompatActivity {

    private ImageView userImage;
    private static final int PICK_IMAGE = 1;
    private Button emailButton, phoneButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_basic_details);
        initUi();
    }

    @Override
    protected void onResume(){
        super.onResume();
        if (AppManager.getInstance().basicModel.getContactNumber() != null) {
            phoneButton.setText(AppManager.getInstance().basicModel.getContactNumber());
        }
        if (AppManager.getInstance().basicModel.getEmail() != null) {
            emailButton.setText(AppManager.getInstance().basicModel.getEmail());
        }
    }

    private void initUi() {
        userImage = findViewById(R.id.image);
        emailButton = findViewById(R.id.button_email);
        phoneButton = findViewById(R.id.button_phone);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if (requestCode == PICK_IMAGE) {
            Uri selectedImage = data.getData();
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), selectedImage);
                userImage.setImageBitmap(bitmap);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onBackPressed(){
        NavUtils.navigateUpFromSameTask(this);
    }

    public void onAddImageClick(View view) {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);
    }

    public void onAddEmailClick(View view) {
        Intent intent = new Intent(this, EmailActivity.class);
        startActivity(intent);
    }

    public void onAddPhoneClick(View view) {
        Intent intent = new Intent(this, PhoneActivity.class);
        startActivity(intent);
    }
}
