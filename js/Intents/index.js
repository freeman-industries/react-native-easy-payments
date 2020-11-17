import { NativeModules, Platform } from 'react-native';

const { ReactNativePayments } = NativeModules;

const IS_ANDROID = Platform.OS === 'android';

// we use this quick method to ensure that all the values inside the object are strings, which can cause some crashes with the Stripe SDK and strict types in Objective-C.
const stringifyObject = obj => {
  for (const key in obj) {
    obj[key] += '';
  }

  return obj;
};

export async function savePaymentMethod(
  methodData,
  cardParams,
) {
  if (IS_ANDROID) return;

  return new Promise((resolve, reject) => {
    ReactNativePayments.savePaymentMethod(
      methodData,
      stringifyObject(cardParams),
      (err, data) => {
        if (err) return reject(err);

        resolve(data);
      },
    );
  });
}

export async function confirmPayment(methodData, paymentParams) {
  if (IS_ANDROID) return;
  
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
