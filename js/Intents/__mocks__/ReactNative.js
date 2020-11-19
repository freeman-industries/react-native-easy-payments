const mockedNativeModules = {
  Platform: {
    OS: 'ios',
  },
  NativeModules: {
    ReactNativePayments: {
      confirmPayment: jest.fn(),
      savePaymentMethod: jest.fn(),
    },
  },
};

module.exports = { 
  mockedNativeModules, 
};
