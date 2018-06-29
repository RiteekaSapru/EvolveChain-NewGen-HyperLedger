package com.newgen.evolvechain.network_layer;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import android.widget.ImageView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by onkar.gupta on 6/8/2018.
 *
 */

public class DownloadAndSaveImageTask {

    private Context context;

    public DownloadAndSaveImageTask(Context context) {
        this.context = context;
    }

    public void saveImageToExternal(String imgName, Bitmap bm, final ImageSaverListener listener) {
        try{
            File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES + "EvolveChain");
            path.mkdirs();
            File imageFile = new File(path, imgName+".png");
            FileOutputStream out = new FileOutputStream(imageFile);
            bm.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
            MediaScannerConnection.scanFile(context,new String[] { imageFile.getAbsolutePath() }, null,new MediaScannerConnection.OnScanCompletedListener() {
                public void onScanCompleted(String path, Uri uri) {
                    Log.i("ExternalStorage", "Scanned " + path + ":");
                    Log.i("ExternalStorage", "-> uri=" + uri);
                    listener.imageSaved(uri);
                }
            });
        } catch(Exception e) {
            listener.failed();
            e.printStackTrace();
        }
    }
}
