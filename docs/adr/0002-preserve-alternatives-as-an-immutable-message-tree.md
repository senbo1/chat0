# Preserve alternatives as an immutable message tree

Each message is immutable and refers to at most one preceding message. Messages with the same predecessor are ordered variants, editing and regeneration append variants, and a conversation head selects the active branch. This preserves earlier answers and edits while giving generation one unambiguous context path.
