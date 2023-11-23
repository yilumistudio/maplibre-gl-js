# WSL ubuntu on Windows

## Install WSL and ubuntu

1. On Windows, install WSL. https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support#1-overview
2. Install wsl and ubuntu.
3. `wsl -l` will list all distros
4. Use `wsl --setdefault ubuntu` to set default distro to ubuntu.
5. Don't install vs code linux version. We should use Windows version to remote  
   connect ubuntu wsl.
6. Launch new ubuntu terminal: in windows start menu, type "ubuntu".

## Some setup for WSL
- You will need to set up default user and password other than root.  
    If wsl --install let you create your default user, do it there. Otherwise, you can also  
    mannually create the default ubuntu user as follows:  
    ```
    # assume in root account
    adduser user-name
    apt update
    visudo
    ```
    In the sudoer's list, add these under %sudo line  
    `username   ALL=(ALL) ALL`  
    If the editor is "Gnu Nano", use "ctrl o, hit enter" to save, "ctrl x" to exit.  
    You can check whether this user is in sudoer's list:
    `sudo -l -U username`  
    It should print username may run ALL commands.  

    Now set this user to be the default ubuntu user  
    ```
    # still in root account
    touch /etc/wsl.conf
    nano /etc/wsl.conf
    ```
    Write these content  in wsl.conf
    ```
    [user]
    default=username
    ```
    Now, type "exit" to exit terminal. 

## Go back to ubuntu terminal
In windows start menu, type "ubuntu" to go to ubutun terminal.  
It should use the new default user.  

## Use vs code in wsl ubuntu
You don't need to install vs code for linux. Instead, you can use windows VS code to connect to wsl ubuntu.

Remember to install Remote ssh, wsl extensions for vs code.

### terminal way
In ubuntu terminal, type  
`code directory/to/open`  

### windows way
In windows vs code, click bottom left blue button, connect to wsl with distro, select ubuntu.  

### 
In either way, your vs code should display "WSL" at bottom left area, and you terminal should show the default  
ubuntu user name. 

## Nodejs
Follow this guide: https://github.com/nodesource/distributions 

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