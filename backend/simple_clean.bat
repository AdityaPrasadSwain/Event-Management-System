@echo off
if exist target (
    echo Removing target directory...
    rd /s /q target
)
if exist target (
    echo Failed to remove target.
) else (
    echo Target removed successfully.
)
