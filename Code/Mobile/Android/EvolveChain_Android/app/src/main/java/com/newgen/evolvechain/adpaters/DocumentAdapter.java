package com.newgen.evolvechain.adpaters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.DocumentModel;

/**
 * Created by onkar.gupta on 6/7/2018.
 *
 */

public class DocumentAdapter extends RecyclerView.Adapter<DocumentAdapter.DocumentViewHolder> {

    private DocumentModel documentModel;
    private int size = 5;

    public DocumentAdapter(DocumentModel documentModel) {
        this.documentModel = documentModel;

        if (documentModel.getExpiryDate().length() == 0) {
            size = size - 1;
        }
        if (documentModel.getSubTypeCode().length() == 0) {
            size = size - 1;
        }
    }

    @Override
    public DocumentViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_passport, parent, false);
        return new DocumentViewHolder(view);
    }

    @Override
    public void onBindViewHolder(DocumentViewHolder holder, int position) {
        switch (size) {
            case 5:
                switch (position) {
                    case 0:
                        holder.contentLayout.setVisibility(View.VISIBLE);
                        holder.imageLayout.setVisibility(View.GONE);
                        holder.title.setText("Bill Type");
                        holder.value.setText(documentModel.getSubType());
                        break;
                    case 1:
                        holder.contentLayout.setVisibility(View.VISIBLE);
                        holder.imageLayout.setVisibility(View.GONE);
                        holder.title.setText(documentModel.getType() + " Number");
                        holder.value.setText(documentModel.getNumber());
                        break;
                    case 2:
                        holder.contentLayout.setVisibility(View.VISIBLE);
                        holder.imageLayout.setVisibility(View.GONE);
                        holder.title.setText("Expiry Date");
                        holder.value.setText(documentModel.getExpiryDate());
                        break;
                    case 3:
                        holder.contentLayout.setVisibility(View.VISIBLE);
                        holder.imageLayout.setVisibility(View.GONE);
                        holder.title.setText("Issue Country");
                        holder.value.setText(documentModel.getIssueCountry());
                        break;
                    case 4:
                        holder.contentLayout.setVisibility(View.GONE);
                        holder.imageLayout.setVisibility(View.VISIBLE);
                        holder.frontImage.setImageURI(documentModel.getFrontUri());
                        holder.backImage.setImageURI(documentModel.getBackUri());
                        break;
                }
                break;
            case 4:
                if (documentModel.getSubType().length() == 0 && documentModel.getExpiryDate().length() > 0) {
                    switch (position) {
                        case 0:
                            holder.contentLayout.setVisibility(View.VISIBLE);
                            holder.imageLayout.setVisibility(View.GONE);
                            holder.title.setText(documentModel.getType() + " Number");
                            holder.value.setText(documentModel.getNumber());
                            break;
                        case 1:
                            holder.contentLayout.setVisibility(View.VISIBLE);
                            holder.imageLayout.setVisibility(View.GONE);
                            holder.title.setText("Expiry Date");
                            holder.value.setText(documentModel.getExpiryDate());
                            break;
                        case 2:
                            holder.contentLayout.setVisibility(View.VISIBLE);
                            holder.imageLayout.setVisibility(View.GONE);
                            holder.title.setText("Issue Country");
                            holder.value.setText(documentModel.getIssueCountry());
                            break;
                        case 3:
                            holder.contentLayout.setVisibility(View.GONE);
                            holder.imageLayout.setVisibility(View.VISIBLE);
                            holder.frontImage.setImageURI(documentModel.getFrontUri());
                            holder.backImage.setImageURI(documentModel.getBackUri());
                            break;
                    }
                }
                else {
                    switch (position) {
                        case 0:
                            holder.contentLayout.setVisibility(View.VISIBLE);
                            holder.imageLayout.setVisibility(View.GONE);
                            holder.title.setText("Bill Type");
                            holder.value.setText(documentModel.getSubType());
                            break;
                        case 1:
                            holder.contentLayout.setVisibility(View.VISIBLE);
                            holder.imageLayout.setVisibility(View.GONE);
                            holder.title.setText(documentModel.getType() + " Number");
                            holder.value.setText(documentModel.getNumber());
                            break;
                        case 2:
                            holder.contentLayout.setVisibility(View.VISIBLE);
                            holder.imageLayout.setVisibility(View.GONE);
                            holder.title.setText("Issue Country");
                            holder.value.setText(documentModel.getIssueCountry());
                            break;
                        case 3:
                            holder.contentLayout.setVisibility(View.GONE);
                            holder.imageLayout.setVisibility(View.VISIBLE);
                            holder.frontImage.setImageURI(documentModel.getFrontUri());
                            holder.backImage.setImageURI(documentModel.getBackUri());
                            break;
                    }
                }
                break;
            case 3:
                switch (position) {
                    case 0:
                        holder.contentLayout.setVisibility(View.VISIBLE);
                        holder.imageLayout.setVisibility(View.GONE);
                        holder.title.setText(documentModel.getType() + " Number");
                        holder.value.setText(documentModel.getNumber());
                        break;
                    case 1:
                        holder.contentLayout.setVisibility(View.VISIBLE);
                        holder.imageLayout.setVisibility(View.GONE);
                        holder.title.setText("Issue Country");
                        holder.value.setText(documentModel.getIssueCountry());
                        break;
                    case 2:
                        holder.contentLayout.setVisibility(View.GONE);
                        holder.imageLayout.setVisibility(View.VISIBLE);
                        holder.frontImage.setImageURI(documentModel.getFrontUri());
                        holder.backImage.setImageURI(documentModel.getBackUri());
                        break;
                }
                break;
        }
    }

    @Override
    public int getItemCount() {
        return size;
    }

    class DocumentViewHolder extends RecyclerView.ViewHolder {
        LinearLayout contentLayout, imageLayout;
        ImageView frontImage, backImage;
        TextView title, value;

        DocumentViewHolder(View itemView) {
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