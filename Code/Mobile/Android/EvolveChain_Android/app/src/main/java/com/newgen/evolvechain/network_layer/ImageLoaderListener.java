package com.newgen.evolvechain.network_layer;

import android.graphics.Bitmap;
import android.net.Uri;

/**
 * Created by onkar.gupta on 6/8/2018.
 *
 */

public interface ImageLoaderListener {
    void onTaskStart();
    void onLoadComplete(Uri[] uris);
}
