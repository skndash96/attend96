import { useEffect } from "react";
import { Animated, useAnimatedValue, ViewStyle } from "react-native";

export default function SlideUpView({
  children,
  style
}: {
  style: ViewStyle,
  children: React.ReactNode
}) {
  const slideAnim = useAnimatedValue(200);
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View style={[style, {
      transform: [{ translateY: slideAnim }]
    }]}>
      {children}
    </Animated.View>
  );
};
