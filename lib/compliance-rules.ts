import {
  ComplianceRule,
  Platform,
  Store,
  ViolationSeverity,
} from "@/types/compliance";

export const GOOGLE_PLAY_RULES: ComplianceRule[] = [
  {
    id: "gp-target-sdk",
    name: "Target SDK Version",
    description:
      "Apps must target API level 33 (Android 13) or higher to be published on Google Play",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Technical Requirements",
    checkPattern: "targetSdkVersion|targetSdk",
    documentation:
      "https://developer.android.com/google/play/requirements/target-sdk",
  },
  {
    id: "gp-dangerous-permissions",
    name: "Dangerous Permissions Declaration",
    description:
      "Apps must properly declare and justify dangerous permissions in the manifest",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "uses-permission",
    documentation: "https://developer.android.com/guide/topics/permissions",
  },
  {
    id: "gp-data-safety",
    name: "Data Safety Section",
    description:
      "Apps must complete the Data Safety section accurately in Play Console",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Privacy & Security",
    documentation:
      "https://support.google.com/googleplay/android-developer/answer/10787469",
  },
  {
    id: "gp-privacy-policy",
    name: "Privacy Policy URL",
    description:
      "Apps that handle personal or sensitive user data must provide a privacy policy",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Privacy & Security",
    documentation:
      "https://support.google.com/googleplay/android-developer/answer/9859455",
  },
  {
    id: "gp-encryption",
    name: "Data Encryption",
    description:
      "Sensitive user data must be encrypted both in transit and at rest",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "SharedPreferences|database|encrypt",
  },
  {
    id: "gp-background-location",
    name: "Background Location Access",
    description:
      "Apps must justify background location access and follow best practices",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "ACCESS_BACKGROUND_LOCATION",
    documentation:
      "https://support.google.com/googleplay/android-developer/answer/9799150",
  },
  {
    id: "gp-package-visibility",
    name: "Package Visibility Declaration",
    description:
      "Apps targeting API 30+ must declare package visibility in manifest",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Medium,
    category: "Technical Requirements",
    checkPattern: "queries",
    documentation:
      "https://developer.android.com/training/package-visibility",
  },
  {
    id: "gp-sdk-compliance",
    name: "Third-Party SDK Compliance",
    description:
      "All third-party SDKs must comply with Google Play policies",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "dependencies|implementation",
  },
  {
    id: "gp-accessibility",
    name: "Accessibility Requirements",
    description:
      "Apps must provide content descriptions for UI elements to support accessibility",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Low,
    category: "User Experience",
    checkPattern: "contentDescription",
    documentation: "https://developer.android.com/guide/topics/ui/accessibility",
  },
  {
    id: "gp-network-security",
    name: "Network Security Configuration",
    description:
      "Apps must use HTTPS for network communications and configure network security properly",
    store: Store.GooglePlay,
    platforms: [Platform.Android, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "network_security_config|http:",
    documentation:
      "https://developer.android.com/training/articles/security-config",
  },
];

export const IOS_APP_STORE_RULES: ComplianceRule[] = [
  {
    id: "ios-min-version",
    name: "Minimum iOS Version",
    description:
      "Apps must support a reasonable minimum iOS version (iOS 13.0 or later recommended)",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Medium,
    category: "Technical Requirements",
    checkPattern: "IPHONEOS_DEPLOYMENT_TARGET|MinimumOSVersion",
    documentation: "https://developer.apple.com/support/app-store/",
  },
  {
    id: "ios-privacy-manifest",
    name: "Privacy Manifest",
    description:
      "Apps must include a Privacy Manifest (PrivacyInfo.xcprivacy) declaring data collection",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Privacy & Security",
    checkPattern: "PrivacyInfo.xcprivacy",
    documentation:
      "https://developer.apple.com/documentation/bundleresources/privacy_manifest_files",
  },
  {
    id: "ios-tracking-permission",
    name: "App Tracking Transparency",
    description:
      "Apps must request permission before tracking users across apps and websites",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Privacy & Security",
    checkPattern: "NSUserTrackingUsageDescription",
    documentation:
      "https://developer.apple.com/documentation/apptrackingtransparency",
  },
  {
    id: "ios-privacy-keys",
    name: "Privacy Usage Descriptions",
    description:
      "Apps must provide usage descriptions for all privacy-sensitive features (camera, location, etc.)",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Privacy & Security",
    checkPattern:
      "NSCameraUsageDescription|NSLocationWhenInUseUsageDescription|NSPhotoLibraryUsageDescription",
    documentation:
      "https://developer.apple.com/documentation/bundleresources/information_property_list/protected_resources",
  },
  {
    id: "ios-ats",
    name: "App Transport Security",
    description:
      "Apps must use HTTPS for network connections or provide proper ATS exceptions",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "NSAppTransportSecurity|NSAllowsArbitraryLoads",
    documentation:
      "https://developer.apple.com/documentation/security/preventing_insecure_network_connections",
  },
  {
    id: "ios-background-modes",
    name: "Background Modes Justification",
    description:
      "Apps must properly declare and justify background modes usage",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Medium,
    category: "Technical Requirements",
    checkPattern: "UIBackgroundModes",
    documentation:
      "https://developer.apple.com/documentation/xcode/configuring-background-execution-modes",
  },
  {
    id: "ios-data-collection",
    name: "Data Collection Declaration",
    description:
      "Apps must accurately declare all data collection in App Store Connect",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Critical,
    category: "Privacy & Security",
    documentation:
      "https://developer.apple.com/app-store/app-privacy-details/",
  },
  {
    id: "ios-third-party-sdks",
    name: "Third-Party SDK Tracking",
    description:
      "All third-party SDKs must be declared and comply with privacy requirements",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "Podfile|pod |import",
    documentation:
      "https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api",
  },
  {
    id: "ios-sign-in-apple",
    name: "Sign in with Apple",
    description:
      "Apps that offer third-party sign-in must also offer Sign in with Apple",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "User Experience",
    checkPattern: "FBSDKLoginButton|GIDSignIn|firebase/auth",
    documentation: "https://developer.apple.com/sign-in-with-apple/",
  },
  {
    id: "ios-encryption-export",
    name: "Encryption Export Compliance",
    description:
      "Apps using encryption must provide export compliance documentation",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.Medium,
    category: "Privacy & Security",
    checkPattern: "ITSAppUsesNonExemptEncryption",
    documentation:
      "https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations",
  },
  {
    id: "ios-required-reason-api",
    name: "Required Reason API Usage",
    description:
      "Apps using certain APIs must provide reasons in Privacy Manifest",
    store: Store.AppStore,
    platforms: [Platform.iOS, Platform.ReactNative, Platform.Flutter],
    severity: ViolationSeverity.High,
    category: "Privacy & Security",
    checkPattern: "UserDefaults|fileSystemRepresentation|NSFileCreationDate",
    documentation:
      "https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api",
  },
];

export const ALL_COMPLIANCE_RULES: ComplianceRule[] = [
  ...GOOGLE_PLAY_RULES,
  ...IOS_APP_STORE_RULES,
];

export function getRulesByStore(store: Store): ComplianceRule[] {
  return ALL_COMPLIANCE_RULES.filter((rule) => rule.store === store);
}

export function getRulesByPlatform(platform: Platform): ComplianceRule[] {
  return ALL_COMPLIANCE_RULES.filter((rule) =>
    rule.platforms.includes(platform)
  );
}

export function getRulesByStoreAndPlatform(
  store: Store,
  platform: Platform
): ComplianceRule[] {
  return ALL_COMPLIANCE_RULES.filter(
    (rule) => rule.store === store && rule.platforms.includes(platform)
  );
}

