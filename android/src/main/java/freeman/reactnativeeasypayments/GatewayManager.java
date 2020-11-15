package freeman.reactnativeeasypayments;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactBridge;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.stripe.android.PaymentConfiguration;

public class GatewayManager {
    public WritableNativeArray getSupportedGateways() {
        WritableNativeArray supportedGateways = new WritableNativeArray();

        supportedGateways.pushString("stripe");

        return supportedGateways;
    }

  public void configureGateway(ReadableMap gatewayParameters, ReactApplicationContext context) {
      String gateway = gatewayParameters.getString("gateway");

      if(gateway === "stripe") {
        configureStripeGateway(gatewayParameters, merchantIdentifier, context);
      }
  }

    private void configureStripeGateway(ReadableMap gatewayParameters, ReactApplicationContext context) {
        String stripePublishableKey = gatewayParameters.getString("stripe:publishableKey");

        PaymentConfiguration.init(context.getApplicationContext(), stripePublishableKey);
    }
}