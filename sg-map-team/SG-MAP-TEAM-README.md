# General Info

This repo is a fork from official maplibre/maplibre-gl-js:main.  
Our main branch yilumi/maplibre-gl-js:main is protected.  
Devs should work on other branches and use PR to make changes to main branch.

Github team **sg-map-team** has admin access to this repo.

It's a public repo due to github policy. We may copy it to a new private repo  
once we are done with experimenting.

# Git workflow

## Create or switch branch before work

When work on this repo, make sure to switch to branches other than main to start  
work.

```
# create a new branch
git checkout -b sg-map-team-doc-update  # this branch is for udpating documents.
# or if already exists, switch to it
git checkout sg-map-team-doc-update
git branch # show branch, should be sg-map-team-doc-update
git pull # if necessary, will show error if remote doesn't be pushed for this
         # branch yet, can ignore.
```

## Push work in branch to remote

```
git commit .  # or do it in VS code GUI interface.
git push      # or do it in VS code GUI interface.
              # this will sync new branch to remote if first time using this
              # branch.
```

## Create Pull Request (PR) at remote

When we are satisfied with all the commits for this branch (the purpose of this  
branch is completed). We can create a pull request in main.  
We can do it at GitHub web interface. In <https://github.com/yilumistudio/maplibre-gl-js/>,  
go to main branch, it will show a button for creating a PR. This PR will need  
reviewers to accept it, but we can choose to bypass the review (ignore protection).

**Make sure the PR is for yilumistudio/maplibre-gl-js:main, not the upstream**  
**maplibre/maplibre-gl-js:main**  
We don't want to create pull request to original source.

Although it seems redundant, but We do all of these steps to make sure future
workflow is correct.

Git branch purpose: main branch should be protected, a new dev branch should be  
created for completing a new task. The new branch can then be merged back to  
main branch by creating a pull request. The dev branch should be deleted after  
a successful PR.

## After PR

After PR, the main branch should have merged code. The remote branch can be  
deleted together after merge (github UI will show a delete branch button).

However, local branch is still there. We have to do the following steps to remove  
the local branch.

```
git checkout main
git fetch       # retrieve remote branches status (including deletion of this branch)
git remote prune origin  # remove the stale tracking reference of this remotely
                         # deleted branch
git branch -d sg-map-team-doc-update  # delete the local branch.
```

# Sync from upstream

We should normally hold off syncing from upstream (maplibre/maplibre-gl-js:main)
if we have a stable version.

# Folder structure

We should consolidate our own documents into **sg-map-team** folder.

# Build, dist

Refer to [BUILD-TEST-DIST-README.md](BUILD-TEST-DIST-README.md)
