const { build } = require("esbuild")
const svgrPlugin = require("esbuild-plugin-svgr")
const path = require("path")
const { cwd, argv } = require("process")

const currentDir = cwd()

const watch = argv[2] === "-w"

build({
  plugins: [svgrPlugin()],
  bundle: true,
  outdir: "build",
  target: "esnext",
  platform: "browser",
  entryPoints: [
    path.join(currentDir, "src/options.tsx"),
    path.join(currentDir, "src/background.ts"),
    path.join(currentDir, "src/content.ts"),
  ],
  watch,
})
