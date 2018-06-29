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
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by onkar.gupta on 6/8/2018.
 *
 */

public class ImageLoaderWithoutViewTask extends AsyncTask<Void, Void, Uri[]> {

    private String[] url;
    private ImageLoaderListener listener;
    private Context context;

    public ImageLoaderWithoutViewTask(Context context, String url[], ImageLoaderListener listener) {
        this.url = url;
        this.context = context;
        this.listener = listener;
    }

    @Override
    protected void onPreExecute(){
        listener.onTaskStart();
    }

    @Override
    protected Uri[] doInBackground(Void... voids) {
        final Uri[] uris = new Uri[url.length];
        try {
            for (int i = 0; i < url.length; i++) {
                final int tempI = i;
                URL urlConnection = new URL(url[i]);
                HttpURLConnection connection = (HttpURLConnection) urlConnection
                        .openConnection();
                connection.setDoInput(true);
                connection.connect();
                InputStream input = connection.getInputStream();
                Bitmap bitmap = BitmapFactory.decodeStream(input);

                File path = new File(context.getExternalFilesDir(
                        Environment.DIRECTORY_PICTURES), "EC");
                path.mkdirs();
                File imageFile = new File(path, "basic" + tempI +".jpg");
                FileOutputStream out = new FileOutputStream(imageFile);
                bitmap.compress(Bitmap.CompressFormat.JPEG, 80, out);
                out.flush();
                out.close();
                uris[tempI] = Uri.fromFile(imageFile);
//                MediaScannerConnection.scanFile(context,new String[] { imageFile.getAbsolutePath() }, null,new MediaScannerConnection.OnScanCompletedListener() {
//                    public void onScanCompleted(String path, Uri uri) {
//                        Log.i("ExternalStorage", "Scanned " + path + ":");
//                        Log.i("ExternalStorage", "-> uri=" + uri);
//                        uris[tempI] = uri;
//                    }
//                });

                connection.disconnect();
            }
            return uris;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return uris;
    }


    @Override
    protected void onPostExecute(Uri[] result) {
        listener.onLoadComplete(result);
    }

}
