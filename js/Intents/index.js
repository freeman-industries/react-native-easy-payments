import { NativeModules, Platform } from 'react-native';

const { ReactNativePayments } = NativeModules;

const IS_ANDROID = Platform.OS === 'android';

const Intents = {
	savePaymentMethod(methodData, cardParams) {
		return new Promise((resolve, reject) => {
		  if (IS_ANDROID) {
			return resolve();
		  }
	
		  ReactNativePayments.savePaymentMethod(
			methodData,
			cardParams,
			(err, data) => {
			  if (err) return reject(err);
	
			  resolve(data);
			}
		  );
		});
	  }
}

export { Intents };