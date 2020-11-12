require "json"

package = JSON.parse(File.read(File.join(__dir__, "../../package.json")))
version = package["version"]
giturl = package["repository"]

Pod::Spec.new do |s|
  s.name         = "ReactNativeEasyPayments"
  s.version      = version
  s.summary      = "react-native-easy-payments"
  s.description  = <<-DESC
                  Native Payments (Google and Apple Pay) from React-Native
                   DESC
  s.homepage     = giturl.to_s
  s.license      = "MIT"
  s.author       = "Freeman Industries"
  s.platform     = :ios, "7.0"
  s.source       = { :git => giturl.to_s + ".git", :tag => version }
  s.source_files  = "lib/ios/*.{h,m}"
  s.requires_arc = true

  s.dependency 'React'
  s.dependency 'Stripe'
  s.dependency 'Braintree'
end
