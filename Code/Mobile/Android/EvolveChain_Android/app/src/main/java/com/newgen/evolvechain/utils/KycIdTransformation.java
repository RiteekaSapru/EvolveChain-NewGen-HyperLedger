package com.newgen.evolvechain.utils;

import android.text.method.PasswordTransformationMethod;
import android.view.View;

/**
 * Created by onkar.gupta on 6/5/2018.
 */

public class KycIdTransformation extends PasswordTransformationMethod {
    @Override
    public CharSequence getTransformation(CharSequence source, View view) {
        return new PasswordCharSequence(source);
    }

    private class PasswordCharSequence implements CharSequence {
        private CharSequence mSource;

        PasswordCharSequence(CharSequence source) {
            mSource = source;
        }

        @Override
        public int length() {
            return mSource.length();
        }

        @Override
        public char charAt(int i) {
            if (i <= 3 || i >= 14 || mSource.charAt(i) == '-') {
                return mSource.charAt(i);
            } else {
                return 'X';
            }
        }

        @Override
        public CharSequence subSequence(int i, int i1) {
            return mSource.subSequence(i, i1);
        }
    }
}
