// import React from "react"
// import type { ComponentProps } from "react"
import { action } from "@storybook/addon-actions"
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react"

import { OptionsTemplate } from "./OptionsPage"

type Meta = ComponentMeta<typeof OptionsTemplate>
// type Props = ComponentProps<typeof OptionsTemplate>
type Story = ComponentStoryObj<typeof OptionsTemplate>

const componentMeta: Meta = {
  component: OptionsTemplate,
}

export default componentMeta

export const Default: Story = {
  args: {
    copyFormatItems: [
      {
        id: "md",
        name: "markdown",
        format: "[<title>](<url>)",
      },
      {
        id: "plain",
        name: "plain",
        format: "<title>: <url>",
      },
    ],
    onChangeName: () => action("onChangeName"),
    onBlurName: () => action("onBlurName"),
    onChangeFormat: () => action("onChangeFormat"),
    onBlurFormat: () => action("onBlurFormat"),
    onClickRemove: () => action("onClickRemove"),
    onClickAdd: action("onClickAdd"),
    loading: false,
  },
}
