package com.eyecare;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureFailure;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.CaptureResult;
import android.hardware.camera2.TotalCaptureResult;
import android.media.Image;
import android.media.ImageReader;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.view.Surface;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Arrays;

/**
 * Created by wl00887404 on 2017/5/11.
 */


public class BackgroundCamera extends Service {
    private Handler handler = new Handler();
    private HandlerThread mBackgroundThread;
    private Handler mBackgroundHandler;

    NotificationManager manager;
    NotificationCompat.Builder builder;
    PendingIntent pendingIntent;

    SurfaceTexture mDummyPreview;
    Surface mDummySurface;
    ImageReader mImageReader;
    CameraManager mCameraManager;
    CameraDevice mCameraDevice;
    CameraCaptureSession mCaptureSession;

    double mThreshold;
    String mUser;
    int mIndex;

    private CaptureRequest.Builder mPreviewRequestBuilder;
    private CaptureRequest mPreviewRequest;

    String mCameraId;
    File mFile;
    int times;
    BackgroundCamera that;
    boolean stop=false;

    /*
    * Callbacks
    * */

    private final ImageReader.OnImageAvailableListener mOnImageAvailableListener = new ImageReader.OnImageAvailableListener() {

        @Override
        public void onImageAvailable(ImageReader reader) {

            mFile = new File(getExternalFilesDir(null),  mUser+"-"+ times + ".yuv");
            mBackgroundHandler.post(new ImageSaver(reader.acquireNextImage(), mFile));
            times += 1;
        }

    };

    private final CameraDevice.StateCallback mStateCallback = new CameraDevice.StateCallback() {

        @Override
        public void onOpened(@NonNull CameraDevice cameraDevice) {
            mCameraDevice = cameraDevice;
            createCameraSession();
        }

        @Override
        public void onDisconnected(@NonNull CameraDevice cameraDevice) {
            cameraDevice.close();
            stopBackgroundThread();
            mCameraDevice = null;
        }

        @Override
        public void onError(@NonNull CameraDevice cameraDevice, int error) {
            cameraDevice.close();
            mCameraDevice = null;
        }

    };

    private CameraCaptureSession.CaptureCallback mCaptureCallback = new CameraCaptureSession.CaptureCallback() {

        @Override
        public void onCaptureProgressed(@NonNull CameraCaptureSession session, @NonNull CaptureRequest request, @NonNull CaptureResult partialResult) {
        }

        @Override
        public void onCaptureCompleted(@NonNull CameraCaptureSession session, @NonNull CaptureRequest request, @NonNull TotalCaptureResult result) {

        }

    };

    /*
    * Service Override
    * */

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        that = this;
        handler.post(showNotification);
        manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        builder = new NotificationCompat.Builder(this);
        handler.postDelayed(showNoBlink,15000);
        mDummyPreview = new SurfaceTexture(1);
        mDummySurface = new Surface(mDummyPreview);
        Bundle bundle=intent.getExtras();
        mThreshold=bundle.getDouble("threshold");
        mUser=bundle.getString("user");
        mIndex=bundle.getInt("index");
        Log.d("setTest",mThreshold+""+mUser+""+mIndex);
        startBackgroundThread();
//        openCamera();

        Intent myIntent = new Intent(this, MainActivity.class);
        pendingIntent = PendingIntent.getActivity(this, 0, myIntent, Intent.FILL_IN_ACTION);

        Log.d("start backgroud", "is started");

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        manager.cancel(87);
        handler.removeCallbacks(showNotification);
        stop=true;
//        closeCamera();

