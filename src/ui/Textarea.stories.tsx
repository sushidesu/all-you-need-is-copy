// import React from "react"
// import type { ComponentProps } from "react"
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react"

import { Textarea } from "./Textarea"

type Meta = ComponentMeta<typeof Textarea>
// type Props = ComponentProps<typeof Textarea>
type Story = ComponentStoryObj<typeof Textarea>

const componentMeta: Meta = {
  component: Textarea,
}

export default componentMeta

export const Default: Story = {}
