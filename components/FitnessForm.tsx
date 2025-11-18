"use client";

import {
  Box,
  Button,
  Input,
  Select,
  Text,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function FitnessForm({ onPlanGenerated }: any) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [error, setError] = useState("");

  // Theme Colors
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.500", "gray.300"); // Explicit icon color for selects

  async function onSubmit(values: any) {
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onPlanGenerated(data.plan);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Shared Select Styles for Dark Mode visibility
  const selectStyles = {
    iconColor: iconColor, // Fixes the invisible arrow issue
    sx: {
      "> option": {
        background: useColorModeValue("white", "#171923"),
        color: useColorModeValue("gray.800", "white"),
      },
    },
  };

  return (
    <Box>
      <Heading size="md" mb={2} color={headingColor}>
        Start Your Journey
      </Heading>
      <Text mb={6} color={subTextColor} fontSize="sm">
        Fill in your details to generate your plan.
      </Text>

      <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
        <FormControl isRequired>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Name
          </FormLabel>
          <Input placeholder="Ex. John" {...register("name")} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Age
          </FormLabel>
          <Input type="number" placeholder="25" {...register("age")} />
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Gender
          </FormLabel>
          <Select {...register("gender")} {...selectStyles}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Height (cm) & Weight (kg)
          </FormLabel>
          <Box display="flex" gap={2}>
            <Input
              type="number"
              placeholder="175 cm"
              {...register("height_cm")}
            />
            <Input
              type="number"
              placeholder="70 kg"
              {...register("weight_kg")}
            />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Goal
          </FormLabel>
          <Select {...register("goal")} {...selectStyles}>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Level
          </FormLabel>
          <Select {...register("fitness_level")} {...selectStyles}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Environment
          </FormLabel>
          <Select {...register("location")} {...selectStyles}>
            <option value="home">Home</option>
            <option value="gym">Gym</option>
            <option value="outdoor">Outdoor</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Diet
          </FormLabel>
          <Select {...register("diet_pref")} {...selectStyles}>
            <option value="non-veg">Non-Veg</option>
            <option value="veg">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Stress Level
          </FormLabel>
          <Select {...register("stress_level")} {...selectStyles}>
            <option value="low">Low Stress</option>
            <option value="medium">Moderate Stress</option>
            <option value="high">High Stress</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            fontSize="xs"
            fontWeight="bold"
            color={labelColor}
            textTransform="uppercase"
          >
            Medical / Injuries
          </FormLabel>
          <Textarea
            placeholder="Any injuries?"
            {...register("medical_history")}
          />
        </FormControl>

        <Button
          type="submit"
          width="100%"
          size="lg"
          mt={2}
          isLoading={isSubmitting}
          loadingText="Generating..."
        >
          Generate Plan
        </Button>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
