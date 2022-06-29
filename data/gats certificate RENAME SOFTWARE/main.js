import fs, { readdir } from "fs/promises"

let x = 0
try {
  const files = await readdir("./files")
  for (const file of files) {
    // fs.rename(`./files/${file}`, `./files/${nameArray[x]}.pdf`)
    // x++

    console.log(file)
  }
} catch (err) {
  console.error(err)
}
