package com.newgen.evolvechain.network_layer;

import android.net.Uri;

/**
 * Created by onkar.gupta on 6/8/2018.
 *
 */

public interface ImageSaverListener {
    void imageSaved(Uri uri);
    void failed();
}
