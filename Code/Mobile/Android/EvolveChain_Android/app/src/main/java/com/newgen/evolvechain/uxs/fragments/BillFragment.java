package com.newgen.evolvechain.uxs.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;

import com.newgen.evolvechain.FragmentCommunicator;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.uxs.AddressDynamicActivity;


public class BillFragment extends Fragment implements FragmentCommunicator{

    private OnFragmentInteractionListener mListener;

    private EditText typeText, numberText, addressText;
    private ImageView frontImage, backImage;
    private Uri frontUri, backUri;

    public BillFragment() {
        // Required empty public constructor
    }
    public static BillFragment newInstance(String param1, String param2) {
        return new BillFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_bill, container, false);
        typeText = view.findViewById(R.id.edit_text_type);
        numberText = view.findViewById(R.id.edit_text_number);
        addressText = view.findViewById(R.id.edit_text_address);
        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
            ((AddressDynamicActivity) getActivity()).fragmentCommunicator = this;
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

    }

    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
