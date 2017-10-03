package com.averoinc.rnkeyboard;

import android.annotation.TargetApi;
import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.RelativeLayout;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.UIViewOperationQueue;
import com.facebook.react.views.textinput.ReactEditText;

import java.lang.annotation.Target;

public class RNKeyboardModule extends ReactContextBaseJavaModule {

    public RNKeyboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNKeyboard";
    }

    @ReactMethod
    public void disableNativeKeyboard(final int viewId) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        final Activity activity = getCurrentActivity();

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View view = nativeViewHierarchyManager.resolveView(viewId);
                if (view instanceof ReactEditText) {
                    ReactEditText editText = (ReactEditText) view;
                    editText.setInputType(InputType.TYPE_NULL);
                    // final View keyboard = createCustomKeyboard(activity, viewId, keyboardName);
                    // final View.OnFocusChangeListener currentListener = editText.getOnFocusChangeListener();
                    // editText.setShowSoftInputOnFocus(false);
                    // editText.setOnFocusChangeListener(new View.OnFocusChangeListener() {

                    //     @Override
                    //     public void onFocusChange(View v, boolean hasFocus) {
                    //         currentListener.onFocusChange(v, hasFocus);
                    //         if (hasFocus && keyboard.getParent() == null) {
                    //             activity.addContentView(keyboard, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                    //         } else if (!hasFocus && keyboard.getParent() != null){
                    //             ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                    //         }
                    //     }
                    // });
                }
            }
        });
    }

    @ReactMethod
    public void playInputClick(final int viewId) {
        
    }
}