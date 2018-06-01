package com.newgen.evolvechain.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;

/**
 * Created by onkar.gupta on 5/29/2018.
 *
 */

public class BlurBuilder {
    private static final float BITMAP_SCALE = 0.6f;
    private static final float BLUR_RADIUS = 24f;

    public static Bitmap blur(Context context, Bitmap image) {
        int width = Math.round(image.getWidth() * BITMAP_SCALE);
        int height = Math.round(image.getHeight() * BITMAP_SCALE);

        Bitmap inputBitmap = Bitmap.createScaledBitmap(image, width, height, false);
        Bitmap outputBitmap = Bitmap.createBitmap(inputBitmap);

        RenderScript rs = RenderScript.create(context);
        ScriptIntrinsicBlur intrinsicBlur = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
        Allocation tempIn = Allocation.createFromBitmap(rs, inputBitmap);
        Allocation tempOut = Allocation.createFromBitmap(rs, outputBitmap);

        intrinsicBlur.setRadius(BLUR_RADIUS);
        intrinsicBlur.setInput(tempIn);
        intrinsicBlur.forEach(tempOut);
        tempOut.copyTo(outputBitmap);

        return outputBitmap;
    }
}
