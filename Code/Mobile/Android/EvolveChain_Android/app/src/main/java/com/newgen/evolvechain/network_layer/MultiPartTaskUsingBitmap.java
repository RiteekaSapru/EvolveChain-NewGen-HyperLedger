package com.newgen.evolvechain.network_layer;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.MediaStore;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by onkar.gupta on 5/28/2018.
 *
 */

public class MultiPartTaskUsingBitmap extends AsyncTask<Void, Void, String>{

    private Context context;
    private String url1, fileMimeType;
    private String[] fileField, filepath;
    private Map<String, String> params;
    private WebConnectionListener listener;
    private Uri[] uris;

    public MultiPartTaskUsingBitmap(Context context, Uri[] uris, String url1, Map<String, String> params, String[] filepath, String[] fileField, String fileMimeType, WebConnectionListener listener) {
        this.context = context;
        this.url1 = url1;
        this.params = params;
        this.filepath = filepath;
        this.fileField = fileField;
        this.fileMimeType = fileMimeType;
        this.uris = uris;
        this.listener = listener;
    }

    @Override
    protected void onPreExecute() {
        listener.onTaskStart();
    }

    @Override
    protected void onPostExecute(String result) {
        listener.onTaskComplete(result);
    }

    @Override
    protected String doInBackground(Void... voids) {
        String twoHyphens = "--";
        String boundary = "*****" + Long.toString(System.currentTimeMillis()) + "*****";
        String lineEnd = "\r\n";
        DataOutputStream outputStream = null;
        int bytesRead, bytesAvailable, bufferSize;
        byte[] buffer;
        int maxBufferSize = 1024 * 1024;
        InputStream inputStream = null;
        String result = "";

        try {

            URL url = new URL(url1);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setUseCaches(false);

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("User-Agent", "Android Multipart HTTP Client 1.0");
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            outputStream = new DataOutputStream(connection.getOutputStream());

            for (int i = 0; i < filepath.length; i++) {

                Bitmap scaledBitmap = scaleDown(uris[i], 600, true);

                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                scaledBitmap.compress(Bitmap.CompressFormat.PNG, 0 /*ignored for PNG*/, bos);
                byte[] bitmapdata = bos.toByteArray();
                ByteArrayInputStream bs = new ByteArrayInputStream(bitmapdata);


//                File file = new File(filepath[i]);
//                FileInputStream fileInputStream = new FileInputStream(file);

                if (filepath[i] != null) {
                    String[] q = filepath[i].split("/");
                    int idx = q.length - 1;
                    outputStream.writeBytes(twoHyphens + boundary + lineEnd);
                    outputStream.writeBytes("Content-Disposition: form-data; name=\"" + fileField[i] + "\"; filename=\"" + q[idx] + "\"" + lineEnd);
                }
                else {

                    outputStream.writeBytes(twoHyphens + boundary + lineEnd);
                    outputStream.writeBytes("Content-Disposition: form-data; name=\"" + fileField[i] + "\"; filename=\"" + "mobile_image" + "\"" + lineEnd);
                }
                outputStream.writeBytes("Content-Type: " + fileMimeType + lineEnd);
                outputStream.writeBytes("Content-Transfer-Encoding: binary" + lineEnd);

                outputStream.writeBytes(lineEnd);

                bytesAvailable = bs.available();
                bufferSize = Math.min(bytesAvailable, maxBufferSize);
                buffer = new byte[bufferSize];

                bytesRead = bs.read(buffer, 0, bufferSize);
                while (bytesRead > 0) {
                    outputStream.write(buffer, 0, bufferSize);
                    bytesAvailable = bs.available();
                    bufferSize = Math.min(bytesAvailable, maxBufferSize);
                    bytesRead = bs.read(buffer, 0, bufferSize);
                }

                outputStream.writeBytes(lineEnd);
                bs.close();
                scaledBitmap = null;
            }

            for (String key : params.keySet()) {
                String value = params.get(key);

                outputStream.writeBytes(twoHyphens + boundary + lineEnd);
                outputStream.writeBytes("Content-Disposition: form-data; name=\"" + key + "\"" + lineEnd);
                outputStream.writeBytes("Content-Type: text/plain" + lineEnd);
                outputStream.writeBytes(lineEnd);
                outputStream.writeBytes(value);
                outputStream.writeBytes(lineEnd);
            }
            outputStream.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);

            if (200 != connection.getResponseCode()) {

            }

            inputStream = connection.getInputStream();

            result = this.convertStreamToString(inputStream);

            inputStream.close();
            outputStream.flush();
            outputStream.close();

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    private Bitmap scaleDown(Uri imageUri, float maxImageSize, boolean filter) {
        Bitmap bitmap = null;
        try {
            bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), imageUri);

            float ratio = Math.min(
                    (float) maxImageSize / bitmap.getWidth(),
                    (float) maxImageSize / bitmap.getHeight());
            int width = Math.round((float) ratio * bitmap.getWidth());
            int height = Math.round((float) ratio * bitmap.getHeight());

            bitmap = Bitmap.createScaledBitmap(bitmap, width,
                    height, filter);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return bitmap;
    }

    private String convertStreamToString(InputStream is) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();

        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }
}
