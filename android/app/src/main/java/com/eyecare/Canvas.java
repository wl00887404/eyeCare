package com.eyecare;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.SurfaceTexture;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.Surface;
import android.view.TextureView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import static java.security.AccessController.getContext;

/**
 * Created by wl00887404 on 2017/5/11.
 */

public class Canvas extends SimpleViewManager<TextureView> {
    private static final Integer GET_CONTEXT = 0;
    private static final Integer SET_FILLSTYLE = 1;
    private static final Integer SET_STROKESTYLE = 2;
    private static final Integer FILL_RECT = 3;
    private static final Integer STROKE_RECT = 4;
    private static final Integer CLEAR_RECT = 5;
    private static final Integer FILL = 6;
    private static final Integer STROKE = 7;
    private static final Integer BEGIN_PATH = 8;
    private static final Integer MOVE_TO = 9;
    private static final Integer LINE_TO = 10;
    private static final Integer END_PATH = 11;
    private static final Integer SET_LINE_WIDTH = 12;
    private static final Integer FINISH = 13;
    private static final Integer RESET = 14;

    private Bitmap bitmap;
    android.graphics.Canvas mCanvas;
    private Surface mSurface;
    private Paint mPaintF;
    private Paint mPaintS;
    private Path mPath;
    TextureView mTextureView;
    ThemedReactContext mReactContext;
    int mWidth;
    int mHeight;
    public static final String REACT_CLASS = "Canvas";

    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @Override
    protected TextureView createViewInstance(final ThemedReactContext reactContext) {
        Canvas that = this;
        mTextureView = new TextureView(reactContext);
        mTextureView.setOpaque(false);
        mTextureView.setSurfaceTextureListener(new TextureView.SurfaceTextureListener() {
            @Override
            public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int i, int i1) {
                mSurface = new Surface(surfaceTexture);
                mReactContext = reactContext;
//                bitmap = Bitmap.createBitmap(i, i1, Bitmap.Config.ARGB_8888);
//                mCanvas = new android.graphics.Canvas(bitmap);
                mPaintF = new Paint();
                mPaintF.setStyle(Paint.Style.FILL);
                mPaintF.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC));
                mPaintS = new Paint();
                mPaintS.setStyle(Paint.Style.STROKE);
                mPaintS.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC));
                mPaintS.setStrokeWidth((float) 1);
                mWidth=i;
                mHeight=i1;

//                getContext();
//                setFillStyle(255,0,0,1);
//                fillRect(0,0,500,500);

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
        Map<String, Integer> m = MapBuilder.of();
        m.put("getContext", GET_CONTEXT);
        m.put("fillStyle", SET_FILLSTYLE);
        m.put("strokeStyle", SET_STROKESTYLE);
        m.put("fillRect", FILL_RECT);
        m.put("strokeRect", STROKE_RECT);
        m.put("clearRect", CLEAR_RECT);
        m.put("fill", FILL);
        m.put("stroke", STROKE);
        m.put("beginPath", BEGIN_PATH);
        m.put("moveTo", MOVE_TO);
        m.put("lineTo", LINE_TO);
        m.put("endPath", END_PATH);
        m.put("lineWidth", SET_LINE_WIDTH);
        m.put("finish",FINISH);
        m.put("reset",RESET);
        return m;
    }

    @Override
    public void receiveCommand(TextureView view, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(view, commandId, args);
        Log.d("command",""+commandId);
        if (commandId == GET_CONTEXT) {
            getContext();
        } else if (commandId == SET_FILLSTYLE) {
            setFillStyle(args.getInt(0), args.getInt(1), args.getInt(2),  (float)args.getDouble(3));
        } else if (commandId == SET_STROKESTYLE) {
            setStrokeStyle(args.getInt(0), args.getInt(1), args.getInt(2), (float) args.getDouble(3));
        } else if (commandId == FILL_RECT) {
            fillRect(Float.parseFloat(args.getString(0)), Float.parseFloat(args.getString(1)), Float.parseFloat(args.getString(2)), Float.parseFloat(args.getString(3)));
        } else if (commandId == STROKE_RECT) {
            strokeRect(Float.parseFloat(args.getString(0)), Float.parseFloat(args.getString(1)), Float.parseFloat(args.getString(2)), Float.parseFloat(args.getString(3)));
        } else if (commandId == CLEAR_RECT) {
            clearRect(Float.parseFloat(args.getString(0)), Float.parseFloat(args.getString(1)), Float.parseFloat(args.getString(2)), Float.parseFloat(args.getString(3)));
        } else if (commandId == FILL) {
            fill();
        } else if (commandId == STROKE) {
            stroke();
        } else if (commandId == BEGIN_PATH) {
            beginPath();
        } else if (commandId == MOVE_TO) {
            moveTo((float) args.getDouble(0), (float) args.getDouble(1));
        } else if (commandId == LINE_TO) {
            lineTo((float) args.getDouble(0), (float) args.getDouble(1));
        } else if (commandId == END_PATH) {
            endPath();
        } else if (commandId == SET_LINE_WIDTH) {
            setLineWidth((float) args.getDouble(0));
        }else if(commandId==FINISH){
            update();
        }
        else if(commandId==RESET){
            reset();
        }
    }

    public void setFillStyle(int r, int g, int b, float a) {
        mPaintF.setColor(Color.argb(Math.round(a * 255), r, g, b));
    }

    public void setStrokeStyle(int r, int g, int b, float a) {
        Log.d("color",""+a);
        mPaintS.setColor(Color.argb(Math.round(a * 255), r, g, b));
    }

    public void setLineWidth(float lineWidth) {
        mPaintS.setStrokeWidth(lineWidth);
    }

    public void fillRect(float x, float y, float w, float h) {
        mCanvas.drawRect(x, y, x + w, y + h, mPaintF);
        update();
    }

    public void strokeRect(float x, float y, float w, float h) {
        mCanvas.drawRect(x, y, x + w, y + h, mPaintF);
        update();
    }

    public void clearRect(float x, float y, float w, float h) {
        Paint p = new Paint();
        p.setStyle(Paint.Style.FILL);
        p.setColor(Color.TRANSPARENT);
        p.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));
        mCanvas.drawRect(x, y, x + w, y + h, p);
    }
    public void reset() {
    }
    public void fill() {
        mCanvas.drawPath(mPath, mPaintF);
    }

    public void stroke() {
        mCanvas.drawPath(mPath, mPaintS);
    }

    public void getContext() {
        mCanvas = mSurface.lockCanvas(null);
        mCanvas.drawColor(Color.TRANSPARENT,PorterDuff.Mode.CLEAR);
    }

    public void update() {
//      android.graphics.Canvas canvas = mSurface.lockCanvas(null);
//      canvas.drawBitmap(bitmap,0,0,null);
        android.graphics.Canvas canvas = mCanvas;
        mSurface.unlockCanvasAndPost(canvas);
    }

    public void beginPath() {
        mPath = new Path();
    }

    public void moveTo(float x, float y) {
        mPath.moveTo(x, y);
    }

    public void lineTo(float x, float y) {
        mPath.lineTo(x, y);
    }

    public void endPath() {
        mPath.close();
    }

    public void reportSize(int w, int h) {
        Log.d("command", "reportSize");
        WritableMap event = Arguments.createMap();
        event.putString("message", "reportSize");
        event.putInt("width", w);
        event.putInt("height", h);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mTextureView.getId(), "topChange", event);
    }
}
