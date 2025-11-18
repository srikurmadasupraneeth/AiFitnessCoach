"use client";

import {
  Box,
  Text,
  Heading,
  VStack,
  Divider,
  Badge,
  SimpleGrid,
  Button,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  useDisclosure,
  Tooltip,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Progress,
  Flex,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { DownloadIcon, RepeatIcon, ViewIcon } from "@chakra-ui/icons";
import { exportPlanToPdf } from "@/utils/pdf";
import { useState, useEffect, useRef } from "react";

// Custom Audio Icon
const AudioIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-4 0c-4.01.91-7 4.49-7 8.77s2.99 7.86 7 8.77v-2.06c-2.89-.86-5-3.54-5-6.71s2.11-5.85 5-6.71V3.23z" />
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM8 8.82v6.36L11.18 12 8 8.82z" />
  </Icon>
);

const StopIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="6" y="6" width="12" height="12" />
  </Icon>
);

export default function PlanResult({ plan, onRegenerate }: any) {
  const [isExporting, setIsExporting] = useState(false);

  // Track which section is currently speaking: 'none', 'workout', 'diet', 'tips', 'summary'
  const [speakingSection, setSpeakingSection] = useState<string>("none");

  const [loadingText, setLoadingText] = useState("Initializing...");
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- HOOKS AT TOP ---
  const cardBg = useColorModeValue("white", "gray.800");
  const itemBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const mainHeadingColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardTextColor = useColorModeValue("gray.700", "gray.100");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.200");
  const dietBorderColor = useColorModeValue("gray.100", "gray.700");

  const quoteBg = useColorModeValue("purple.50", "purple.900");
  const quoteText = useColorModeValue("purple.800", "purple.100");

  const tipBg = useColorModeValue("orange.50", "orange.900");
  const tipBorder = useColorModeValue("orange.400", "orange.400");
  const tipText = useColorModeValue("orange.800", "orange.100");
  const tipsHeaderColor = useColorModeValue("orange.600", "orange.300");

  const postureBg = useColorModeValue("blue.50", "blue.900");
  const postureBorder = useColorModeValue("blue.400", "blue.400");
  const postureText = useColorModeValue("blue.800", "blue.100");

  const workoutColor = useColorModeValue("purple.600", "purple.300");
  const dietColor = useColorModeValue("green.600", "green.300");

  useEffect(() => {
    if (plan) localStorage.setItem("lastFitnessPlan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    if (isOpen) {
      const texts = [
        "Finding best search...",
        "Generating AI visual...",
        "Applying filters...",
        "Almost there...",
      ];
      let i = 0;
      setLoadingText(texts[0]);
      intervalRef.current = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  const handleDownload = async () => {
    if (!plan) return;
    setIsExporting(true);
    try {
      const blob = await exportPlanToPdf(plan);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "My_AI_Fitness_Plan.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "PDF Downloaded", status: "success" });
    } catch {
      toast({ title: "Export Failed", status: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  // --- AUDIO LOGIC (Refined) ---
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingSection("none");
    }
  };

  const playText = (text: string, sectionKey: string) => {
    if ("speechSynthesis" in window) {
      // If already speaking this section, stop it.
      if (speakingSection === sectionKey) {
        stopSpeaking();
        return;
      }

      // Stop any other audio first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingSection("none");
      utterance.onerror = () => setSpeakingSection("none");

      setSpeakingSection(sectionKey);
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: "TTS not supported", status: "warning" });
    }
  };

  const speakSummary = () =>
    playText(`${plan.quote}. ${plan.summary}`, "summary");

  const speakWorkout = () => {
    if (!plan) return;
    let text = "Here is your workout plan. ";
    plan.workout.forEach((d: any) => {
      text += `On ${d.day}. `;
      d.exercises.forEach(
        (ex: any) => (text += `Do ${ex.name} for ${ex.sets} sets. `)
      );
    });
    playText(text, "workout");
  };

  const speakDiet = () => {
    if (!plan) return;
    let text = "Here is your diet plan. ";
    Object.entries(plan.diet).forEach(([meal, items]: any) => {
      text += `For ${meal}. `;
      items.forEach((f: any) => (text += `Have ${f.name}. `));
    });
    playText(text, "diet");
  };

  const speakTips = () => {
    if (!plan) return;
    let text = "Here are your expert tips. " + plan.tips.join(". ");
    if (plan.posture_tips)
      text +=
        " And here are some posture tips. " + plan.posture_tips.join(". ");
    playText(text, "tips");
  };

  if (!plan) {
    return (
      <Box textAlign="center" color={subTextColor} mt={20}>
        <Heading size="lg" mb={2} color={mainHeadingColor}>
          Ready to Transform?
        </Heading>
        <Text fontSize="lg">
          Fill out the details to generate your AI plan.
        </Text>
      </Box>
    );
  }

  return (
    <Box pb={20}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* HEADER */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb={6}
          gap={4}
        >
          <Box>
            <Heading size="lg" color={mainHeadingColor}>
              Your Personal Plan
            </Heading>
            <Text color={secondaryTextColor} fontSize="sm">
              Generated by AI Coach
            </Text>
          </Box>
          <HStack>
            {speakingSection !== "none" && (
              <Button
                size="sm"
                leftIcon={<StopIcon />}
                colorScheme="red"
                onClick={stopSpeaking}
                variant="solid"
              >
                Stop Audio
              </Button>
            )}
            <Button
              size="sm"
              leftIcon={<RepeatIcon />}
              onClick={onRegenerate}
              colorScheme="gray"
              variant="outline"
            >
              Regenerate
            </Button>
            <Button
              size="sm"
              leftIcon={<DownloadIcon />}
              onClick={handleDownload}
              isLoading={isExporting}
            >
              PDF
            </Button>
          </HStack>
        </Flex>

        {/* QUOTE */}
        {plan.quote && (
          <Box
            p={5}
            bg={quoteBg}
            rounded="xl"
            borderLeft="4px solid"
            borderColor="purple.400"
            mb={6}
            position="relative"
          >
            <IconButton
              aria-label="Listen to quote"
              icon={
                speakingSection === "summary" ? <StopIcon /> : <AudioIcon />
              }
              size="xs"
              position="absolute"
              top={3}
              right={3}
              onClick={speakSummary}
              variant="ghost"
              colorScheme="purple"
            />
            <Text
              fontStyle="italic"
              fontWeight="medium"
              fontSize="lg"
              color={quoteText}
              pr={8}
            >
              &quot;{plan.quote}&quot;
            </Text>
            <Text fontSize="xs" mt={2} fontWeight="bold" color="purple.500">
              DAILY MOTIVATION
            </Text>
          </Box>
        )}

        <Text color={cardTextColor} fontSize="md" mb={8} lineHeight="tall">
          {plan.summary}
        </Text>

        {/* MACROS */}
        {plan.macros && (
          <Box mb={10}>
            <Heading size="md" mb={4} color={mainHeadingColor}>
              📊 Daily Nutrition Goals
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              <Box
                p={4}
                bg={cardBg}
                rounded="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color={subTextColor}>
                  Protein
                </Text>
                <Heading size="lg" color="blue.500">
                  {plan.macros.protein}g
                </Heading>
                <Progress
                  value={100}
                  size="xs"
                  colorScheme="blue"
                  mt={2}
                  borderRadius="full"
                />
              </Box>
              <Box
                p={4}
                bg={cardBg}
                rounded="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color={subTextColor}>
                  Carbs
                </Text>
                <Heading size="lg" color="green.500">
                  {plan.macros.carbs}g
                </Heading>
                <Progress
                  value={100}
                  size="xs"
                  colorScheme="green"
                  mt={2}
                  borderRadius="full"
                />
              </Box>
              <Box
                p={4}
                bg={cardBg}
                rounded="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color={subTextColor}>
                  Fats
                </Text>
                <Heading size="lg" color="orange.500">
                  {plan.macros.fats}g
                </Heading>
                <Progress
                  value={100}
                  size="xs"
                  colorScheme="orange"
                  mt={2}
                  borderRadius="full"
                />
              </Box>
            </SimpleGrid>
          </Box>
        )}

        <Divider my={8} />

        {/* WORKOUT */}
        <HStack justify="space-between" mb={5}>
          <Heading size="md" color={workoutColor}>
            🏋️ Workout Schedule
          </Heading>
          <Button
            leftIcon={
              speakingSection === "workout" ? <StopIcon /> : <AudioIcon />
            }
            size="sm"
            onClick={speakWorkout}
            variant="ghost"
            colorScheme="purple"
          >
            {speakingSection === "workout" ? "Stop" : "Listen"}
          </Button>
        </HStack>

        <VStack spacing={4} align="stretch" mb={10}>
          {plan.workout?.map((day: any, i: number) => (
            <Card
              key={i}
              bg={cardBg}
              variant="outline"
              borderColor={borderColor}
              boxShadow="sm"
            >
              <CardBody>
                <Heading size="sm" mb={4} color={mainHeadingColor}>
                  {day.day}
                </Heading>
                <VStack align="stretch" spacing={3}>
                  {day.exercises.map((ex: any, j: number) => (
                    <Tooltip
                      key={j}
                      label="Click to visualize"
                      hasArrow
                      bg="purple.600"
                    >
                      <HStack
                        p={3}
                        bg={itemBg}
                        rounded="md"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedItem({ name: ex.name, type: "workout" });
                          onOpen();
                        }}
                        justify="space-between"
                        transition="all 0.2s"
                        _hover={{
                          transform: "translateX(5px)",
                          borderColor: "purple.400",
                          bg: hoverBg,
                        }}
                        border="1px solid"
                        borderColor="transparent"
                      >
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color={cardTextColor}
                          >
                            {ex.name}
                          </Text>
                          <Text fontSize="xs" color={subTextColor}>
                            {ex.reps &&
                            ex.reps.toString().match(/\d+\s*(min|sec)/i)
                              ? `Duration: ${ex.reps}`
                              : `${ex.sets} sets × ${ex.reps} reps`}
                            {ex.rest_seconds > 0 &&
                              ` · ${ex.rest_seconds}s rest`}
                          </Text>
                        </Box>
                        <Icon as={ViewIcon} color={subTextColor} />
                      </HStack>
                    </Tooltip>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* DIET */}
        <HStack justify="space-between" mb={5}>
          <Heading size="md" color={dietColor}>
            🥗 Meal Plan
          </Heading>
          <Button
            leftIcon={speakingSection === "diet" ? <StopIcon /> : <AudioIcon />}
            size="sm"
            onClick={speakDiet}
            variant="ghost"
            colorScheme="green"
          >
            {speakingSection === "diet" ? "Stop" : "Listen"}
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={10}>
          {Object.entries(plan.diet).map(([meal, items]: any) => (
            <Card
              key={meal}
              bg={cardBg}
              variant="outline"
              borderColor={borderColor}
              boxShadow="sm"
            >
              <CardBody>
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  mb={4}
                  color={subTextColor}
                  letterSpacing="wide"
                >
                  {meal}
                </Heading>
                {items.map((food: any, k: number) => (
                  <Tooltip
                    key={k}
                    label="Visualize Food"
                    hasArrow
                    bg="green.500"
                  >
                    <HStack
                      justify="space-between"
                      py={3}
                      borderBottomWidth={k < items.length - 1 ? 1 : 0}
                      borderColor={dietBorderColor}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedItem({ name: food.name, type: "food" });
                        onOpen();
                      }}
                      _hover={{ bg: itemBg }}
                      rounded="md"
                      px={2}
                      mx={-2}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={cardTextColor}
                      >
                        {food.name}
                      </Text>
                      <Badge
                        colorScheme="green"
                        variant="solid"
                        rounded="full"
                        px={2}
                      >
                        {food.calories} kcal
                      </Badge>
                    </HStack>
                  </Tooltip>
                ))}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* TIPS & POSTURE */}
        <HStack justify="space-between" mb={5}>
          <Heading size="md" color={tipsHeaderColor}>
            💡 Expert & Posture Tips
          </Heading>
          <Button
            leftIcon={speakingSection === "tips" ? <StopIcon /> : <AudioIcon />}
            size="sm"
            onClick={speakTips}
            variant="ghost"
            colorScheme="orange"
          >
            {speakingSection === "tips" ? "Stop" : "Listen"}
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {plan.tips?.map((t: string, i: number) => (
            <Flex
              key={i}
              p={4}
              bg={tipBg}
              rounded="lg"
              borderLeft="4px solid"
              borderColor={tipBorder}
              align="center"
            >
              <Text fontSize="sm" color={tipText} fontWeight="bold">
                {t}
              </Text>
            </Flex>
          ))}
          {plan.posture_tips?.map((t: string, i: number) => (
            <Flex
              key={`posture-${i}`}
              p={4}
              bg={postureBg}
              rounded="lg"
              borderLeft="4px solid"
              borderColor={postureBorder}
              align="center"
            >
              <Text fontSize="sm" color={postureText} fontWeight="bold">
                🧘 {t}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </motion.div>

      {/* MODAL WITH INTERACTIVE LOADING */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderColor={borderColor} borderWidth={1}>
          <ModalHeader textTransform="capitalize" color={mainHeadingColor}>
            {selectedItem?.name}
          </ModalHeader>
          <ModalCloseButton color={mainHeadingColor} />
          <ModalBody pb={6}>
            {selectedItem && (
              <Box
                position="relative"
                minH="300px"
                bg="blackAlpha.100"
                rounded="lg"
                overflow="hidden"
              >
                <Image
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(
                    selectedItem.type === "workout"
                      ? `fitness gym exercise ${selectedItem.name} 4k lighting`
                      : `food photography ${selectedItem.name} michelin star plated`
                  )}?nologo=true`}
                  alt={selectedItem.name}
                  borderRadius="lg"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  fallback={
                    <Center h="300px" flexDirection="column" gap={3}>
                      <Spinner size="xl" color="purple.500" thickness="4px" />
                      <Text
                        color={subTextColor}
                        fontSize="sm"
                        fontWeight="medium"
                        animation="pulse 2s infinite"
                      >
                        {loadingText}
                      </Text>
                    </Center>
                  }
                />
              </Box>
            )}
            <Text fontSize="xs" textAlign="center" mt={3} color={subTextColor}>
              AI Generated Visualization
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
