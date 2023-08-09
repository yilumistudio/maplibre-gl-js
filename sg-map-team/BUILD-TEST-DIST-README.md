# Prepare for build
Official build instruction is here: [CONTRIBUTING.md](../CONTRIBUTING.md)  
This document gives us instructions on Linux, Mac and Windows.  
In practice, we use either **codespace** or **WSL ubuntu on Windows** to build.  
**WSL ubuntu on Windows** is recommended.  

### Codespace 
In GitHub web interface, https://github.com/yilumistudio/maplibre-gl-js  
Top right button, **Code**, in **Codespaces**, create codespace on the dev branch.  
In theory, once the codespace is created, we can start working without any set up.

pro: fast  
con: on remote machine  

### WSL ubuntu on Windows
#### Install windows version docker
docker required for running tests.
#### Install WSL and ubuntu
1. On Windows, install WSL. https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support#1-overview  
2. Install wsl and ubuntu.   
3. `wsl -l` will list all distros
4. Use `wsl --setdefault ubuntu` to set default distro to ubuntu.
5. Don't install vs code linux version. We should use Windows version to remote  
   connect ubuntu wsl.
6. Launch new ubuntu terminal: in windows start menu, type "ubuntu".
7. Some setups is recommended for new ubuntu. Refer to https://github.com/yilumistudio/openmaptiles/blob/buildsgmap/BUILD-SG-MAP.md  
#### Notes
1. don't install linux version docker
2. don't install linux version vs code.
#### Install gh command line tool
```
sudo apt update
sudo apt install gh
```
`gh auth login` will ask for login credential, use token way.
#### Sync repo
```cd ~; 
mkdir github; 
cd github;
gh repo clone yilumistudio/maplibre-gl-js 
cd maplibre-gl-js
# switch or create dev branch if necessary
```
#### WSL ubuntu, repo setups
Just follow [CONTRIBUTING.md](../CONTRIBUTING.md), **Linux** portion, NOT  
Windows portion.  

#### Use VS code to connect WSL ubuntu
Refer to https://github.com/yilumistudio/openmaptiles/blob/buildsgmap/BUILD-SG-MAP.md   
**Use vs code in wsl ubuntu** section.

Note that when we use VS code to open this repo, a prompt will show to suggest  
using existing dev container. **Don't use** it. This is only for codespace.  

# Build
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

# Test
Todo

# Dist
While offical maplibre dist packages to cdn. We should have our own deploy script  
to deploy to our target server or cdn.