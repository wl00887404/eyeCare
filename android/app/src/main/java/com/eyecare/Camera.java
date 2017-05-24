package com.eyecare;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureFailure;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.TotalCaptureResult;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.Image;
import android.media.ImageReader;
import android.media.MediaActionSound;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.util.Size;
import android.util.SparseIntArray;
import android.view.Surface;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.net.ssl.HttpsURLConnection;

/**
 * Created by wl00887404 on 2017/5/10.
 */

public class Camera {
    private int testTimes=5;
    private int times;
    private Handler handler = new Handler();
    private int mSensorOrientation;
    CameraManager mCameraManager;
    private HandlerThread mBackgroundThread;
    private Handler mBackgroundHandler;
    CameraDevice mCameraDevice;
    private CaptureRequest.Builder mPreviewRequestBuilder;
    private CaptureRequest mPreviewRequest;
    CameraCaptureSession mCaptureSession;
    private ImageReader mImageReader;
    private File mFile;
    Activity activity;
    Surface surface;
    MediaActionSound sound;
    CameraPreview that;
    String user;
    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();
    String[] filePaths;
    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }


    /*
    * Callback
    *
    * */

    private final ImageReader.OnImageAvailableListener mOnImageAvailableListener = new ImageReader.OnImageAvailableListener() {

        @Override
        public void onImageAvailable(ImageReader reader) {
            mFile = new File(activity.getExternalFilesDir(null),user+ times + ".jpg");
            filePaths[times]=mFile.getAbsolutePath();
            mBackgroundHandler.post(new ImageSaver(reader.acquireNextImage(), mFile));
//            mBackgroundHandler.post(new Upload(reader.acquireNextImage(), user+ times + ".jpg"));
            times += 1;
    }

    };


    private final CameraDevice.StateCallback mStateCallback = new CameraDevice.StateCallback() {

        @Override
        public void onOpened(@NonNull CameraDevice cameraDevice) {
            mCameraDevice = cameraDevice;
            createCameraPreviewSession();
        }

        @Override
        public void onDisconnected(@NonNull CameraDevice cameraDevice) {
            cameraDevice.close();
            mCameraDevice = null;
        }

        @Override
        public void onError(@NonNull CameraDevice cameraDevice, int error) {
            cameraDevice.close();
            mCameraDevice = null;
        }

    };
    private CameraCaptureSession.CaptureCallback mCaptureCallback = new CameraCaptureSession.CaptureCallback() {
    };

    public Camera(Activity activity, Surface surface,CameraPreview that,String user) {
        this.activity = activity;
        this.surface = surface;
        times = 0;
        getPermission();
        startBackgroundThread();
        openCamera();
        sound=new MediaActionSound();
        sound.load(MediaActionSound.SHUTTER_CLICK);
        this.that=that;
        this.user=user;
        this.filePaths=new String[testTimes*2];
    }

    private void getPermission() {
        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.CAMERA}, 0);
        }
        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 0);
        }
        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 0);
        }
    }




    /*
    *
    * Camera
    *
    * */

    private void openCamera() {
        String cameraId = setUpCameraOutputs();
        try {
            mCameraManager.openCamera(cameraId, mStateCallback, mBackgroundHandler);
        } catch (CameraAccessException | SecurityException e) {
            e.printStackTrace();
        }
    }

    private void createCameraPreviewSession() {
        try {

            mCameraDevice.createCaptureSession(
                    Arrays.asList(surface, mImageReader.getSurface()),
                    new CameraCaptureSession.StateCallback() {

                        @Override
                        public void onConfigured(@NonNull CameraCaptureSession cameraCaptureSession) {
                            mCaptureSession = cameraCaptureSession;
                            startPreview();
                        }

                        @Override
                        public void onConfigureFailed(@NonNull CameraCaptureSession cameraCaptureSession) {
                        }
                    }, null
            );
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private String setUpCameraOutputs() {
        mCameraManager = (CameraManager) activity.getSystemService(Context.CAMERA_SERVICE);
        try {
            for (String cameraId : mCameraManager.getCameraIdList()) {
                CameraCharacteristics characteristics = mCameraManager.getCameraCharacteristics(cameraId);

                Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
                if (facing != null && facing != CameraCharacteristics.LENS_FACING_FRONT) {
                    continue;
                }

                mImageReader = ImageReader.newInstance(640, 480, ImageFormat.JPEG, testTimes);
                mImageReader.setOnImageAvailableListener(mOnImageAvailableListener, mBackgroundHandler);

                mSensorOrientation = characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION);


                return cameraId;
            }
        } catch (CameraAccessException | NullPointerException e) {
            e.printStackTrace();
        }
        return null;
    }


    private void startBackgroundThread() {
        mBackgroundThread = new HandlerThread("CameraBackground");
        mBackgroundThread.start();
        mBackgroundHandler = new Handler(mBackgroundThread.getLooper());
    }


    private void startPreview() {
        try {
            mPreviewRequestBuilder = mCameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            mPreviewRequestBuilder.addTarget(surface);
            mPreviewRequest = mPreviewRequestBuilder.build();
            mCaptureSession.setRepeatingRequest(mPreviewRequest, mCaptureCallback, mBackgroundHandler);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private Runnable startPreview = new Runnable() {
        @Override
        public void run() {
            startPreview();
        }
    };

    private void stopPreview() {
        try {
            mCaptureSession.stopRepeating();
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private Runnable stopPreview = new Runnable() {
        @Override
        public void run() {
            stopPreview();
        }
    };

    private static class ImageSaver implements Runnable {
        private final Image mImage;
        private final File mFile;

        public ImageSaver(Image image, File file) {
            mImage = image;
            mFile = file;
        }

        @Override
        public void run() {
            ByteBuffer buffer = mImage.getPlanes()[0].getBuffer();
            byte[] bytes = new byte[buffer.remaining()];
            buffer.get(bytes);
            FileOutputStream output = null;
            try {
                output = new FileOutputStream(mFile);
                output.write(bytes);
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                mImage.close();
                if (null != output) {
                    try {
                        output.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

    }

    public void takePicture8() {
//        int delayTime = 1000 / 500;
        stopPreview();
//        for(int i=0;i<testTimes;i++){
//            handler.postDelayed(takePicture, i* delayTime);
//        }
        handler.post(takePicture);
    }

    private Runnable takePicture = new Runnable() {
        public void run() {
            captureStillPicture();
        }
    };


    private void captureStillPicture() {
        try {


            final CaptureRequest.Builder captureBuilder = mCameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_STILL_CAPTURE);
            captureBuilder.addTarget(mImageReader.getSurface());

            int rotation = activity.getWindowManager().getDefaultDisplay().getRotation();

            captureBuilder.set(CaptureRequest.JPEG_ORIENTATION, getOrientation(rotation));
            CaptureRequest c=captureBuilder.build();
            List<CaptureRequest> cList=new ArrayList<CaptureRequest>();
            for(int i=0;i<testTimes;i++){
                cList.add(c);
            }
            CameraCaptureSession.CaptureCallback CaptureCallback
                    = new CameraCaptureSession.CaptureCallback() {
                @Override
                public void onCaptureCompleted(@NonNull CameraCaptureSession session, @NonNull CaptureRequest request, @NonNull TotalCaptureResult result) {
                    Log.d("capture",times+"capture is succed");
                    sound.play(MediaActionSound.SHUTTER_CLICK);
                    if(times==testTimes){
                        that.finishedHalfCapture();
                    }
                    if(times==testTimes*2){
                        that.finishedCapture(filePaths);
                    }
                }

                @Override
                public void onCaptureFailed(CameraCaptureSession session, CaptureRequest request, CaptureFailure failure) {
                }
            };
//            sound.play(MediaActionSound.SHUTTER_CLICK);
            mCaptureSession.captureBurst(cList, CaptureCallback, null);
            startPreview();
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private int getOrientation(int rotation) {
        return (ORIENTATIONS.get(rotation) + mSensorOrientation + 270) % 360;
    }


}
