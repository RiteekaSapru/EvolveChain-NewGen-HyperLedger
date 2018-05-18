package com.newgen.evolvechain.network_layer;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
 */

public interface WebConnectionListener {
    void onTaskStart();
    void onTaskComplete(String result);
}
