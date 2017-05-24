package com.eyecare;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.annotation.Nullable;
import android.widget.ImageView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.io.File;

/**
 * Created by wl00887404 on 2017/5/12.
 */

public class MyImageView extends SimpleViewManager<ImageView> {
    public static final String REACT_CLASS = "ImageView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ImageView createViewInstance(ThemedReactContext reactContext) {
        ImageView imageView = new ImageView(reactContext);
        return imageView;
    }

    @ReactProp(name = "source")
    public void setSrc(ImageView view, @Nullable String source) {
        File file = new File(source);
        Bitmap bm = BitmapFactory.decodeFile(file.getAbsolutePath());
        view.setImageBitmap(bm);
    }
}
