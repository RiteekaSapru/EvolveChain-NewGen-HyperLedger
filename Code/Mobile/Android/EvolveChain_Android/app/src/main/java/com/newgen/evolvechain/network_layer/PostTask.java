package com.newgen.evolvechain.network_layer;

import android.os.AsyncTask;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
 */

public class PostTask extends AsyncTask<Void, Void, String> {

    private String bodyData;
    private String urlData;
    private WebConnectionListener listener;

    public PostTask(String bodyData, String urlData, WebConnectionListener listener) {
        this.bodyData = bodyData;
        this.urlData = urlData;
        this.listener = listener;
    }

    @Override
    protected String doInBackground(Void... voids) {
        String result;
        try {
            URL url = new URL(urlData);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.connect();

            byte[] bodyBytes = bodyData.getBytes("UTF-8");
            OutputStream stream = conn.getOutputStream();
            stream.write(bodyBytes);
            stream.close();
            InputStream is = conn.getInputStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is));
            String line;
            StringBuilder response = new StringBuilder();
            while ((line = rd.readLine()) != null) {
                response.append(line);
            }
            rd.close();
            result = response.toString();
        }
        catch (Exception e) {
            e.printStackTrace();
             result = "Error";
        }

        return result;
    }

    @Override
    protected void onPreExecute(){
        listener.onTaskStart();
    }

    @Override
    protected void onPostExecute(String result){
        listener.onTaskComplete(result);
    }
}
