#import "GatewayManager.h"
#import <React/RCTConvert.h>

#if __has_include(<Stripe/Stripe.h>)
#import <Stripe/Stripe.h>
#endif

#if __has_include(<BraintreeApplePay/BraintreeApplePay.h>)
#import <BraintreeApplePay/BraintreeApplePay.h>
#endif

@implementation GatewayManager

+ (NSArray *)getSupportedGateways
{
    NSMutableArray *supportedGateways = [NSMutableArray array];

#if __has_include(<Stripe/Stripe.h>)
    [supportedGateways addObject:@"stripe"];
#endif

#if __has_include(<BraintreeApplePay/BraintreeApplePay.h>)
    [supportedGateways addObject:@"braintree"];
#endif

    return [supportedGateways copy];
}

- (void)configureGateway:(NSDictionary *_Nonnull)gatewayParameters
      merchantIdentifier:(NSString *_Nonnull)merchantId
{
#if __has_include(<Stripe/Stripe.h>)
    if ([gatewayParameters[@"gateway"] isEqualToString:@"stripe"]) {
        [self configureStripeGateway:gatewayParameters merchantIdentifier:merchantId];
    }
#endif

#if __has_include(<BraintreeApplePay/BraintreeApplePay.h>)
    if ([gatewayParameters[@"gateway"] isEqualToString:@"braintree"]) {
        [self configureBraintreeGateway:gatewayParameters];
    }
#endif
}

- (void)createTokenWithPayment:(PKPayment *_Nonnull)payment
                    completion:(void (^_Nullable)(NSString * _Nullable token, NSError * _Nullable error))completion
{
#if __has_include(<Stripe/Stripe.h>)
    [self createStripeTokenWithPayment:payment completion:completion];
#endif

#if __has_include(<BraintreeApplePay/BraintreeApplePay.h>)
    [self createBraintreeTokenWithPayment:payment completion:completion];
#endif
}

// Stripe
- (void)configureStripeGateway:(NSDictionary *_Nonnull)gatewayParameters
            merchantIdentifier:(NSString *_Nonnull)merchantId
{
#if __has_include(<Stripe/Stripe.h>)
    NSString *stripePublishableKey = gatewayParameters[@"stripe:publishableKey"];
    [[STPPaymentConfiguration sharedConfiguration] setPublishableKey:stripePublishableKey];
    [[STPPaymentConfiguration sharedConfiguration] setAppleMerchantIdentifier:merchantId];
#endif
}


- (void)confirmCardSetup:(NSString *)secret cardParams:(NSDictionary *)cardParams completion:(void (^)(NSString * _Nullable, NSError * _Nullable))completion
{
#if __has_include(<Stripe/Stripe.h>)
    // Collect card details
    STPPaymentMethodCardParams *card = [[STPPaymentMethodCardParams alloc] init];
    card.number = [RCTConvert NSString:cardParams[@"number"]];
    card.expYear = [RCTConvert NSNumber:cardParams[@"expYear"]];
    card.expMonth = [RCTConvert NSNumber:cardParams[@"expMonth"]];
    card.cvc = [RCTConvert NSString:cardParams[@"cvc"]];
    STPPaymentMethodParams *paymentMethodParams = [STPPaymentMethodParams paramsWithCard:card billingDetails:nil metadata:nil];
    STPSetupIntentConfirmParams *setupIntentParams = [[STPSetupIntentConfirmParams alloc] initWithClientSecret:secret];
    setupIntentParams.paymentMethodParams = paymentMethodParams;

    // Confirm setup intent (authorize use of paymend method for future payments)
    STPPaymentHandler *paymentHandler = [STPPaymentHandler sharedHandler];
    [paymentHandler confirmSetupIntent:(STPSetupIntentConfirmParams *)setupIntentParams withAuthenticationContext:self completion:^(STPPaymentHandlerActionStatus status, STPSetupIntent *setupIntent, NSError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            switch (status) {
                case STPPaymentHandlerActionStatusFailed: {
                    completion(nil, error);
                    break;
                }
                case STPPaymentHandlerActionStatusCanceled: {
                    completion(nil, error);
                    break;
                }
                case STPPaymentHandlerActionStatusSucceeded: {
                    completion(setupIntent.paymentMethodID, nil);
                    break;
                }
                default:
                    break;
            }
        });
    }];
#endif
}

- (void)createStripeTokenWithPayment:(PKPayment *)payment completion:(void (^)(NSString * _Nullable, NSError * _Nullable))completion
{
#if __has_include(<Stripe/Stripe.h>)
    [[STPAPIClient sharedClient] createTokenWithPayment:payment completion:^(STPToken * _Nullable token, NSError * _Nullable error)
    {
        if (error) {
            completion(nil, error);
        } else {
            completion(token.tokenId, nil);
        }
    }];
#endif
}

// Braintree
- (void)configureBraintreeGateway:(NSDictionary *_Nonnull)gatewayParameters
{
#if __has_include(<BraintreeApplePay/BraintreeApplePay.h>)
    NSString *braintreeTokenizationKey = gatewayParameters[@"braintree:tokenizationKey"];
    self.braintreeClient = [[BTAPIClient alloc] initWithAuthorization:braintreeTokenizationKey];
#endif
}

- (void)createBraintreeTokenWithPayment:(PKPayment *_Nonnull)payment
                    completion:(void (^_Nullable)(NSString * _Nullable token, NSError * _Nullable error))completion
{
#if __has_include(<BraintreeApplePay/BraintreeApplePay.h>)
    BTApplePayClient *applePayClient = [[BTApplePayClient alloc]
                                        initWithAPIClient:self.braintreeClient];

    [applePayClient tokenizeApplePayPayment:payment
                                 completion:^(BTApplePayCardNonce *tokenizedApplePayPayment,
                                              NSError *error)
    {


        if (error) {

            completion(nil, error);
        } else {

            completion(tokenizedApplePayPayment.nonce, nil);
        }
    }];
#endif
}

- (UIViewController *)authenticationPresentingViewController
{
    return RCTPresentedViewController();
}

@end
