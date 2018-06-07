package com.newgen.evolvechain.uis.activities;

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
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;

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
    }

    private void makeOptionDataList() {
        optionDataList = new ArrayList<>();
        optionDataList.add("Basic Details");
        optionDataList.add("Identity Proof");
        optionDataList.add("Address Proof");
    }

    @Override
    public void onCellClick(int pos) {
        switch (pos) {
            case 0:
                Intent basicIntent = new Intent(this, BasicDetailActivity.class);
                startActivity(basicIntent);
                break;
            case 1:
                Intent identityIntent = new Intent(this, IdentityActivity.class);
                startActivity(identityIntent);
                break;
            case 2:
                Intent addressIntent = new Intent(this, AddressActivity.class);
                startActivity(addressIntent);
                break;
            case 3:
                Intent bankIntent = new Intent(this, BankDetailActivity.class);
                startActivity(bankIntent);
                break;
        }
    }

    public void onSaveClick(View view) {
        int identityType = AppManager.getInstance().identityModelV1.getType();
        int addressType = AppManager.getInstance().addressModelV1.getType();

        if (AppManager.getInstance().basicModel == null) {
            DialogsManager.showErrorDialog(this, "Error", "Please fill basic details");
        } else {
            if (identityType < 0) {
                DialogsManager.showErrorDialog(this, "Error", "Please fill identity details");
            } else {
                if (addressType < 0) {
                    DialogsManager.showErrorDialog(this, "Error", "Please fill address details");
                } else {
                    Intent intent = new Intent(this, SummaryActivity.class);
                    intent.putExtra("identity_type", identityType);
                    intent.putExtra("address_type", addressType);
                    startActivity(intent);
                    //saveBasicDataToServer(identityType, addressType);
                }
            }
        }
    }
}
