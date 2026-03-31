---
title: Paper reading Online Learning
date: 2024-12-08 16:55:55
tags:
- post
thumbnail: https://i.dawnlab.me/a3e988db210ef45c4b7faecb5d08cffa.png
---
# Online Learning From Incomplete and Imbalanced Data Streams

Interesting online learning paper that solve the whole problem using pure math.

Nice intro to the whole field.

[Paper](https://ieeexplore.ieee.org/document/10058539)

# Conclusion

1. For incompelet features: divied x_t to x_t^v (vanished), x_t^c (common), x_t^n (new) , update their weights w_t^v, w_t^c, w_t^n and confidence p_t^c ... ...
2. For imbalanced data streams: use dynamically adjusting param c_t to avoid bias toward the majority class
3. For model sparsity: use L1 ball projecting

# Pros and Cons

Pros:

- Handle the full task using basic mathmatic tools
- Doing well in the experimental results
- Has theoretical performance guarantees

Cons:

- Caculation is complex, in some really fast data stream scenario it may failed
- Hyper params may affect the algo's performance greately, though this method has a theoretical  performance bound, it still depends on C and c_t 
- Only fits -1/+1 classification 
- Not compared with deep learning methods


# Definitions

Data stream $D=\left\{\left(x_t, y_t\right) \mid t \in\{1,2, \ldots, T\}\right\}$, $x_t \in \mathbb{R}^{d_t}$ is a vector of $d_t$ dimensions, $y_t \in\{-1,+1\}$ is the true label of $x_t$. **Each time step you can only observe one pair**

For incomplete data stream D,  define $F_t=\left\{f_1, f_2, \ldots, f_{d_t}\right\}, F_t \in \mathbb{R}^{d_t}$ be the feature set that is carried by $x_t$. 
 Let $U_t=\left\{F_1 \cup F_2 \cup \cdots \cup F_t\right\}, U_t \in \mathbb{R}^{u_t}$ be the universal feature set till iteration $t$. Some $x_t$, the missing feature ratio  $\varphi = 1-d_t / u_t >0$.


# Solutions for Incomplete Feature Spaces

For imbalanced data stream, define $n_{-}$ as the number of majority class instances of y, $n_{+}$ for minority class. D has $n_{-} \gg n_{+}$.

Optimize Object:

$\begin{aligned} & \min _{\Phi_1, \ldots, \Phi_T} \frac{1}{T} \sum_{t=1}^T \ell\left(y_t ; \Phi\left(z_t\right)\right)+\Omega\left(\Phi_t\right),  \text { s.t. } \prod\left(x_t ; \mathbb{R}^c, \mathbb{R}^n\right) \stackrel{\text { i.i.d }}{\sim} z_t,\end{aligned}$

Here $\Phi\left(z_t\right)=w_t \cdot z_t$ represents learner, $w_t$ is learner's weight, $\ell$ as loss function,  $\Omega$ as regularization term. $z_t$ is the latent representations of $x_t$.


Define confidence $p_t^c$  on a common feature space  $p_t^c=\sum_{i=1}^{d_t^c} \frac{h_t^i}{\sum_{j=1}^{d_t} h_t^j}$, $h_t^i$ as informativeness of the $i$-th feature, calculate by Var.



Use hinge loss $\ell_t=\ell\left(y_t ; \hat{y}_t\right)=\max \left\{0,1-y_t\left(p_t^c \cdot w_t^c \cdot x_t^c+p_t^n \cdot w_t^n \cdot x_t^n\right)\right\}$.

## Use KKT method

To keep model change slightly, use a soft-margin:

$w_{t+1} = \operatorname*{arg\,min}_{w : \ell_t \leq \xi} \left( \frac{1}{2} \|w - w_t\|^2 + C \xi \right) =  \underset{\substack{w=\left[w^v, w^c, w^n\right]: \\
\ell_t \leq \xi, \xi \geq 0}}{\arg \min } \frac{1}{2}\left\|w^v-w_t^v\right\|^2 
 +\frac{1}{2}\left\|w^c-w_t^c\right\|^2+\frac{1}{2}\left\|w^n\right\|^2+C \xi
$. Here $\xi$ is soft margin.



Define Lagrangian function

$$
\begin{aligned}
L(w, \xi, \tau, \eta)= & \frac{1}{2}\left\|w^v-w_t^v\right\|^2+\frac{1}{2}\left\|w^c-w_t^c\right\|^2 \\
& +\frac{1}{2}\left\|w^n\right\|^2+C \xi+\tau\left(\ell_t-\xi\right)-\eta \xi
\end{aligned}
$$

Solve it to get:

$$
\begin{aligned}
& w_{t+1}=\left[w_{t+1}^v, w_{t+1}^c, w_{t+1}^n\right] \\
& =\left[w_t^v, w_t^c+\min \left\{C p_t^c y_t x_t^c, \frac{\ell_t p_t^c y_t x_t^c}{\left(p_t^c\right)^2\left\|x_t^c\right\|^2+\left(p_t^n\right)^2\left\|x_t^n\right\|^2}\right\}\right. \\
& \left.\quad \min \left\{C p_t^n y_t x_t^n, \frac{\ell_t p_t^n y_t x_t^n}{\left(p_t^c\right)^2\left\|x_t^c\right\|^2+\left(p_t^n\right)^2\left\|x_t^n\right\|^2}\right\}\right] .
\end{aligned}
$$


# Solutions for Imbalanced Data Stream

Create a dynamic cost c_t

$c_t=\frac{\theta}{\left(\frac{n_{+}}{n_{-}}\right){\phi\left(y_t\right)}+\left(\frac{n_{-}}{n_{+}}\right){\left(1-\phi\left(y_t\right)\right)}}$ Here $\theta$ is scaling param. $\phi\left(y_t\right)= \begin{cases}1, & \text { if } y_t=+1 \\ 0, & \text { if } y_t=-1\end{cases}$

Apply $c_t$ to loss function, we finnally get:

$$
\begin{aligned}
& w_{t+1}=\left[w_{t+1}^v, w_{t+1}^c, w_{t+1}^n\right] \\
& =\left[w_t^v, w_t^c+\min \left\{C c_t p_t^c y_t x_t^c, \frac{\ell_t p_t^c y_t x_t^c}{\left(p_t^c\right)^2\left\|x_t^c\right\|^2+\left(p_t^n\right)^2\left\|x_t^n\right\|^2}\right\}\right. \\
& \left.\quad \min \left\{C c_t p_t^n y_t x_t^n, \frac{\ell_t p_t^n y_t x_t^n}{\left(p_t^c\right)^2\left\|x_t^c\right\|^2+\left(p_t^n\right)^2\left\|x_t^n\right\|^2}\right\}\right]
\end{aligned}
$$


# Solutions for Model Sparsity

L1 ball projection, dot product weight and  uncertainty 

$$
w_t=\min \left\{1, \frac{\lambda}{\left\langle w_t \cdot H_t\right\rangle}\right\} w_t \quad\left\langle w_t, H_t\right\rangle=\sum_{i=1}^n w_{t, i} H_{t, i}
$$

$H_t=\left[h_t^1, h_t^2, h_t^3, \ldots, h_t^{u_t}\right] \in R^{u_t}$ denotes the relative uncertainty vector of the universal feature space at the $t$ th iteration, which is composed of the informativeness of all the features that have been observed. $\lambda>0$ is a regularization parameter.


# Concepts Conclusion


## 1. Concept Drift
   - **Definition**: Concept drift refers to the change in data distribution or the target variable over time.
   - **Explanation**: In online learning, when data evolves, models trained on older data may become outdated. Models need to adapt to changing data distributions.

## 2. Online Learning
   - **Definition**: Online learning is a machine learning paradigm where the model learns incrementally from incoming data points, rather than from a fixed dataset.
   - **Explanation**: Suitable for large, continuous, and evolving data streams. The model updates continuously as new data arrives.

## 3. Imbalanced Dataset
   - **Definition**: A dataset where the classes have significantly different numbers of samples.
   - **Explanation**: In imbalanced datasets, models may favor the majority class, neglecting the minority class. Solutions include weighted loss functions and resampling techniques.

## 4. Hinge Loss
   - **Definition**: A loss function used in classification tasks, especially in Support Vector Machines (SVM), that encourages correct classification with a margin.
   - **Formula**:
     $$
     L(y, \hat{y}) = \max(0, 1 - y \hat{y})
     $$
   - **Explanation**: Ensures that samples are correctly classified and also that the distance to the decision boundary is maximized. It penalizes misclassifications and small margins.

## 5. Lagrange Multipliers
   - **Definition**: A method used to solve optimization problems with constraints by incorporating the constraints into the objective function.
   - **Formula**: 
     $$
     \mathcal{L}(x, \lambda) = f(x) + \lambda g(x)
     $$
   - **Explanation**: By introducing a new term (Lagrange multiplier \( \lambda \)), it turns a constrained optimization problem into an unconstrained one, making it easier to solve.

## 6. Hessian Matrix
   - **Definition**: A matrix of second-order partial derivatives that describes the curvature of a function.
   - **Formula**:
     $$
     H(f) = \left[ \frac{\partial^2 f}{\partial x_i \partial x_j} \right]
     $$
   - **Explanation**: Used to understand the shape of a function. A positive definite Hessian indicates a local minimum, while a negative definite Hessian indicates a local maximum.

## 7. G-Mean (Geometric Mean)
   - **Definition**: A metric used to evaluate classification performance, particularly in imbalanced datasets. It is the geometric mean of sensitivity and specificity.
   - **Formula**:
     $$
     \text{G-Mean} = \sqrt{\text{Sensitivity} \times \text{Specificity}}
     $$
   - **Explanation**: G-Mean balances performance on both positive and negative classes, making it ideal for imbalanced data where both types of classification errors are important.

## 8. Dynamic Cost
   - **Definition**: A cost that is adjusted dynamically based on the distribution of classes in the data stream.
   - **Formula**:
     $$
     c_t = \frac{n_+}{n_-} \phi(y_t)
     $$
   - **Explanation**: The dynamic cost is used to adjust the weight of different classes during learning. For imbalanced data, the cost for minority class samples is increased to ensure they receive adequate attention.

## 9. Feature Evolvable
   - **Definition**: The concept that the feature space may evolve over time, with new features emerging or old features becoming irrelevant.
   - **Explanation**: In real-world scenarios, feature distributions may change, requiring the model to adapt and select the most relevant features dynamically.

