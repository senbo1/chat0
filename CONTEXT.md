# Chat0

Chat0 lets an authenticated user hold conversations with AI models while preserving alternate responses and edits as navigable history.

## Language

**Conversation**:
A saved exchange owned by one user. A conversation contains every alternate path its messages can form.
_Avoid_: Thread, chat

**Message**:
An immutable user or assistant contribution to a conversation. A message has at most one preceding message.
_Avoid_: Message node, turn

**Variant**:
One of multiple messages with the same preceding message. Editing or regenerating creates a variant instead of replacing existing history.
_Avoid_: Version, revision

**Active branch**:
The message path from the start of a conversation to its conversation head. It is the context used for the next model response.
_Avoid_: Current thread, selected history

**Conversation head**:
The final message of the active branch. Each conversation has one synchronized conversation head shared across the user's devices.
_Avoid_: Latest message, current message

**Stopped response**:
A partial assistant message the user explicitly chose to keep by stopping generation. It remains part of the conversation and can have later variants.
_Avoid_: Failed response, streaming buffer

**Guest**:
A visitor represented by an anonymous identity. A guest can keep one conversation in the current browser and may later link it to an account.
_Avoid_: Anonymous user, unauthenticated user

**Guest allowance**:
Permission for a guest to submit one user prompt and receive its assistant response. Editing, regeneration, further prompts, and forking require an account.
_Avoid_: Free message, trial token

**Account**:
A permanent identity that owns conversations across devices. Linking an account transfers the current guest conversation into that account.
_Avoid_: Registered user, signed-in user

**Fork**:
A new conversation containing copies of the active branch through a selected message. A fork owns its copied messages independently of the source conversation.
_Avoid_: Shared branch, duplicate thread

**Conversation title**:
A model-generated label based on the first user message and created after the first durable assistant response. It remains stable through editing and regeneration, while each fork receives its own title.
_Avoid_: Summary, chat name
