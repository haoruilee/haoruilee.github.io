---
title: Swarm Code Reading
date: 2025-01-24 23:55:55
tags:
- post
thumbnail: https://i.dawnlab.me/fffe274efb6723c33b55a3bf5354858a.png
---

# Swarm Code Reading


Source code: https://github.com/openai/swarm

My opensourced demo of how to modify and use swarm: https://github.com/haoruilee/huggingface-swarm

TL;DR: Swarm is a LLM multi-agent structure. It warps different LLM into function_calling format and passed them to too_choice to make one agent call another. 

---

#### 1. **Overview of Swarm's Components**
Before delving into the `core.py` file, let’s understand the supporting modules:

1. **`types.py`:** Defines the core data structures like `Agent`, `Response`, and `Result`, which are used throughout the code.
2. **`util.py`:** Provides utility functions like `debug_print`, `merge_chunk`, and `function_to_json`, which assist in debugging, merging responses, and converting functions to JSON.

---

#### 2. **Initialization of the Swarm Class**
The `Swarm` class is initialized with a client:

```python
class Swarm:
    def __init__(self, client=None):
        if not client:
            client = OpenAI()
        self.client = client
```

- **Purpose:** This constructor sets up the `Swarm` object, ensuring it has a client for interacting with the OpenAI API.
- **Key Points:**
  - If no client is provided, it defaults to creating an `OpenAI` client instance.
  - This client is stored as `self.client`, which is used in subsequent methods.

---

#### 3. **Method: `get_chat_completion`**
This method retrieves chat completions from the OpenAI model based on agent instructions and conversation history.

```python
def get_chat_completion(self, agent, history, context_variables, model_override, stream, debug):
    context_variables = defaultdict(str, context_variables)
    instructions = (
        agent.instructions(context_variables)
        if callable(agent.instructions)
        else agent.instructions
    )
    messages = [{"role": "system", "content": instructions}] + history
    debug_print(debug, "Getting chat completion for...:", messages)

    tools = [function_to_json(f) for f in agent.functions]
    for tool in tools:
        params = tool["function"]["parameters"]
        params["properties"].pop(__CTX_VARS_NAME__, None)
        if __CTX_VARS_NAME__ in params["required"]:
            params["required"].remove(__CTX_VARS_NAME__)

    create_params = {
        "model": model_override or agent.model,
        "messages": messages,
        "tools": tools or None,
        "tool_choice": agent.tool_choice,
        "stream": stream,
    }

    if tools:
        create_params["parallel_tool_calls"] = agent.parallel_tool_calls

    return self.client.chat.completions.create(**create_params)
```

- **Steps:**
  1. **Prepare Context Variables:**
     - Converts `context_variables` into a `defaultdict` to handle missing keys gracefully.
  2. **Set Instructions:**
     - Determines the agent's instructions, either by calling it (if it's a function) or directly using the provided string.
  3. **Compose Messages:**
     - Starts with a system message (the instructions) and appends the conversation history.
  4. **Debugging:**
     - If debugging is enabled, prints the current state of messages.
  5. **Convert Functions to Tools:**
     - Transforms agent functions into JSON-serializable objects using `function_to_json` from `util.py`.
     - Removes `context_variables` from the tool’s parameters to avoid exposing internal details.
  6. **Create Parameters:**
     - Prepares the parameters needed for the OpenAI API call.
     - Includes tools, messages, model choice, and whether to use parallel tool calls.
  7. **API Call:**
     - Sends the request to OpenAI’s API to get the chat completion.

---

#### 4. **Method: `handle_function_result`**
Handles the result returned by agent functions and ensures it’s properly formatted.

```python
def handle_function_result(self, result, debug):
    match result:
        case Result() as result:
            return result

        case Agent() as agent:
            return Result(
                value=json.dumps({"assistant": agent.name}),
                agent=agent,
            )
        case _:
            try:
                return Result(value=str(result))
            except Exception as e:
                error_message = f"Failed to cast response to string: {result}. Make sure agent functions return a string or Result object. Error: {str(e)}"
                debug_print(debug, error_message)
                raise TypeError(error_message)
```

