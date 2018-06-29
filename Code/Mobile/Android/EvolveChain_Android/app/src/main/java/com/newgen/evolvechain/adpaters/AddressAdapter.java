package com.newgen.evolvechain.adpaters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.newgen.evolvechain.R;
import com.newgen.evolvechain.models.UserBasicModel;

public class AddressAdapter extends RecyclerView.Adapter<AddressAdapter.AddressViewHolder> {
    private UserBasicModel basicModel;

    public AddressAdapter(UserBasicModel basicModel) {
        this.basicModel = basicModel;
    }

    @Override
    public AddressViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_title_value, parent, false);
        return new AddressViewHolder(view);
    }

    @Override
    public void onBindViewHolder(AddressViewHolder holder, int position) {
        switch (position) {
            case 0:
                holder.title.setText(R.string.address_1);
                holder.value.setText(basicModel.getAddress1());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 1:
                holder.title.setText(R.string.address_2);
                holder.value.setText(basicModel.getAddress2());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 2:
                holder.title.setText(R.string.street);
                holder.value.setText(basicModel.getStreet());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 3:
                holder.title.setText(R.string.city);
                holder.value.setText(basicModel.getCity());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 4:
                holder.title.setText(R.string.area_code);
                holder.value.setText(basicModel.getZip());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 5:
                holder.title.setText(R.string.state);
                holder.value.setText(basicModel.getState());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 6:
                holder.title.setText(R.string.country);
                holder.value.setText(basicModel.getCountry());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
        }
    }

    @Override
    public int getItemCount() {
        return 7;
    }

    class AddressViewHolder extends RecyclerView.ViewHolder {

        TextView title, value;
        ImageView imageView;
        LinearLayout content;

        AddressViewHolder(View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.title);
            value = itemView.findViewById(R.id.value);
            imageView = itemView.findViewById(R.id.image);
            content = itemView.findViewById(R.id.content);
        }
    }
}
