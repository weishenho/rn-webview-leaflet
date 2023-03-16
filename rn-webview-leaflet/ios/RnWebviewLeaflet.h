
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRnWebviewLeafletSpec.h"

@interface RnWebviewLeaflet : NSObject <NativeRnWebviewLeafletSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RnWebviewLeaflet : NSObject <RCTBridgeModule>
#endif

@end
