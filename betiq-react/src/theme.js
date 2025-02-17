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
    light: "#F7FAFC",
  },
}

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === "dark"
        ? `linear-gradient(135deg, ${colors.background.dark}, #2D3748)`
        : colors.background.light,
      color: props.colorMode === "dark" ? "whiteAlpha.900" : "gray.800",
    }
  }),
}

const components = {
  Card: {
    baseStyle: (props) => ({
      container: {
        borderRadius: "xl",
        boxShadow: "lg",
        bg: props.colorMode === "dark" ? "gray.800" : "white",
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "whiteAlpha.100" : "gray.200",
        transition: "all 0.2s ease-in-out",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "xl",
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
        bg: props.colorMode === "dark" ? "brand.500" : "brand.500",
        color: "white",
        _hover: {
          bg: props.colorMode === "dark" ? "brand.600" : "brand.600",
        },
      }),
    },
  },
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
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
