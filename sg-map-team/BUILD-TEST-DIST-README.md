## Prepare for build

Official build instruction is here: [CONTRIBUTING.md](../CONTRIBUTING.md)  
This document gives us instructions on Linux, Mac and Windows.  
In practice, we use **WSL ubuntu on Windows** to build.

### WSL ubuntu on Windows

Follow this guide https://github.com/yilumistudio/map-tools-docs/blob/main/WSL-SETUP.md to install WSL2 on Windows.
Once wls2 is installed.

- Sync repo
  ```cd ~;
  mkdir github;
  cd github;
  gh repo clone yilumistudio/maplibre-gl-js
  cd maplibre-gl-js
  # switch or create dev branch if necessary
  ```
- WSL ubuntu, repo setups
  Just follow [CONTRIBUTING.md](../CONTRIBUTING.md), **Linux** portion, NOT  
  Windows portion.

- Note that when we use VS code to open this repo, a prompt will show to suggest  
  using existing dev container. **Don't use** it. This is only for codespace.

#### Install windows version docker

docker required for running tests (no need if you don't run tests).

## Build

In codespace or windows VS code (connected to WSL ubuntu in this repo), run:

```
npm install
npm run build-dist
```

This will build

```
dist
├── maplibre-gl-csp-dev.js
├── maplibre-gl-csp-dev.js.map
├── maplibre-gl-csp-worker-dev.js
├── maplibre-gl-csp-worker-dev.js.map
├── maplibre-gl-csp-worker.js
├── maplibre-gl-csp-worker.js.map
├── maplibre-gl-csp.js
├── maplibre-gl-csp.js.map
├── maplibre-gl-dev.js
├── maplibre-gl-dev.js.map
├── maplibre-gl.css
├── maplibre-gl.d.ts
├── maplibre-gl.js
└── maplibre-gl.js.map
```

These files can be uploaded to hosting server or cdn.

Or we can host locally built dev js by running `npm run start`

More commands can be learned from [package.json](../package.json)

## How to use package

Three ways to use this package in consumer app:

- local hosted js library
- build, publish, then consumer app uses published npm package
- build, locally linked npm package

### Local hosted js library

Run `npm start`, it will serve dist files locally at port 9966.  
The consumer app can use this js library.  
Example consumer app could be:
https://github.com/yilumistudio/sg-map-website/tree/master/src/app/local-hosted-maplibre-gl-test

Pro:

- Easist. No need to build, publish, or link.
- debugger works.

Con:

- Can't be used with **react-three-map** and **react-map-gl**, which are used  
  in our consumer app (sg-map-website).

### Use published npm package

Example consumer app could be:
https://github.com/yilumistudio/sg-map-website/blob/master/package.json  
Check this line in package.json:

```
"maplibre-gl": "npm:@yilumi/maplibre-gl@^0.1.0",
```

This line tells npm to use our private registry to get maplibre-gl package (aliased).

## Publish

This package will publish to our own private registry.

Important settings in .npmrc:

```
@yilumi:registry=https://verdaccio.yilumi.com/
```

This tells npm to use our private registry for package with scope @yilumi, which  
is exactly our package.

### Publish steps

1. Always make sure build first before publish.

```
npm run build-dist
```

2. Make sure you are logged in to our private registry.

```
npm login --registry=https://verdaccio.yilumi.com/
```

Use only account wcai and gmei, both pwd is "g\*\*k".

3. Update package version at [package.json](../package.json).

4. Update [CHANGELOG.md](./CHANGELOG.md).

5. Dry run publish

```
npm publish --dry-run
```

See if any error. The tarball should be around 6 MB.
Make sure it will publish to our verdaccio server.

**IMPORTANT**, always dry-run first, exclude any files that don't intend for  
publishing, such as .vscode settings, exclude them in [.npmignore](../.npmignore)

6. Publish

```
npm publish
```

Check Verdaccio web interface for details, require login at top right corner,  
otherwise you won't see any published packages:  
https://verdaccio.yilumi.com/

7. Useful commands

```
npm info @yilumi/maplibre-gl versions
npm unpublish @yilumi/maplibre-gl@0.1.10 --registry https://verdaccio.yilumi.com
```