- **Steps:**
  1. **Pattern Matching:**
     - Matches the type of `result` using the `match` statement.
  2. **Result Object:**
     - If the result is already a `Result` object, it’s returned as-is.
  3. **Agent Object:**
     - If the result is an `Agent`, it’s wrapped in a `Result` with the agent’s name serialized as JSON.
  4. **Fallback:**
     - For any other type of result, attempts to convert it to a string.
     - If conversion fails, raises a `TypeError` with a debug message.

---

#### 5. **Method: `handle_tool_calls`**
Handles the execution of tool calls made by the assistant and returns a partial response.

```python
def handle_tool_calls(self, tool_calls, functions, context_variables, debug):
    function_map = {f.__name__: f for f in functions}
    partial_response = Response(messages=[], agent=None, context_variables={})

    for tool_call in tool_calls:
        name = tool_call.function.name
        if name not in function_map:
            debug_print(debug, f"Tool {name} not found in function map.")
            partial_response.messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "tool_name": name,
                    "content": f"Error: Tool {name} not found.",
                }
            )
            continue
        args = json.loads(tool_call.function.arguments)
        debug_print(debug, f"Processing tool call: {name} with arguments {args}")

        func = function_map[name]
        if __CTX_VARS_NAME__ in func.__code__.co_varnames:
            args[__CTX_VARS_NAME__] = context_variables
        raw_result = function_map[name](**args)

        result: Result = self.handle_function_result(raw_result, debug)
        partial_response.messages.append(
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "tool_name": name,
                "content": result.value,
            }
        )
        partial_response.context_variables.update(result.context_variables)
        if result.agent:
            partial_response.agent = result.agent

    return partial_response
```

- **Steps:**
  1. **Build Function Map:**
     - Creates a dictionary mapping function names to their respective implementations.
  2. **Iterate Through Tool Calls:**
     - For each tool call:
       - Checks if the tool exists in the function map.
       - If missing, appends an error message to the response.
       - Parses the tool’s arguments and executes the corresponding function.
  3. **Handle Results:**
     - Processes the function’s result using `handle_function_result`.
     - Appends the result to the response messages and updates context variables.
  4. **Return Partial Response:**
     - Returns a `Response` object containing messages, updated context variables, and any agent changes.

---

#### 6. **Run and Stream Methods**

The `run` and `run_and_stream` methods coordinate the overall conversation flow and tool execution. The `run` method handles sequential message processing and tool execution in a structured loop until a final response is generated, while the `run_and_stream` method streams responses in real-time, providing chunks of data as they are processed. These methods ensure that agents interact efficiently and tool calls are executed when needed.

Below is a simplified workflow diagram for better understanding:
The `run` and `run_and_stream` methods coordinate the overall conversation flow and tool execution. Below is a simplified workflow diagram for better understanding:

```
+----------------+           +--------------------+           +----------------+
| Initial Input  |  --->     | Get Chat Completion|  --->     | Handle Tool    |
| (Messages)     |           |   (API Call)       |           | Calls          |
+----------------+           +--------------------+           +----------------+
       |                              |                              |
       v                              v                              v
+----------------+           +--------------------+           +----------------+
|  Process       |  --->     | Update Context     |  --->     | Return Final   |
|  Completion    |           | Variables & History|           | Response       |
+----------------+           +--------------------+           +----------------+
```

- **`run` Method:**
  - Calls `get_chat_completion` to generate a response.
  - Executes tool calls if present and updates context variables.
  - Iterates until a final response is ready or the max turn limit is reached.

- **`run_and_stream` Method:**
  - Similar to `run` but streams responses in real-time.
  - Yields chunks of data for immediate processing.

