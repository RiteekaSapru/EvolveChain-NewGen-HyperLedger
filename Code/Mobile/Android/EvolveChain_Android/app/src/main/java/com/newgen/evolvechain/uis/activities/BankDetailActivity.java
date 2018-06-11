package com.newgen.evolvechain.uis.activities;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.UserBankModel;
import com.newgen.evolvechain.utils.AppManager;
import com.newgen.evolvechain.utils.DialogsManager;
import com.newgen.evolvechain.new_uis.OthersRegistrationActivity;

public class BankDetailActivity extends AppCompatActivity {

    private EditText editTextAccountNumber, editTextIFSCCode, editTextBankName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bank_detail);

        initUi();
    }

    private void initUi() {
        editTextAccountNumber = findViewById(R.id.edit_text_account_number);
        editTextIFSCCode = findViewById(R.id.edit_text_ifsc_code);
        editTextBankName = findViewById(R.id.edit_text_bank_name);
    }

    public void onSaveClick(View view) {
        String accountNumber = editTextAccountNumber.getText().toString();
        String ifscCode = editTextIFSCCode.getText().toString();
        String bankName = editTextBankName.getText().toString();

        if (accountNumber.length() > 0 && ifscCode.length() > 0 && bankName.length() > 0) {
            AppManager.getInstance().bankModel = new UserBankModel(accountNumber, ifscCode, bankName);
            Intent intent = new Intent(this, OthersRegistrationActivity.class);
            startActivity(intent);
        }
        else {
            DialogsManager.showErrorDialog(this, "Error", "Please fill all the details to proceed");
        }
    }
}
