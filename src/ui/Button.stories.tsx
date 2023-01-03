// import React from "react"
// import type { ComponentProps } from "react"
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react"

import { Button } from "./Button"

type Meta = ComponentMeta<typeof Button>
// type Props = ComponentProps<typeof Button>
type Story = ComponentStoryObj<typeof Button>

const componentMeta: Meta = {
  component: Button,
}

export default componentMeta

export const Default: Story = {
  args: {
    children: "hello",
  },
}
