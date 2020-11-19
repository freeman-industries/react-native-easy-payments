const { mockedNativeModules } = require("../__mocks__/ReactNative");

jest.mock('react-native', () => mockedNativeModules);
const { NativeModules, Platform } = require('react-native');

const { savePaymentMethod, confirmPayment } = require("..");

const methodData = [
  {
    supportedMethods: ['apple-pay'],
    data: {
      merchantId: '12345',
    },
  },
];

const perfectCardParams = {
  number: '2174621904721841',
  expYear: 32,
  expMonth: 1,
  cvc: '191',
};

const stringifiedCardParams = {
  number: '2174621904721841',
  expYear: '32',
  expMonth: '1',
  cvc: '191',
};

const unstringifiedCardParams = {
  number: 2174621904721841,
  expYear: 32,
  expMonth: 1,
  cvc: 191,
};

const sanitisedCardParams = {
  ...stringifiedCardParams,
  expMonth: 1,
  expYear: 32,
};

describe('Intents', () => {
  afterEach(() => {
    Platform.OS = 'ios';
  });
  describe('savePaymentMethod', () => {
    it('should reject with an error if the native method fails', async () => {
      let error;

      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback('error');
      });

      try {
        await savePaymentMethod(
          methodData,
          perfectCardParams,
        );

        expect(NativeModules.ReactNativePayments.savePaymentMethod).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual('error');
    });
    it('should resolve with some data if the native method succeeds', async () => {
      let result;
      let error;

      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await savePaymentMethod(
          methodData,
          perfectCardParams,
        );

        expect(NativeModules.ReactNativePayments.savePaymentMethod).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should sanitise cardParams to strings when they are not strings', async () => {
      let result;
      let error;

      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await savePaymentMethod(
          methodData,
          unstringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.savePaymentMethod).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should sanitise the paymentParams when they are strings', async () => {
      let result;
      let error;

      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await savePaymentMethod(
          methodData,
          stringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.savePaymentMethod).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should call the Native function when the platform is IOS', async () => {
      let result;
      let error;
  
      Platform.OS = 'ios';
  
      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });
  
      try {
        result = await savePaymentMethod(
          methodData,
          unstringifiedCardParams,
        );
  
        expect(NativeModules.ReactNativePayments.savePaymentMethod).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }
  
      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should call the Native function when the platform is Android', async () => {
      Platform.OS = 'android';
  
      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });
  
      try {
        await savePaymentMethod(
          methodData,
          unstringifiedCardParams,
        );
  
        expect(NativeModules.ReactNativePayments.savePaymentMethod).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }
    });
    it('should not call the Native function when the platform is Web', async () => {
      Platform.OS = 'web';
  
      NativeModules.ReactNativePayments.savePaymentMethod = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });
  
      try {
        await savePaymentMethod(
          methodData,
          unstringifiedCardParams,
        );
  
        expect(NativeModules.ReactNativePayments.savePaymentMethod).not.toHaveBeenCalled();
      } catch (e) {
        error = e.message;
      }
    });
  });
  describe('confirmPayment', () => {
    it('should reject with an error if the native method fails', async () => {
      let error;

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback('error');
      });

      try {
        await confirmPayment(
          methodData,
          perfectCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual('error');
    });
    it('should resolve with some data if the native method succeeds', async () => {
      let result;
      let error;

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await confirmPayment(
          methodData,
          perfectCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should sanitise paymentParams when they are not strings', async () => {
      let result;
      let error;

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await confirmPayment(
          methodData,
          unstringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should sanitise paymentParams when they are strings', async () => {
      let result;
      let error;

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await confirmPayment(
          methodData,
          stringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should call the Native function when the platform is IOS', async () => {
      let result;
      let error;

      Platform.OS = 'ios';

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        result = await confirmPayment(
          methodData,
          unstringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).toHaveBeenCalledWith(
          methodData,
          sanitisedCardParams,
          expect.any(Function),
        );
      } catch (e) {
        error = e.message;
      }

      expect(error).toEqual(undefined);
      expect(result).toEqual('relief');
    });
    it('should not call the Native function when the platform is Android', async () => {
      Platform.OS = 'android';

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        await confirmPayment(
          methodData,
          unstringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).not.toHaveBeenCalled();
      } catch (e) {
        error = e.message;
      }
    });
    it('should not call the Native function when the platform is Web', async () => {
      Platform.OS = 'web';

      NativeModules.ReactNativePayments.confirmPayment = jest.fn((methodData, cardParams, callback) => {
        callback(null, 'relief');
      });

      try {
        await confirmPayment(
          methodData,
          unstringifiedCardParams,
        );

        expect(NativeModules.ReactNativePayments.confirmPayment).not.toHaveBeenCalled();
      } catch (e) {
        error = e.message;
      }
    });
  });
});
