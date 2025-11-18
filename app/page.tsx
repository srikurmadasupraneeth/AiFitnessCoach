"use client";

import { Box, Flex } from "@chakra-ui/react";
import FitnessForm from "@/components/FitnessForm";
import PlanResult from "@/components/PlanResult";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastFitnessPlan");
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch {
        console.error("Failed to load plan");
      }
    }
  }, []);

  const handleRegenerate = () => {
    setPlan(null);
    localStorage.removeItem("lastFitnessPlan");
    // Optional: scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <Navbar />

      <Flex
        flex="1"
        overflow="hidden"
        direction={{ base: "column", md: "row" }}
      >
        {/* Sidebar Form */}
        <Box
          w={{ base: "100%", md: "350px", lg: "400px" }}
          borderRight="1px solid"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.800", bg: "#0b101b" }}
          bg="white"
          p={6}
          overflowY="auto"
          zIndex={2}
        >
          <FitnessForm onPlanGenerated={setPlan} />
        </Box>

        {/* Main Content Plan */}
        <Box
          flex="1"
          p={{ base: 4, md: 8, lg: 12 }}
          overflowY="auto"
          bg="gray.50"
          _dark={{ bg: "transparent" }}
        >
          <Box maxW="5xl" mx="auto">
            <PlanResult plan={plan} onRegenerate={handleRegenerate} />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
