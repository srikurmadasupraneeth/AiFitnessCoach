import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("gray.50", "#05050a")(props),
        color: mode("gray.800", "gray.100")(props),
      },
    }),
  },
  components: {
    Button: {
      baseStyle: { borderRadius: "12px", fontWeight: "bold" },
      defaultProps: { colorScheme: "purple" },
    },
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: mode("white", "whiteAlpha.100")(props), // High contrast in dark mode
            color: mode("gray.800", "white")(props),
            _hover: {
              bg: mode("gray.100", "whiteAlpha.200")(props),
            },
            _focus: {
              bg: mode("white", "whiteAlpha.200")(props),
              borderColor: "purple.500",
            },
            _placeholder: {
              color: mode("gray.400", "gray.500")(props),
            },
          },
        }),
      },
      defaultProps: { variant: "filled" },
    },
    Select: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: mode("white", "whiteAlpha.100")(props),
            color: mode("gray.800", "white")(props),
            _hover: {
              bg: mode("gray.100", "whiteAlpha.200")(props),
            },
            _focus: {
              bg: mode("white", "whiteAlpha.200")(props),
              borderColor: "purple.500",
            },
          },
        }),
      },
      defaultProps: { variant: "filled" },
    },
    Textarea: {
      variants: {
        filled: (props: any) => ({
          bg: mode("white", "whiteAlpha.100")(props),
          color: mode("gray.800", "white")(props),
          _hover: { bg: mode("gray.100", "whiteAlpha.200")(props) },
          _focus: { borderColor: "purple.500" },
        }),
      },
      defaultProps: { variant: "filled" },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: mode("white", "gray.800")(props),
          color: mode("gray.800", "gray.100")(props),
        },
      }),
    },
  },
});

export default theme;
