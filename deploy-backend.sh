#! /bin/bash

tmux_session_name=$(basename "$(pwd)")
npm install
cd backend
if tmux has-session -t $tmux_session_name 2>/dev/null; then # restart backend if tmux session already exists
    tmux send-keys -t $tmux_session_name C-c
    tmux send-keys -t $tmux_session_name "npm run dev" C-m
else # otherwise create tmux session and start fresh backend instance
    tmux new-session -d -s $tmux_session_name
    tmux send-keys -t $tmux_session_name "npm run dev" C-m
    tmux detach-client
fi