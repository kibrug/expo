package abi45_0_0.host.exp.exponent.modules.api.reanimated;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;
import abi45_0_0.com.facebook.react.bridge.GuardedRunnable;
import abi45_0_0.com.facebook.react.bridge.ReactApplicationContext;
import abi45_0_0.com.facebook.react.bridge.UiThreadUtil;
import java.util.concurrent.atomic.AtomicBoolean;

public class Scheduler {

  @DoNotStrip
  @SuppressWarnings("unused")
  private final HybridData mHybridData;

  private final ReactApplicationContext mContext;
  private final AtomicBoolean mActive = new AtomicBoolean(true);

  private final Runnable mUIThreadRunnable =
      new Runnable() {
        @Override
        public void run() {
          if (mActive.get()) {
            triggerUI();
          }
        }
      };

  public Scheduler(ReactApplicationContext context) {
    mHybridData = initHybrid();
    mContext = context;
  }

  private native HybridData initHybrid();

  public native void triggerUI();

  @DoNotStrip
  private void scheduleOnUI() {
    UiThreadUtil.runOnUiThread(
        new GuardedRunnable(mContext.getExceptionHandler()) {
          public void runGuarded() {
            mUIThreadRunnable.run();
          }
        });
  }

  public void deactivate() {
    mActive.set(false);
  }
}
