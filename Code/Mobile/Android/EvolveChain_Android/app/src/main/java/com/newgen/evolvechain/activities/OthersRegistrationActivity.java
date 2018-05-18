package com.newgen.evolvechain.activities;

import android.content.Intent;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;

import com.newgen.evolvechain.CellClickListener;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.adpaters.OptionsAdapter;

import java.util.ArrayList;

public class OthersRegistrationActivity extends AppCompatActivity implements CellClickListener {

    RecyclerView optionsList;
    private ArrayList<String> optionDataList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_others_registration);

        initUis();
        makeOptionDataList();
        setUpList();
    }

    @Override
    public void onBackPressed() {
        NavUtils.navigateUpFromSameTask(this);
    }

    private void setUpList() {
        optionsList.setLayoutManager(new LinearLayoutManager(this));
        OptionsAdapter adapter = new OptionsAdapter(optionDataList, this);
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
        optionDataList.add("SSN Details");
        optionDataList.add("Bank Details");
    }

    @Override
    public void onCellClick(int pos) {
        switch (pos) {
            case 0:
                Intent basicIntent = new Intent(this, BasicDetailsActivity.class);
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
        }
    }
}
