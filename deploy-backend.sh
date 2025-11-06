#!/bin/bash

cd backend
npm install
npm run build
sudo systemctl enable --now redis-server
tmux_session_name=$(basename "$(pwd)")

if tmux has-session -t $tmux_session_named 2>/dev/null; then # restart backend if tmux session already exists
    tmux send-keys -t $tmux_session_named C-c
    tmux send-keys -t $tmux_session_named "node ./dist/src/index.js" C-m
else # otherwise create tmux session and start fresh backend instance
    tmux new-session -d -s $tmux_session_named
    tmux send-keys -t $tmux_session_named "node ./dist/src/index.js" C-m
    tmux detach-client
fi

if tmux has-session -t $tmux_session_named-worker; then
    tmux send-keys -t $tmux_session_named-worker C-c
    tmux send-keys -t $tmux_session_named-worker "node ./dist/src/services/jobWorkers.js" C-m
else
    tmux new-session -d -s $tmux_session_named-worker
    tmux send-keys -t $tmux_session_named-worker "node ./dist/src/services/jobWorkers.js" C-m
    tmux detach-client
fi
