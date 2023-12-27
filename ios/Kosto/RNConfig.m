//
//  RNConfig.m
//  Kosto
//
//  Created by Stanley Chan on 22/11/2023.
//

#import "RNConfig.h"

@implementation RNConfig

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport{
  
#if INTERNAL
  return @{ @"env": @"Internal" };
#elif STAGING
  return @{ @"env": @"Staging" };
#else
  return @{ @"env": @"External" };
#endif
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}
@end

