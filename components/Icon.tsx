import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons'
import React from 'react'

export default function Icon({
  name,
  color,
  family = "io",
  size
}: {
  name: any
  color?: string,
  family?: "io" | "fa6" | "ad",
  size: number
}) {
  return family === "fa6" ? (
    <FontAwesome6 color={color} name={name} size={size} />
  ) : family === "ad" ? (
    <AntDesign color={color} name={name} size={size} />
  ) : (
    <Ionicons color={color} name={name} size={size} />
  );
}
