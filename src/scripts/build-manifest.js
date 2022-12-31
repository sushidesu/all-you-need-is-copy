const path = require("path")
const { readFile, writeFile, mkdir } = require("fs/promises")
const { cwd } = require("process")

const MANIFEST_FILE_NAME = "manifest.json"
const DIST_DIR_NAME = "build"

const main = async () => {
  const currentDir = cwd()

  // read and process manifest.json
  const fileBuf = await readFile(path.join(currentDir, MANIFEST_FILE_NAME))
  const manifest = JSON.parse(fileBuf.toString())
  const { $schema, ...rest } = manifest

  // write manifest.json
  const distDir = path.join(currentDir, DIST_DIR_NAME)
  try {
    await mkdir(distDir)
  } catch (_) {
    // distDir already exists
    // do nothing.
  }
  await writeFile(
    path.join(distDir, MANIFEST_FILE_NAME),
    JSON.stringify(rest, undefined, 2)
  )
}

main()