        //super.onDestroy();
    }

    private Runnable showNotification = new Runnable() {
        public void run() {

            builder.setSmallIcon(R.drawable.ic_stat_name)
                    .setWhen(System.currentTimeMillis())
                    .setContentTitle("loveEye")
                    .setContentIntent(pendingIntent)
                    .setContentText("用眼情況監測中")
                    .setOngoing(true);
            Notification notification = builder.build();
            manager.notify(87, notification);
        }
    };


    private Runnable showOverTime = new Runnable() {
        public void run() {

            builder.setSmallIcon(R.drawable.ic_stat_name)
                    .setWhen(System.currentTimeMillis())
                    .setContentTitle("lovEye")
                    .setContentIntent(pendingIntent)
                    .setContentText("你已經用眼超過30分鐘了")
                    .setDefaults(Notification.DEFAULT_SOUND)
                    .setOngoing(false);
            Notification notification = builder.build();
            manager.notify(88, notification);
        }
    };
    private Runnable showNoBlink = new Runnable() {
        public void run() {

            builder.setSmallIcon(R.drawable.ic_stat_name)
                    .setWhen(System.currentTimeMillis())
                    .setContentTitle("lovEye")
                    .setContentIntent(pendingIntent)
                    .setContentText("眼睛疲勞狀態不佳，請斟酌休息")
                    .setDefaults(Notification.DEFAULT_SOUND)
                    .setOngoing(false);

            Notification notification = builder.build();
            manager.notify(89, notification);
        }
    };

    private void adjustBrightness() {
        Settings.System.putInt(getContentResolver(), android.provider.Settings.System.SCREEN_BRIGHTNESS, 0);
    }
    int delayTime = 1000 / 10;
    private Runnable takePicture = new Runnable() {
        public void run() {
            if(!stop){
                captureStillPicture();

            }
        }
    };
    private Runnable takePicture4 = new Runnable() {
        public void run() {
            handler.post(takePicture);
            handler.postDelayed(takePicture4, delayTime);
        }
    };
    private Runnable takePicture8 = new Runnable() {
        public void run() {
            Toast.makeText(that, "開始啟動背景程序", Toast.LENGTH_LONG).show();
            stopPreview();
                handler.post(takePicture);
                handler.postDelayed(takePicture4, delayTime);

        }
    };

    /*
    * Camera
    * */

    private void openCamera() {
        try {
            setUpCameraOutputs();
            if (mCameraId != null) {
                mCameraManager.openCamera(mCameraId, mStateCallback, mBackgroundHandler);
            } else {
                throw new NullPointerException("mCameraId is null");
            }
        } catch (CameraAccessException | SecurityException | NullPointerException e) {
            e.printStackTrace();
        }
    }
    private void stopBackgroundThread() {
        mBackgroundThread.quitSafely();
        try {
            mBackgroundThread.join();
            mBackgroundThread = null;
            mBackgroundHandler = null;
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    private void closeCamera() {
            if (null != mCaptureSession) {
                mCaptureSession.close();
                mCaptureSession = null;
            }
            if (null != mCameraDevice) {
                mCameraDevice.close();
                mCameraDevice = null;
            }
            if (null != mImageReader) {
                mImageReader.close();
                mImageReader = null;
            }
    }

    private void setUpCameraOutputs() {
        mCameraManager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
        try {
            for (String cameraId : mCameraManager.getCameraIdList()) {
                CameraCharacteristics characteristics = mCameraManager.getCameraCharacteristics(cameraId);

                Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
                if (facing != null && facing != CameraCharacteristics.LENS_FACING_FRONT) {
                    continue;
                }

                mImageReader = ImageReader.newInstance(320, 240, ImageFormat.YUV_420_888, 5000);
                mImageReader.setOnImageAvailableListener(mOnImageAvailableListener, mBackgroundHandler);
                mCameraId = cameraId;
                return;
            }
        } catch (CameraAccessException | NullPointerException e) {
            e.printStackTrace();
        }
    }

    private void createCameraSession() {
        try {

            mCameraDevice.createCaptureSession(
                    Arrays.asList(mDummySurface, mImageReader.getSurface()),
                    new CameraCaptureSession.StateCallback() {

                        @Override
                        public void onConfigured(@NonNull CameraCaptureSession cameraCaptureSession) {

                            mCaptureSession = cameraCaptureSession;
                            handler.postDelayed(takePicture8,8);
                            try {
                                mPreviewRequestBuilder = mCameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
                                mPreviewRequestBuilder.addTarget(mDummySurface);
                                mPreviewRequest = mPreviewRequestBuilder.build();
                                startPreview();
                            } catch (CameraAccessException e) {
                                e.printStackTrace();
                            }

                        }

                        @Override
                        public void onConfigureFailed(@NonNull CameraCaptureSession cameraCaptureSession) {
                        }
                    },
                    null
            );
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void startPreview() {
        try {
            mCaptureSession.setRepeatingRequest(mPreviewRequest, mCaptureCallback, mBackgroundHandler);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }

    }

    private void stopPreview() {
        try {
            mCaptureSession.stopRepeating();
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }

    }

    private void captureStillPicture() {
        try {

            CaptureRequest.Builder captureBuilder = mCameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            captureBuilder.addTarget(mImageReader.getSurface());

            CameraCaptureSession.CaptureCallback CaptureCallback = new CameraCaptureSession.CaptureCallback() {

                @Override
                public void onCaptureCompleted(@NonNull CameraCaptureSession session, @NonNull CaptureRequest request, @NonNull TotalCaptureResult result) {
                    Log.d("capture", times + " is captured");
                }

                @Override
                public void onCaptureFailed(CameraCaptureSession session, CaptureRequest request, CaptureFailure failure) {
                    Log.d("capture", "failure");
                }
            };

            mCaptureSession.capture(captureBuilder.build(), CaptureCallback, null);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    /*
    * Function
    * */


    private void startBackgroundThread() {
        mBackgroundThread = new HandlerThread("CameraBackground");
        mBackgroundThread.start();
        mBackgroundHandler = new Handler(mBackgroundThread.getLooper());
    }

    /*
    * Inner Class
    * */

    private class ImageSaver implements Runnable {
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
            mBackgroundHandler.post(new Upload(mFile.getPath()));
        }

    }
    private class Upload implements Runnable {
        private String mFilePath;
//        private int index;
        public Upload(String filePath) {
            mFilePath = filePath;
//            this.index=index;
        }

        @Override
        public void run() {
            try {
                String html = httpPost.multipartRequest("http://140.123.175.101:8000/isBlink", "index="+mIndex+"&threshold="+mThreshold+"&GG=In_In_der",mFilePath);
                Log.d("get Data",html);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
