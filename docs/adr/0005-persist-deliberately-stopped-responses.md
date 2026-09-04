# Persist deliberately stopped responses

When a user stops generation, Chat0 stores any non-empty partial output as an immutable stopped response. Provider and network failures store no assistant message and leave their errors device-local, which distinguishes content the user chose to keep from a failed streaming buffer.
