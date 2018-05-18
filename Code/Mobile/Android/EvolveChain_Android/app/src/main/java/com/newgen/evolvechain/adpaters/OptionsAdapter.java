package com.newgen.evolvechain.adpaters;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.newgen.evolvechain.CellClickListener;
import com.newgen.evolvechain.R;

import java.util.ArrayList;

/**
 * Created by onkar.gupta on 5/17/2018.
 *
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
    }

    @Override
    public int getItemCount() {
        return optionList.size();
    }

    class OptionsViewHolder extends RecyclerView.ViewHolder {

        TextView titleText;

        OptionsViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.title);
        }
    }
}
