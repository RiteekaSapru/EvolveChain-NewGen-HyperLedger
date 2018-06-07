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

/**
 * Created by onkar.gupta on 5/28/2018.
 *
 */

public class BasicInfoAdapter extends RecyclerView.Adapter<BasicInfoAdapter.BasicInfoViewHolder>{

    private UserBasicModel basicModel;

    public BasicInfoAdapter(UserBasicModel basicModel) {
        this.basicModel = basicModel;
    }


    @Override
    public BasicInfoViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cell_title_value, parent, false);
        return new BasicInfoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(BasicInfoViewHolder holder, int position) {
        switch (position) {
            case 0:
                holder.imageView.setVisibility(View.VISIBLE);
                holder.content.setVisibility(View.GONE);
                holder.imageView.setImageURI(basicModel.getUri());
                break;
            case 1:
                holder.title.setText(R.string.e_mail);
                holder.value.setText(basicModel.getEmail());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 2:
                holder.title.setText(R.string.contact_number);
                holder.value.setText("+" + basicModel.getIsd() + basicModel.getPhone());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 3:
                holder.title.setText(R.string.first_name);
                holder.value.setText(basicModel.getFirstName());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 4:
                holder.title.setText(R.string.middle_name);
                holder.value.setText(basicModel.getMiddleName());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 5:
                holder.title.setText(R.string.last_name);
                holder.value.setText(basicModel.getLastName());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 6:
                holder.title.setText(R.string.date_of_birth);
                holder.value.setText(basicModel.getDob());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 7:
                holder.title.setText(R.string.birth_place);
                holder.value.setText(basicModel.getPlaceBirth());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 8:
                holder.title.setText(R.string.address_1);
                holder.value.setText(basicModel.getAddress1());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 9:
                holder.title.setText(R.string.address_2);
                holder.value.setText(basicModel.getAddress2());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 10:
                holder.title.setText(R.string.street);
                holder.value.setText(basicModel.getStreet());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 11:
                holder.title.setText(R.string.city);
                holder.value.setText(basicModel.getCity());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 12:
                holder.title.setText(R.string.area_code);
                holder.value.setText(basicModel.getZip());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 13:
                holder.title.setText(R.string.state);
                holder.value.setText(basicModel.getState());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;
            case 14:
                holder.title.setText(R.string.country);
                holder.value.setText(basicModel.getCountry());
                holder.imageView.setVisibility(View.GONE);
                holder.content.setVisibility(View.VISIBLE);
                break;

        }
    }

    @Override
    public int getItemCount() {
        return 15;
    }

    class BasicInfoViewHolder extends RecyclerView.ViewHolder {

        TextView title, value;
        ImageView imageView;
        LinearLayout content;

        BasicInfoViewHolder(View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.title);
            value = itemView.findViewById(R.id.value);
            imageView = itemView.findViewById(R.id.image);
            content = itemView.findViewById(R.id.content);
        }
    }
}
