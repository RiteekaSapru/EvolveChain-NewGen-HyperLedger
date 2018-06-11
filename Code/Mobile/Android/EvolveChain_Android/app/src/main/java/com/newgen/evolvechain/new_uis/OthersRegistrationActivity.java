package com.newgen.evolvechain.new_uis;

import android.content.Intent;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.newgen.evolvechain.CellClickListener;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.adpaters.OptionsAdapter;
import com.newgen.evolvechain.uis.activities.SummaryActivity;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.uxs.AddressDetailActivity;

import java.util.ArrayList;

public class OthersRegistrationActivity extends AppCompatActivity implements CellClickListener {

    RecyclerView optionsList;
    private ArrayList<String> optionDataList;
    private OptionsAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_others_registration);

        initUis();
        makeOptionDataList();
        setUpList();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (adapter != null) {
            adapter = new OptionsAdapter(optionDataList, this);
            optionsList.setAdapter(adapter);
        }
    }

    @Override
    public void onBackPressed() {
        NavUtils.navigateUpFromSameTask(this);
    }

    private void setUpList() {
        optionsList.setLayoutManager(new GridLayoutManager(this, 1));
        adapter = new OptionsAdapter(optionDataList, this);
        optionsList.setAdapter(adapter);
    }

    private void initUis() {
        optionsList = findViewById(R.id.options);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(AppManager.getInstance().selectedCountryModel.getName());
        }
    }

    private void makeOptionDataList() {
        optionDataList = new ArrayList<>();
        optionDataList.add("Basic Details");
        optionDataList.add("Address Details");
        optionDataList.add("Identity Proof");
        optionDataList.add("Address Proof");
        optionDataList.add("Uploading Holding Document Photo");
    }

    @Override
    public void onCellClick(int pos) {
        switch (pos) {
            case 0:
                Intent basicIntent = new Intent(this, BasicDetailActivity.class);
                startActivity(basicIntent);
                break;
            case 1:
                if (AppManager.getInstance().basicModel != null) {
                    Intent addressDetailIntent = new Intent(this, AddressDetailActivity.class);
                    startActivity(addressDetailIntent);
                }
                break;
            case 2:
                if (AppManager.getInstance().basicModel != null && AppManager.getInstance().basicModel.getAddress1() != null) {
                    Intent identityIntent = new Intent(this, DynamicDocumentActivity.class);
                    identityIntent.putExtra("type", "Identity");
                    startActivity(identityIntent);
                }
                break;
            case 3:
                if (AppManager.getInstance().identityDocumentModel != null) {
                    Intent addressIntent = new Intent(this, DynamicDocumentActivity.class);
                    addressIntent.putExtra("type", "Address");
                    startActivity(addressIntent);
                }
                break;
            case 4:
                if (AppManager.getInstance().addressDocumentModel != null) {
                    Intent intent = new Intent(this, UploadingHeldImageActivity.class);
                    startActivity(intent);
                }
                break;
        }
    }

    public void onSaveClick(View view) {

        if (AppManager.getInstance().basicModel == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please fill basic details");
        } else {
            if (AppManager.getInstance().identityDocumentModel == null) {
                DialogsManager.showErrorDialog(this, "Error", "Please fill identity details");
            } else {
                if (AppManager.getInstance().addressDocumentModel == null) {
                    DialogsManager.showErrorDialog(this, "Error", "Please fill address details");
                } else {
                    Intent intent = new Intent(this, SummaryActivity.class);
                    startActivity(intent);
                }
            }
        }
    }
}
