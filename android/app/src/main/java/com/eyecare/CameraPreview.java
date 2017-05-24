package com.eyecare;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.SurfaceTexture;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.Display;
import android.view.Surface;
import android.view.TextureView;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import static java.security.AccessController.getContext;

/**
 * Created by wl00887404 on 2017/5/10.
 */

public class CameraPreview extends SimpleViewManager<TextureView> {
    private static final java.lang.Integer TAKE_PICTURE = 0;
    private static final java.lang.Integer TEST = 10;
    private Surface surface;
    Camera mCarmera;
    TextureView mTextureView;
    ReactContext mReactContext;
    String user;
    String[] data;
    public static final String REACT_CLASS = "CameraPreview";
    CameraPreview that;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name = "user")
    public void setUser(TextureView textureView, @Nullable String user) {
        this.user = user;
    }

    @Override
    protected TextureView createViewInstance(final ThemedReactContext reactContext) {
        mTextureView = new TextureView(reactContext);

        mReactContext = reactContext;
        that = this;
        mTextureView.setSurfaceTextureListener(new TextureView.SurfaceTextureListener() {
            @Override
            public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int i, int i1) {
                surface = new Surface(surfaceTexture);
                mCarmera = new Camera(reactContext.getCurrentActivity(), surface, that, user);
                reportSize(i, i1);
            }

            @Override
            public void onSurfaceTextureSizeChanged(SurfaceTexture surfaceTexture, int i, int i1) {

            }

            @Override
            public boolean onSurfaceTextureDestroyed(SurfaceTexture surfaceTexture) {
                return false;
            }

            @Override
            public void onSurfaceTextureUpdated(SurfaceTexture surfaceTexture) {
            }
        });
        return mTextureView;
    }

    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "takePicture",
                TAKE_PICTURE,
                "test",
                TEST
        );
    }

    @Override
    public void receiveCommand(TextureView view, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(view, commandId, args);
        Log.d("command", "receive command " + commandId);
        if (commandId == TAKE_PICTURE) {
            mCarmera.takePicture8();
        } else if (commandId == TEST) {
            testChange();
        }
    }

    public void topChange() {
        Log.d("command", "topChange");
        WritableMap event = Arguments.createMap();
        event.putString("message", "MyMessage");
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }

    public void testChange() {
        Log.d("command", "testChange");
        WritableMap event = Arguments.createMap();
        int[] a = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0};
        event.putString("message", "test");
        WritableArray w = Arguments.fromArray(a);
        event.putArray("data", w);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }

    public void reportSize(int w, int h) {
        Log.d("command", "reportSize");
        WritableMap event = Arguments.createMap();
        event.putString("message", "reportSize");
        event.putInt("width", w);
        event.putInt("height", h);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }

    public void finishedHalfCapture(){
        Log.d("command","finishedHalfCapture");
        WritableMap event = Arguments.createMap();
        event.putString("message", "finishedHalfCapture");
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }
    public void finishedCapture(String[] filePaths) {
        Log.d("command", "finishedCapture");
        WritableMap event = Arguments.createMap();
        event.putString("message", "finishedCapture");
        WritableArray f = Arguments.createArray();
        data=new String[filePaths.length];

        for (int i = 0; i < filePaths.length; i++) {
            f.pushString(filePaths[i]);
            new Thread(new Upload(filePaths[i],i)).start();
        }
        event.putArray("filePaths", f);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }
    private void finishedFetch(){
        Log.d("command", "finishedFetch");
        WritableMap event = Arguments.createMap();
        event.putString("message", "finishedFetch");
        WritableArray f = Arguments.createArray();

        for (int i = 0; i < data.length; i++) {
            f.pushString(data[i]);
            Log.d("command",data[i]);
        }
        event.putArray("data", f);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }

    private class Upload implements Runnable {
        private String mFilePath;
        private int index;
        public Upload(String filePath,int index) {
            mFilePath = filePath;
            this.index=index;
        }

        @Override
        public void run() {
            try {
                String html = httpPost.multipartRequest("http://140.123.175.101:8000/findLandmark", "GG=In_In_der",mFilePath);
                data[index]=html;
                if(checkFinished()){
                    finishedFetch();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    private Boolean checkFinished(){
        for(int i=0;i<data.length;i++){
            if(data[i]==null){
                return false;
            }
        }
        return true;
    }
}
