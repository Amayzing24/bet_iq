import React from "react"
import { Tooltip, Text } from "@chakra-ui/react"

export default function InfoPopup({ title, description }) {
  return (
    <Tooltip label={description} hasArrow>
      <Text
        fontSize="sm"
        cursor="pointer"
        borderBottom="1px dashed white"
        display="inline-block"
      >
        {title} ℹ️
      </Text>
    </Tooltip>
  )
}
