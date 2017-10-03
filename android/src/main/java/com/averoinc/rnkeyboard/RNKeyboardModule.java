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

    private View createCustomKeyboard(Activity activity, int tag, String type) {
        RelativeLayout layout = new RelativeLayout(activity);
        ReactRootView rootView = new ReactRootView(this.getReactApplicationContext());
        rootView.setBackgroundColor(Color.WHITE);

        Bundle bundle = new Bundle();
        bundle.putInt("inputId", tag);
        bundle.putString("keyboardName", type);
        rootView.startReactApplication(
                ((ReactApplication) activity.getApplication()).getReactNativeHost().getReactInstanceManager(),
                "CustomKeyboard",
                bundle);

        final float scale = activity.getResources().getDisplayMetrics().density;
        RelativeLayout.LayoutParams lParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, Math.round(216*scale));
        lParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
        layout.addView(rootView, lParams);
        return layout;
    }

    @Override
    public String getName() {
        return "RNKeyboard";
    }

    @ReactMethod
    public void install(final int viewId, final String keyboardName) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        final Activity activity = getCurrentActivity();

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View view = nativeViewHierarchyManager.resolveView(viewId);
                if (view instanceof ReactEditText) {
                    ReactEditText editText = (ReactEditText) view;
                    final View keyboard = createCustomKeyboard(activity, viewId, keyboardName);
                    final View.OnFocusChangeListener currentListener = editText.getOnFocusChangeListener();
                    editText.setShowSoftInputOnFocus(false);
                    editText.setOnFocusChangeListener(new View.OnFocusChangeListener() {

                        @Override
                        public void onFocusChange(View v, boolean hasFocus) {
                            currentListener.onFocusChange(v, hasFocus);
                            if (hasFocus && keyboard.getParent() == null) {
                                activity.addContentView(keyboard, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                            } else if (!hasFocus && keyboard.getParent() != null){
                                ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                            }
                        }
                    });
                }
            }
        });
    }

    @ReactMethod
    public void uninstall(final int inputId) {
        
    }

    @ReactMethod
    public void insertText(final int viewId, final String text) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        final Activity activity = getCurrentActivity();

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View view = nativeViewHierarchyManager.resolveView(viewId);
                if (view instanceof ReactEditText) {
                    ReactEditText editText = (ReactEditText) view;
                    int start = Math.min(editText.getSelectionStart(), editText.getSelectionEnd());
                    int end = Math.max(editText.getSelectionStart(), editText.getSelectionEnd());
                    editText.getText().replace(start, end, text);
                }
            }
        });
    }

    @ReactMethod
    public void deleteBackward(final int viewId) {
        UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
        final Activity activity = getCurrentActivity();

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View view = nativeViewHierarchyManager.resolveView(viewId);
                if (view instanceof ReactEditText) {
                    ReactEditText editText = (ReactEditText) view;
                    int start = Math.min(editText.getSelectionStart(), editText.getSelectionEnd());
                    int end = Math.max(editText.getSelectionStart(), editText.getSelectionEnd());
                    if(start == end && start > 0) {
                        editText.getText().replace(start-1, start, "");
                    } else {
                        editText.getText().replace(start, end, "");
                    }
                }
            }
        });
    }
}