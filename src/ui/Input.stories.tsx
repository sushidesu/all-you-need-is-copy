// import React from "react"
// import type { ComponentProps } from "react"
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react"

import { Input } from "./Input"

type Meta = ComponentMeta<typeof Input>
// type Props = ComponentProps<typeof Input>
type Story = ComponentStoryObj<typeof Input>

const componentMeta: Meta = {
  component: Input,
}

export default componentMeta

export const Default: Story = {}
