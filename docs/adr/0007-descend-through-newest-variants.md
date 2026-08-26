# Descend through newest variants

When a user selects a variant with descendants, Chat0 follows the newest child at each later branch point until it reaches a leaf and makes that leaf the conversation head. This keeps off-head navigation deterministic without storing mutable child selections for every message.
