"use client";

import React from "react";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  IconButton,
  useColorMode,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const LightningIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Icon>
);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  // Fix: Stronger background opacity in dark mode to prevent blending
  const bg = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    "rgba(15, 23, 42, 0.95)" // Slightly lighter than pure black #0b1220 for contrast
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const logoColor = useColorModeValue("purple.600", "purple.400");

  return (
    <Box
      as="nav"
      borderBottom="1px"
      borderColor={borderColor}
      bg={bg}
      backdropFilter="blur(10px)"
      px={{ base: 4, md: 8 }}
      py={3}
      position="sticky"
      top={0}
      zIndex={100}
      transition="background 0.2s"
    >
      <Flex align="center" maxW="1400px" mx="auto">
        <HStack spacing={2}>
          <Box color={logoColor}>
            <LightningIcon boxSize={6} />
          </Box>
          <Heading size="md" letterSpacing="-0.5px">
            AI Fitness Coach
          </Heading>
        </HStack>

        <Spacer />

        <IconButton
          aria-label="Toggle theme"
          onClick={toggleColorMode}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          variant="ghost"
          size="sm"
          rounded="full"
        />
      </Flex>
    </Box>
  );
}
