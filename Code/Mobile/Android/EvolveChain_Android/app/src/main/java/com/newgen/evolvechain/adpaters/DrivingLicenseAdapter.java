package com.newgen.evolvechain.adpaters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.documnets.DrivingLicenseModel;
import com.newgen.evolvechain.models.documnets.PassportModel;

/**
 * Created by onkar.gupta on 5/28/2018.
 *
 */

public class DrivingLicenseAdapter extends RecyclerView.Adapter<DrivingLicenseAdapter.DrivingLicenseViewHolder>{

    private DrivingLicenseModel drivingLicenseModel;

    public DrivingLicenseAdapter(DrivingLicenseModel drivingLicenseModel) {
        this.drivingLicenseModel = drivingLicenseModel;
    }

    @Override
    public DrivingLicenseViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_passport, parent, false);
        return new DrivingLicenseViewHolder(view);
    }

    @Override
    public void onBindViewHolder(DrivingLicenseViewHolder holder, int position) {
        switch (position) {
            case 0:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText("Driving License Number");
                holder.value.setText(drivingLicenseModel.getNumber());
                break;
            case 1:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.expiry_date);
                holder.value.setText(drivingLicenseModel.getExpiryDate());
                break;
            case 2:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.issue_country);
                holder.value.setText(drivingLicenseModel.getIssueCountry());
                break;
            case 3:
                holder.contentLayout.setVisibility(View.GONE);
                holder.imageLayout.setVisibility(View.VISIBLE);
                holder.frontImage.setImageURI(drivingLicenseModel.getFrontUri());
                holder.backImage.setImageURI(drivingLicenseModel.getBackUri());
                break;
        }
    }

    @Override
    public int getItemCount() {
        return 4;
    }

    class DrivingLicenseViewHolder extends RecyclerView.ViewHolder{

        LinearLayout contentLayout, imageLayout;
        ImageView frontImage, backImage;
        TextView title, value;

        DrivingLicenseViewHolder(View itemView) {
            super(itemView);
            contentLayout = itemView.findViewById(R.id.content);
            imageLayout = itemView.findViewById(R.id.image_content);

            frontImage = itemView.findViewById(R.id.front_image);
            backImage = itemView.findViewById(R.id.back_image);

            title = itemView.findViewById(R.id.title);
            value = itemView.findViewById(R.id.value);
        }
    }
}
