package com.newgen.evolvechain.uxs.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;

import com.newgen.evolvechain.FragmentCommunicator;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.uxs.AddressDynamicActivity;


public class PassportFragment extends Fragment implements FragmentCommunicator{

    private OnFragmentInteractionListener mListener;
    private EditText numberText, expiryDateText, issueCountryText;
    private ImageView frontImage, backImage;
    private Uri frontUri, backUri;

    public PassportFragment() {
        // Required empty public constructor
    }
    public static PassportFragment newInstance() {
        return new PassportFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view  = inflater.inflate(R.layout.fragment_passport, container, false);

        numberText = view.findViewById(R.id.edit_text_passport_number);
        expiryDateText = view.findViewById(R.id.edit_text_expiry_date);
        issueCountryText = view.findViewById(R.id.edit_text_issue_country);

        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
            ((AddressDynamicActivity)getActivity()).fragmentCommunicator = this;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    @Override
    public void saveCall() {
        String number = numberText.getText().toString();
        String expiryDate = expiryDateText.getText().toString();
        String issueCountry = issueCountryText.getText().toString();

        Log.d("Passport", number);
    }

    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
