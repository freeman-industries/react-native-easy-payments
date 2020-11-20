package freeman.reactnativeeasypayments;

import android.app.Activity;

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
import com.stripe.android.Stripe;
import com.stripe.android.model.PaymentMethodCreateParams;
import com.stripe.android.model.ConfirmSetupIntentParams;

public class GatewayManager {
    private Stripe stripeClient;

    public WritableNativeArray getSupportedGateways() {
        WritableNativeArray supportedGateways = new WritableNativeArray();

        supportedGateways.pushString("stripe");

        return supportedGateways;
    }

    public void configureGateway(ReadableMap gatewayParameters, ReactApplicationContext context) {
        String gateway = gatewayParameters.getString("gateway");

        if (gateway == "stripe") {
            configureStripeGateway(gatewayParameters, context);
        }
    }

    private void configureStripeGateway(ReadableMap gatewayParameters, ReactApplicationContext context) {
        String stripePublishableKey = gatewayParameters.getString("stripe:publishableKey");

        PaymentConfiguration.init(context.getApplicationContext(), stripePublishableKey);

        stripeClient = new Stripe(context.getApplicationContext(), stripePublishableKey);
    }

    public void confirmSetupIntent(String clientSecret, ReadableMap cardParams, Callback callback, Activity activity) {
        PaymentMethodCreateParams.Card card = new PaymentMethodCreateParams.Card();
        card = card.copy(cardParams.getString("number"), cardParams.getInt("expMonth"), cardParams.getInt("expYear"),
                cardParams.getString("cvc"), null, null);

        PaymentMethodCreateParams paymentMethodParams = PaymentMethodCreateParams.create(card);

        ConfirmSetupIntentParams confirmParams = ConfirmSetupIntentParams.create(paymentMethodParams, clientSecret);

        stripeClient.confirmSetupIntent(activity, confirmParams);
    }
}