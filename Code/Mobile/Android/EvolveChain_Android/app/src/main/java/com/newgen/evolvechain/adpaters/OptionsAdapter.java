package com.newgen.evolvechain.adpaters;

import android.graphics.Color;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.newgen.evolvechain.CellClickListener;
import com.newgen.evolvechain.R;
import com.newgen.evolvechain.utils.AppManager;

import java.util.ArrayList;

/**
 * Created by onkar.gupta on 5/17/2018.
 */

public class OptionsAdapter extends RecyclerView.Adapter<OptionsAdapter.OptionsViewHolder> {

    private ArrayList<String> optionList;
    private CellClickListener clickListener;

    public OptionsAdapter(ArrayList<String> optionList, CellClickListener clickListener) {
        this.optionList = optionList;
        this.clickListener = clickListener;
    }

    @Override
    public OptionsViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_options, parent, false);
        return new OptionsViewHolder(view);
    }

    @Override
    public void onBindViewHolder(OptionsViewHolder holder, int position) {

        final int tempPos = position;

        holder.titleText.setText(optionList.get(position));
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clickListener.onCellClick(tempPos);
            }
        });

        switch (position) {
            case 0:
                holder.titleText.setTextColor(Color.BLACK);
                holder.image.setImageResource(R.drawable.ic_content_basic_black_24dp);
                if(AppManager.getInstance().basicModel != null) {
                    holder.savedImage.setVisibility(View.VISIBLE);
                }
                else {
                    holder.savedImage.setVisibility(View.GONE);
                }
                break;
            case 1:
                if (AppManager.getInstance().basicModel != null) {
                    holder.titleText.setTextColor(Color.BLACK);
                    holder.image.setImageResource(R.drawable.ic_address_black_24dp);
                } else {
                    holder.titleText.setTextColor(Color.GRAY);
                    holder.image.setImageResource(R.drawable.ic_address_gray_24dp);
                }
                if(AppManager.getInstance().basicModel != null && AppManager.getInstance().basicModel.getAddress1() != null) {
                    holder.savedImage.setVisibility(View.VISIBLE);
                }
                else {
                    holder.savedImage.setVisibility(View.GONE);
                }
                break;
            case 2:
                if (AppManager.getInstance().basicModel != null && AppManager.getInstance().basicModel.getAddress1() != null) {
                    holder.titleText.setTextColor(Color.BLACK);
                    holder.image.setImageResource(R.drawable.ic_account_box_black_24dp);
                } else {
                    holder.titleText.setTextColor(Color.GRAY);
                    holder.image.setImageResource(R.drawable.ic_account_box_gray_24dp);
                }
                if(AppManager.getInstance().identityDocumentModel != null) {
                    holder.savedImage.setVisibility(View.VISIBLE);
                }
                else {
                    holder.savedImage.setVisibility(View.GONE);
                }
                break;
            case 3:
                if (AppManager.getInstance().identityDocumentModel != null) {
                    holder.titleText.setTextColor(Color.BLACK);
                    holder.image.setImageResource(R.drawable.ic_content_basic_black_24dp);
                } else {
                    holder.titleText.setTextColor(Color.GRAY);
                    holder.image.setImageResource(R.drawable.ic_content_basic_gray);
                }
                if(AppManager.getInstance().addressDocumentModel != null) {
                    holder.savedImage.setVisibility(View.VISIBLE);
                }
                else {
                    holder.savedImage.setVisibility(View.GONE);
                }
                break;
            case 4:
                if (AppManager.getInstance().addressDocumentModel != null) {
                    holder.titleText.setTextColor(Color.BLACK);
                    holder.image.setImageResource(R.drawable.ic_camera_black_24dp);
                } else {
                    holder.titleText.setTextColor(Color.GRAY);
                    holder.image.setImageResource(R.drawable.ic_camera_gray_24dp);
                }
                if(AppManager.getInstance().holdingDocumentModel != null && AppManager.getInstance().holdingDocumentModel.getUri() != null) {
                    holder.savedImage.setVisibility(View.VISIBLE);
                }
                else {
                    holder.savedImage.setVisibility(View.GONE);
                }
                break;

        }
    }

    @Override
    public int getItemCount() {
        return optionList.size();
    }

    class OptionsViewHolder extends RecyclerView.ViewHolder {

        TextView titleText;
        ImageView image, savedImage;

        OptionsViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.title);
            image = itemView.findViewById(R.id.image);
            savedImage = itemView.findViewById(R.id.saved_img);
        }
    }
}
