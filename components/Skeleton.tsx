import { View } from 'react-native';

interface SkeletonProps {
  height: number;
  backgroundColor: string;
}

export default function Skeleton({ height, backgroundColor }: SkeletonProps) {
  return (
    <View style={{
      height: height,
      width: '100%',
      marginBottom: 10,
      borderWidth: 2,
      borderRadius: 5,
      borderColor: backgroundColor,
      // backgroundColor: backgroundColor
    }} />
  );
};
