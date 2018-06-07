package com.newgen.evolvechain.adpaters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.documnets.PassportModel;

/**
 * Created by onkar.gupta on 5/28/2018.
 *
 */

public class PassportAdapter extends RecyclerView.Adapter<PassportAdapter.PassportViewHolder> {

    private PassportModel passportModel;

    public PassportAdapter(PassportModel passportModel) {
        this.passportModel = passportModel;
    }

    @Override
    public PassportViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_passport, parent, false);
        return new PassportViewHolder(view);
    }

    @Override
    public void onBindViewHolder(PassportViewHolder holder, int position) {
        switch (position) {
            case 0:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText("Passport Number");
                holder.value.setText(passportModel.getNumber());
                break;
            case 1:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.expiry_date);
                holder.value.setText(passportModel.getExpiryDate());
                break;
            case 2:
                holder.contentLayout.setVisibility(View.VISIBLE);
                holder.imageLayout.setVisibility(View.GONE);
                holder.title.setText(R.string.issue_country);
                holder.value.setText(passportModel.getIssueCountry());
                break;
            case 3:
                holder.contentLayout.setVisibility(View.GONE);
                holder.imageLayout.setVisibility(View.VISIBLE);
                holder.frontImage.setImageURI(passportModel.getFrontUri());
                holder.backImage.setImageURI(passportModel.getBackUri());
                break;
        }
    }

    @Override
    public int getItemCount() {
        return 4;
    }

    class PassportViewHolder extends RecyclerView.ViewHolder{

        LinearLayout contentLayout, imageLayout;
        ImageView frontImage, backImage;
        TextView title, value;

        PassportViewHolder(View itemView) {
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
