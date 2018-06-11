package com.newgen.evolvechain.network_layer;

import android.os.AsyncTask;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by onkar.gupta on 6/6/2018.
 *
 */

public class GetTask extends AsyncTask<Void, Void, String>{
    private String urlData;
    private WebConnectionListener listener;

    public GetTask(String urlData, WebConnectionListener listener) {
        this.urlData = urlData;
        this.listener = listener;
    }

    @Override
    protected String doInBackground(Void... voids) {
        String result;
        try {
            URL url = new URL(urlData);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setConnectTimeout(10000);
            conn.connect();
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
            result = e.toString();
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
