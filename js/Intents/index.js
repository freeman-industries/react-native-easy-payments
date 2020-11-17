import { NativeModules, Platform } from 'react-native';

const { ReactNativePayments } = NativeModules;

// we use this quick method to ensure that all the values inside the object are strings, which can cause some crashes with the Stripe SDK and strict types in Objective-C.
const stringifyObject = obj => {
  const result = {};

  for (const key in obj) {
    result[key] = obj[key] + '';
  }

  return result;
};

export async function savePaymentMethod(
  methodData,
  cardParams = {},
  // billingDetails = {},
  // metadata = {},
) {
  switch (Platform.OS) {
    case 'ios':
    case 'android':
      return new Promise((resolve, reject) => {
        const sanitizedCardParams = stringifyObject(cardParams);
        // const sanitizedBillingDetails = stringifyObject(billingDetails);
        // const sanitizedMetadata = stringifyObject(metadata);

        // stripe iOS SDK mostly takes things as strings, apart from the following params which need to be numbers.
        if (sanitizedCardParams['expMonth']) sanitizedCardParams['expMonth'] = parseInt(sanitizedCardParams['expMonth']);
        if (sanitizedCardParams['expYear']) sanitizedCardParams['expYear'] = parseInt(sanitizedCardParams['expYear']);

        ReactNativePayments.savePaymentMethod(
          methodData,
          sanitizedCardParams,
          // sanitizedBillingDetails,
          // sanitizedMetadata,
          (err, data) => {
            if (err) return reject(err);
    
            resolve(data);
          },
        );
      });
  }
}

export async function confirmPayment(
  methodData,
  paymentParams,
) {
  // TODO extra fields and sanitize

  switch (Platform.OS) {
    case 'ios':
      return new Promise((resolve, reject) => {
        ReactNativePayments.confirmPayment(
          methodData,
          stringifyObject(paymentParams),
          (err, data) => {
            if (err) return reject(err);
      
            resolve(data);
          },
        );
      });
  }
}
