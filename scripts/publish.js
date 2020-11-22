#!/usr/local/bin/node
const getopts = require("getopts")
const fs = require("fs")
const childProcess = require("child_process")

// Regarder les options

function getNextVersion(currentVersion, type) {
  let versionSplit = currentVersion.split('.')
  if (versionSplit.length !== 3) return console.log("Package version not npm valid")
  switch (type) {
    case "minor":
      return `${versionSplit[0]}.${versionSplit[1]}.${Number(versionSplit[2]) + 1}`
      break;
    case "major":
      return `${versionSplit[0]}.${Number(versionSplit[1]) + 1}.0`
      break;
    case "version":
      return `${Number(versionSplit[0]) + 1}.0.0`
      break;
    default:
      return console.log("Version update type not found")
  }
}

function updatePackageVersion(filepath, newVersion) {
  let relativeFilePath = (`${__dirname}/../${filepath}`)
  if (!fs.existsSync(relativeFilePath)) return console.log("Unable to find :", filepath)
  let file = require(relativeFilePath)
  if (!(file && file.version)) return console.log(`${filepath} not a package json`)
  file.version = newVersion
  fs.writeFileSync(relativeFilePath, JSON.stringify(file, null, 2))
  console.log(`${filepath} updated`)
  return true
}

function execAwait(cmd) {
  return new Promise((s, f) => {
    let child = childProcess.exec(cmd, (err, sdtout) => {
      if (err) return s(`Error on command: "${cmd}"`)
      s(sdtout)
    })
    child.stdout.on('data', function(data) {
      console.log(data.toString()); 
    });
    child.stderr.on('data', function(data) {
      console.log(data.toString()); 
    });
  })
} 
 
const options = getopts(process.argv.slice(2), {
  alias: {
    help: "h",
    type: "t",
  },
  string: ["t"],
})

if (!options.t && !options._.length) {
  return console.log("Usage : publish [-t|--type=<minor|major>] source_and_target_package.json ... other_target_package.json... \n\nUpdate number version.")
}
let packageJSON = require(`../${options._[0]}`)

if (!packageJSON) return console.error("Unable to find ${} :", __dirname)
const currentVersion = packageJSON.version
console.log("Current version :", currentVersion)

let nextVersion = getNextVersion(currentVersion, options.type)
if (!nextVersion) return

let updated = 0
for(const packageFilePath of options._) {
  console.log("Update package.json :", packageFilePath)
  if (!updatePackageVersion(packageFilePath, nextVersion)) 
    continue;
  else
    updated++
    
}

console.log(`Update ${updated} files to version ${nextVersion}`)

// Build
async function gitPublish() {
  try {
    let out
    console.log("Run build...\nMay take a while...")
    await execAwait("npm run build")
    console.log("Add all files to git")
    await execAwait("git add -A")
    console.log(`Commit "Go to ${nextVersion}"`)
    await execAwait(`git commit -m 'Go to ${nextVersion}'`)
    console.log(`Push to master`)
    await execAwait(`git push origin master`)
    console.log(`Create tag ${nextVersion}`)
    await execAwait(`git tag ${nextVersion}`)
    console.log(`Pushing tag ${nextVersion}`)
    await execAwait(`git push origin ${nextVersion}`)
    console.log(`Publish version ${nextVersion} done.`)
  } catch (err) {
    console.log(err)
  }
}

gitPublish()
