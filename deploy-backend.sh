#! /bin/bash

directory="$HOME/hayeslab-BLANT/backend"
npm install
cd $directory
if tmux has-session -t blant-backend 2>/dev/null; then # restart backend if tmux session already exists
    tmux send-keys -t blant-backend C-c
    tmux send-keys -t blant-backend "npm run dev" C-m
else # otherwise create tmux session and start fresh backend instance
    tmux new-session -d -s blant-backend
    tmux send-keys -t blant-backend "npm run dev" C-m
    tmux detach-client
fi