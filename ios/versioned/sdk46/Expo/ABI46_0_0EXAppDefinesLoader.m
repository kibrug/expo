// Copyright 2016-present 650 Industries. All rights reserved.

#import <ABI46_0_0Expo/ABI46_0_0EXAppDefinesLoader.h>

#import <ABI46_0_0ExpoModulesCore/ABI46_0_0ExpoModulesCore.h>
#import <ABI46_0_0ExpoModulesCore/ABI46_0_0EXAppDefines.h>
#import <ABI46_0_0React/ABI46_0_0RCTDefines.h>

@implementation ABI46_0_0EXAppDefinesLoader

+ (void)load
{
  BOOL APP_DEBUG;
  [ABI46_0_0EXAppDefines load:@{
#if DEBUG
    @"APP_DEBUG": @(YES),
#else
    @"APP_DEBUG": @(NO),
#endif
    @"APP_RCT_DEBUG": @(ABI46_0_0RCT_DEBUG),
    @"APP_RCT_DEV": @(ABI46_0_0RCT_DEV),
#if ABI46_0_0RCT_NEW_ARCH_ENABLED
    @"APP_NEW_ARCH_ENABLED": @(YES),
#else
    @"APP_NEW_ARCH_ENABLED": @(NO),
#endif
  }];
}

@end
