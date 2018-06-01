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
import com.newgen.evolvechain.models.documnets.UtilityBillModel;

/**
 * Created by onkar.gupta on 5/28/2018.
 *
 */

public class UtilityBillAdapter extends RecyclerView.Adapter<UtilityBillAdapter.UtilityViewHolder> {

    private UtilityBillModel utilityBillModel;

    public UtilityBillAdapter(UtilityBillModel utilityBillModel) {
        this.utilityBillModel = utilityBillModel;
    }

    @Override
    public UtilityViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_passport, parent, false);
        return new UtilityViewHolder(view);
    }

    @Override
    public void onBindViewHolder(UtilityViewHolder holder, int position) {
        switch (position) {
            case 0:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.type);
                holder.value.setText(utilityBillModel.getType());
                break;
            case 1:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.number);
                holder.value.setText(utilityBillModel.getNumber());
                break;
            case 2:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.address);
                holder.value.setText(utilityBillModel.getAddress());
                break;
            case 3:
                holder.contentLayout.setVisibility(View.GONE);
                holder.imageLayout.setVisibility(View.VISIBLE);
                holder.frontImage.setImageURI(utilityBillModel.getFrontUri());
                holder.backImage.setImageURI(utilityBillModel.getBackUri());
                break;
        }
    }

    @Override
    public int getItemCount() {
        return 4;
    }

    class UtilityViewHolder extends RecyclerView.ViewHolder {
        LinearLayout contentLayout, imageLayout;
        ImageView frontImage, backImage;
        TextView title, value;

        public UtilityViewHolder(View itemView) {
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
