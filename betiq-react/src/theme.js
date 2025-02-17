import { extendTheme } from "@chakra-ui/react"

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: "#E6FFFA",
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795",
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044",
  },
  background: {
    dark: "#171923",
    light: "#F8FAFC",
  },
  lightMode: {
    mainBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    sectionBg: "#F1F5F9",
    hoverBg: "#F8FAFC",
    border: "#E2E8F0",
    
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
      accent: "#319795",
    },
    badge: {
      correct: {
        bg: "#C6F6D5",
        text: "#22543D",
      },
      incorrect: {
        bg: "#FED7D7",
        text: "#822727",
      }
    }
  },
}

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === "dark"
        ? `linear-gradient(135deg, ${colors.background.dark}, #2D3748)`
        : colors.lightMode.mainBg,
      color: props.colorMode === "dark" ? "whiteAlpha.900" : colors.lightMode.text.primary,
    }
  }),
}

const components = {
  Card: {
    baseStyle: (props) => ({
      container: {
        borderRadius: "xl",
        boxShadow: props.colorMode === "dark" ? "lg" : "md",
        bg: props.colorMode === "dark" ? "gray.800" : colors.lightMode.cardBg,
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "whiteAlpha.100" : colors.lightMode.border,
        transition: "all 0.2s ease-in-out",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "xl",
          bg: props.colorMode === "dark" ? "gray.700" : colors.lightMode.hoverBg,
        },
      }
    }),
  },
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "lg",
    },
    variants: {
      solid: (props) => ({
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
        },
      }),
    },
  },
  Text: {
    baseStyle: (props) => ({
      color: props.colorMode === "dark" ? "whiteAlpha.900" : colors.lightMode.text.primary,
    }),
  },
  Heading: {
    baseStyle: (props) => ({
      color: props.colorMode === "dark" 
        ? "whiteAlpha.900" 
        : "gray.800",
    }),
    variants: {
      'page-title': (props) => ({
        color: props.colorMode === "dark"
          ? "whiteAlpha.900"
          : "gray.800",
        fontWeight: "bold",
      })
    },
    defaultProps: {
      variant: 'page-title'
    }
  },
  Badge: {
    variants: {
      subtle: (props) => ({
        bg: props.colorMode === "dark" 
          ? props.colorScheme === "green" ? "green.200" : "red.200"
          : props.colorScheme === "green" ? colors.lightMode.badge.correct.bg : colors.lightMode.badge.incorrect.bg,
        color: props.colorMode === "dark"
          ? props.colorScheme === "green" ? "green.800" : "red.800"
          : props.colorScheme === "green" ? colors.lightMode.badge.correct.text : colors.lightMode.badge.incorrect.text,
      })
    }
  }
}

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
}

const theme = extendTheme({
  config,
  colors,
  styles,
  components,
  fonts,
  shadows: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 15px 25px rgba(0, 0, 0, 0.12)",
  },
  radii: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
})

export default theme
