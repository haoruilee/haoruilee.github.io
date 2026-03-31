---
title: Deepseek Math Reading
date: 2025-02-05 13:55:55
tags:
- post
thumbnail: https://i.dawnlab.me/bda96ce3ca698fd128bac60950b0e962.png
---

# Deepseek Math Paper Reading

# Main Contribution

- GRPO, bring 'group' method to training, remove value model in workflow. "GRPO foregoes the critic model, instead estimating the baseline from group scores, significantly reducing training resources compared to Proximal Policy Optimization (PPO)."
- A unified RL formula for RFT, DPO, PPO, GRPO
- RL training tricks:
  - Outcomes supervision RL is better than process superversion RL
  - Iteration RL, train reward model every several inter to make it updated 

# From PPO to GRPO

[![b22aba461c4d16d3d5236c2ce88b63ec.png](https://i.dawnlab.me/b22aba461c4d16d3d5236c2ce88b63ec.png)](https://yaih.dawn.ee/image/SPdl)

[![6f0af8f9483755bb2f8173e94659b567.png](https://i.dawnlab.me/6f0af8f9483755bb2f8173e94659b567.png)](https://yaih.dawn.ee/image/SJKt)

[![73dba900df24a82784afaf4c7164017f.png](https://i.dawnlab.me/73dba900df24a82784afaf4c7164017f.png)](https://yaih.dawn.ee/image/Sqw7)



**Proximal Policy Optimization (PPO)**  is an actor-critic RL algorithm widely used in the RL fine-tuning stage for LLMs. PPO optimizes LLMs by maximizing the following surrogate objective:

$$
\mathcal{J}_{PPO}(\theta) = \mathbb{E}_{[q \sim P(Q), o \sim \pi_{\theta_{\text{old}}}(O|q)]} \frac{1}{|o|} \sum_{t=1}^{|o|} \min \left[ \frac{\pi_{\theta}(o_t|q, o<t)}{\pi_{\theta_{\text{old}}}(o_t|q, o<t)} A_t, \text{clip} \left( \frac{\pi_{\theta}(o_t|q, o<t)}{\pi_{\theta_{\text{old}}}(o_t|q, o<t)}, 1-\epsilon, 1+\epsilon \right) A_t \right]
$$

where:
- $ \pi_{\theta} $ and $ \pi_{\theta_{\text{old}}} $ are the current and old policy models, respectively.
- $ q $ and $ o $ are quesns and outputs sampled from the question dataset and the old policy $ \pi_{\theta_{\text{old}}} $.
- $ \epsilon $ is a clipping-related hyper-parameter introduced in PPO for stabilizing training.
- $ A_t $ is the **advantage**, computed using **Generalized Advantage Estimation (GAE)** (Schulman et al., 2015), based on rewards $ \{r_t\} $ and a learned value function $ V_{\psi} $.

In PPO, a value function needs to be trained alongside the policy model. To mitigate over-optimization of the reward model, a **per-token KL penalty** from a reference model is added to the reward at each token:

$$
r_t = r_{\phi}(q, o \leq t) - \beta \log \left( \frac{\pi_{\theta}(o_t|q, o<t)}{\pi_{\theta_{\text{ref}}}(o_t|q, o<t)} \right)
$$

where:
- $ r_{\phi} $ is the reward model,
- $ \pi_{\theta_{\text{ref}}} $ is the reference model (usually the initial SFT model),
- $ \beta $ is the coefficient for the KL penalty.

GRPO foregoes the value model, instead estimating the baseline from group scores, which significantly reduces training resources.

PPO requires a large memory and computational burden due to the value model, which is typically of comparable size to the policy model. Moreover, in LLM contexts, usually only the last token is assigned a reward score, complicating the training of an accurate value function at each token.

To address this, **Group Relative Policy Optimization (GRPO)** eliminates the need for an additional value function, using the **average reward** of multiple outputs produced in response to the same question as the baseline. Specifically, for each question $ q $, GRPO samples a group of outputs $ \{o_1, o_2, \dots, o_G\} $ from the old policy $ \pi_{\theta_{\text{old}}} $ and optimizes the policy by maximizing the following objective:

$$
\mathcal{J}_{GRPO}(\theta) = \mathbb{E}_{[q \sim P(Q), \{o_i\}_i = 1^G \sim \pi_{\theta_{\text{old}}}(O|q)]} \frac{1}{G} \sum_{i=1}^{G} \frac{1}{|o_i|} \sum_{t=1}^{|o_i|} \min \left[ \frac{\pi_{\theta}(o_{i,t}|q, o_i < t)}{\pi_{\theta_{\text{old}}}(o_{i,t}|q, o_i < t)} \hat{A}^i_t, \text{clip} \left( \frac{\pi_{\theta}(o_{i,t}|q, o_i < t)}{\pi_{\theta_{\text{old}}}(o_{i,t}|q, o_i < t)}, 1-\epsilon, 1+\epsilon \right) \hat{A}^i_t \right] - \beta D_{\text{KL}}[\pi_{\theta} \| \pi_{\text{ref}}]
$$

where:
- $ \hat{A}^i_t $ is the advantage computed based on the relative rewards of outputs inside each group,
- $ \beta $ and $ \epsilon $ are hyper-parameters,
- $ D_{\text{KL}}[\pi_{\theta} \| \pi_{\text{ref}}] $ is the **KL divergence** between the trained policy $ \pi_{\theta} $ and the reference policy $ \pi_{\text{ref}} $.

The advantage is computed relative to the group, aligning well with reward models that are typically trained on datasets comparing outputs for the same question.

# Insights of Reinforcement Learn

DeepseekMath also propose a unified form of RL:

![9ef2365d8a9c2bc8642b5ee0aea3b223.png](https://i.dawnlab.me/9ef2365d8a9c2bc8642b5ee0aea3b223.png)

