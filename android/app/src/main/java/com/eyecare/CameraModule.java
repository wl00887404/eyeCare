package com.eyecare;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.Surface;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by wl00887404 on 2017/5/10.
 */

public class CameraModule extends ReactContextBaseJavaModule {
    Camera mCarmeraModule;
    String mUser;
    Double mThreshold;
    int mIndex;

    public CameraModule(ReactApplicationContext reactContext)
    {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CameraModule";
    }

    @ReactMethod
    public void setUser(String user){
        this.mUser=user;
    }
    @ReactMethod
    public void setThreshold(Double threshold){
        this.mThreshold=threshold;
    }
    @ReactMethod
    public void setIndex(int index){
        this.mIndex=index;
    }
    @ReactMethod
    public void startBackgroundCamera(){
        Activity activity= getCurrentActivity();
        Intent intent = new Intent(activity, BackgroundCamera.class);
        intent.putExtra("user",mUser);
        intent.putExtra("threshold",mThreshold);
        intent.putExtra("index",mIndex);
        activity.startService(intent);
    }
    @ReactMethod
    public void stopBackgroundCamera(){
        Activity activity= getCurrentActivity();
        Intent intent = new Intent(activity, BackgroundCamera.class);
        activity.stopService(intent);
    }
}
