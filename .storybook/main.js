module.exports = {
  "stories": [
    '../src/readme.stories.mdx',
    "../examples/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-docs",
      options: { transcludeMarkdown: true },
    }
  ],
  "framework": "@storybook/react"
}
