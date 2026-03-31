---
title: Real Meaning of Rank
date: 2024-07-14 11:45:55
tags:
- post
thumbnail: https://i.dawnlab.me/cc0041adbacfae3c0fea386293404ecf.png
math: true
---
# The True Meaning of Determinants and Matrix Rank

Here, we first discuss a mathematical question that has long puzzled students of engineering and even physics: What is the real meaning of area, and how is it generalized to higher dimensions?

## Area, a Type of Mapping

You might say, area is just length multiplied by width, but that’s not entirely true. Let's clarify that the area we're discussing here is the basic unit of Euclidean geometric area: the area of a parallelogram. Geometrically, the area of a parallelogram is defined as the product of the lengths of two adjacent sides and the sine of the angle between them.

However, to deal with more general situations and higher-dimensional mathematical problems, we need to extend the definition of area. Note the following fact:

Area is a scalar, derived from two vectors (forming its adjacent sides). Therefore, we can view the area as a mapping:

$$
\varphi: \mathfrak{X}(M) \times \mathfrak{X}(M) \rightarrow \mathfrak{F}(M), V \times V \mapsto f
$$

Where \( V \) is a vector, \( V \times V \) represents an ordered pair of vectors, and \( f \) is the value of the area.

Next, we will show that this mapping is a linear one.

Starting with the simplest example: If the first vector is (1,0) and the second vector is (0,1), meaning the two vectors are unit vectors on the X and Y axes respectively, then the parallelogram formed by these two vectors is a square. According to the definition, its area is length multiplied by width = 1*1 = 1.

![1720928890761](https://chatgpt5.oss-rg-china-mainland.aliyuncs.com/image/real_meaning_of_rank/image/real_meaning_of_rank/1720928890761.png)

Therefore:

$$
\varphi((1,0),(0,1))=1
$$

If we "scale" the first vector by a factor of \( a \), the area will correspondingly be \( a \) times the original; if we "scale" the second vector by a factor of \( b \), the area will also become \( b \) times the original. If both vectors are scaled, it is obvious that the area will become \( ab \) times the original area. This shows that the area mapping is linear with respect to the scalar multiplication of its two operands (vectors), as follows:

$$
\begin{aligned}
& \varphi(a(1,0),(0,1))=a \varphi((1,0),(0,1)) \\
& \varphi((1,0), b(0,1))=b \varphi((1,0),(0,1))
\end{aligned} \Rightarrow \varphi(a(1,0), b(0,1))=a b \varphi((1,0),(0,1))=a b
$$

Finally, we must show that the area mapping is also linear with respect to the vector addition of its operands. Since the operation of vector addition is itself linear, its area mapping should naturally be a linear mapping. Here we intend to illustrate the consequences of the linearity of the mapping's addition through several practical examples.

It is evident that the parallelogram formed by two collinear vectors is still a line, and therefore the area is zero:

![1720928989597](https://chatgpt5.oss-rg-china-mainland.aliyuncs.com/image/real_meaning_of_rank/image/real_meaning_of_rank/1720928989597.png)

Which means:

$$
\varphi(a,a)=0
$$

Assuming the area mapping is a linear mapping concerning vector addition, we have:

$$
\begin{aligned}
\varphi((1,0)+(0,1),(1,0)+(0,1))=0 & =\varphi((1,0),(0,1))+\varphi((1,0),(1,0))+\varphi((0,1),(0,1))+\varphi((0,1),(1,0)) \\
& =\varphi((1,0),(0,1))+\varphi((0,1),(1,0))
\end{aligned}
$$

Thus we get:

$$
\varphi((1,0),(0,1)) = -\varphi((0,1),(1,0))
$$

That is to say, exchanging the order of mutually perpendicular operand vectors changes the sign of the area mapping. Which is positive and which is negative depends on the definition. Generally, we place the unit vector on the X-axis first and the unit vector on the Y-axis second, and take the area of the parallelogram formed from the X-axis to the Y-axis as positive.

Thus, we introduce the right-hand rule. Note that the right-hand rule is only valid in three-dimensional space. If we take the positive direction of the X-axis as the head and the positive direction of the Y-axis as the tail, the right-hand rule tells us that the outward direction from the paper is the positive direction of the area; if reversed, the inward direction from the paper is the positive direction of the area, opposite to the defined positive direction, and the sign is negative. The geometric meaning of the area’s sign then becomes apparent.

It is not difficult to see that the so-called area is the determinant of a 2x2 matrix:

$$
\left|\begin{array}{ll}
a & b \\
c & d
\end{array}\right|=\left|\begin{array}{ll}
a & c \\
b & d
\end{array}\right|=a d-b c
$$

As shown below:

![1720929547070](https://chatgpt5.oss-rg-china-mainland.aliyuncs.com/image/real_meaning_of_rank/image/real_meaning_of_rank/1720929547070.png)

Where the first row is our first row vector \( (a, b) \); the second row is the second row vector \( (c, d) \). Or the first column is the first column vector \( (a, b)^T \), and the second column is the second column vector \( (c, d)^T \). This depends on whether we write the vector as a row vector (the former) or a column vector (the latter).

From this, we can easily see that the value of the determinant is independent of whether the vectors are written as row vectors or column vectors. This is why we say that rows and columns are equal when calculating determinants. Additionally, note that from the above analysis, exchanging the order of vectors results in the area value taking a negative sign. This explains why exchanging row or column vectors in a determinant changes the sign. Other properties of determinant calculation are also reflected in the linearity of the area mapping.

Thus, we see that the determinant is a generalization of "area." It represents the volume of an N-dimensional generalized parallelepiped spanned by N vectors under a given set of bases. This is the essential meaning of the determinant.

## Generalizing Determinants

From the above, we can easily extend to the calculation of three-dimensional volume:

$$
V(\vec{a}, \vec{b}, \vec{c})=\left|\begin{array}{c}
\vec{a} \\
\vec{b} \\
\vec{c}
\end{array}\right|=\left|\begin{array}{lll}
\vec{a} & \vec{b} & \vec{c}
\end{array}\right|
$$

Note that the definition of the determinant involves taking the product of elements from different rows and columns, and the sign is related to the so-called parity. Parity has a geometric meaning: after defining a positive direction (such as the sequence 1, 2, 3, 4, 5...N as positive), swapping any pair of numbers changes the sign. We have seen this property in the area function above. In fact, volume and higher-dimensional generalized volumes also have a concept of positive direction, although it is challenging to illustrate using the right-hand rule and cross products. The limitation of the right-hand rule is one motivation for expressing higher-dimensional areas as determinants.

This property, where swapping any pair of indices (operands) changes the sign, is called antisymmetric. The reason for taking products of elements from different rows and columns is that if any two elements are from the same row (or column), swapping their column indices leaves the product unchanged but changes the sign, making the product zero, which does not contribute to the determinant's value.

The definition of the determinant is complicated because of the antisymmetry of the area mapping. In fact, the area mapping is a 2-form. Extending a 2-form to any R-form, we see that the form and the determinant of an R x R matrix are identical.

From the above, we can see that a 2-form represents area in a plane; a 3-form represents volume in three-dimensional space; a 4-form represents hypervolume in four-dimensional space, and so on. In reality, by writing these vectors as matrices under a given set of bases (which must be square matrices), the matrix's determinant corresponds to the area (volume). The proof of this generalization can be found in any specialized textbook on linear algebra (or self-verified if not).

## The Geometric Meaning of Linear Independence

Let N be the dimension of space, and given a set of vectors, what does it mean for them to be linearly independent? We will explain that the essence of linear independence of a set of vectors is whether the volume of the generalized parallelepiped spanned by them is zero.

We start again from the simplest two-dimensional space. If two vectors in a two-dimensional space are linearly dependent, one is collinear with the other, meaning the parallelogram they span has an area of zero. Conversely, if they are linearly independent, they are not collinear, so the area is not zero.

Similarly, if three vectors in three-dimensional space are linearly independent, they do not lie in the same plane, so the volume of the parallelepiped they span is not zero.

Furthermore, we know that in a two-dimensional space, if three vectors are given, they must lie in the same plane (a two-dimensional space cannot have a "volume"), so they must be linearly dependent. Therefore, we can understand why in an N-dimensional space, any set of M vectors (where M > N) must be linearly dependent: because a generalized parallelepiped of dimension greater than the space's dimension does not exist.

Thus, we obtain a one-to-one correspondence:

N linearly independent vectors == The volume of the N-dimensional body they span is not zero.

Conversely, if N vectors are linearly dependent, the volume of the N-dimensional body they span is zero.

For example, the parallelogram formed by a pair of collinear vectors degenerates into a line, and its area is obviously zero; the parallelepiped formed by a set of coplanar vectors degenerates into a plane, and its volume is obviously zero.

Since we already know the relationship between the determinant and the area, we conclude:

The determinant of a matrix composed of linearly independent vectors is not zero; the determinant of a matrix composed of linearly dependent vectors must be zero.

## Determinants and Matrix Inverses

We know that a matrix with a determinant of zero is non-invertible; a matrix with a non-zero determinant is invertible. One might ask, how is the determinant, representing area, related to the invertibility of linear transformations?

When we understand the geometric meaning of linear transformations, it becomes clear. We state the following:

Let the matrix of the linear transformation be \( A \).

If we write a set of linearly independent vectors in space as column vectors, the volume of the N-dimensional body they span is not zero. According to the above analysis, its value is given by the determinant. After the vectors are transformed by the linear transformation \( A \), the new vectors are:

$$
\vec{a}_i^{\prime}=A \vec{a}_i, i \in\{1, \ldots, n\}
$$

Note that \( A \) is an \( N \times N \) matrix, and the vectors are column vectors.

Before the transformation, the volume of the N-dimensional body is:

$$
V = \left|  \vec{a}_1, \vec{a}_2, ..., \vec{a}_n \right|
$$

After the transformation, the volume of the N-dimensional body is (note that the second equation actually explains the geometric meaning of matrix multiplication, i.e., the multiplication of an \( N \times N \) matrix \( A \) with another \( N \times N \) matrix composed of \( N \) column vectors):

$$
\begin{aligned}
& V^{\prime}=\left|\begin{array}{llll}
\vec{a}_1^{\prime} & \vec{a}_2^{\prime} & \ldots & \vec{a}_n^{\prime}
\end{array}\right|=\left|A \cdot\left(\begin{array}{llll}
\vec{a}_1 & \vec{a}_2 & \ldots & \vec{a}_n
\end{array}\right)\right| \\
& =|A| \left\lvert\, \begin{array}{llll}
\vec{a}_1 & \vec{a}_2 & \cdots & \vec{a}_n|=| A \mid V
\end{array}\right. \\
&
\end{aligned}
$$

If the determinant of \( A \) is not zero, it means that after the transformation, the volume of the N-dimensional body is not null. Combined with the nature of linear independence and volume, we can say:

If the determinant of \( A \) is not zero, then \( A \) can map a set of linearly independent vectors to another set of linearly independent vectors; \( A \) is invertible (a one-to-one mapping, faithful mapping, kernel is {0}).

If the determinant of \( A \) is zero, then \( A \) will map a set of linearly independent vectors to a set of linearly dependent vectors; \( A \) is not invertible (non-faithful mapping, kernel is not {0}). We can study its cosets.

If the determinant of \( A \) is negative, \( A \) will change the orientation of the original N-dimensional body's volume.

From linear independence to linear dependence, some information is lost (e.g., collapsing into collinearity or coplanarity), making the transformation obviously non-invertible. The linear independence of vectors and the volume of the N-dimensional body they span are directly related, and this volume value is related to the determinant of \( A \). Therefore, we establish a geometric relationship between the determinant of \( A \) and its invertibility.

For example, suppose \( A \) is a three-dimensional matrix. If there is a set of three linearly independent vectors before the mapping, we know that the volume they span is not zero. After the mapping, the new vectors can still span a parallelepiped, and the volume of this parallelepiped is the original volume multiplied by the determinant of \( A \).

Obviously, if the determinant of \( A \) is zero, the volume of the new "parallelepiped" after the transformation will inevitably be zero. According to the previous conclusion, the new set of vectors after the transformation is linearly dependent.

Conclusion:

Whether the determinant of the linear transformation \( A \) is zero represents the fidelity of its mapping, i.e., whether it can map a set of linearly independent vectors to another set of linearly independent vectors.

## Matrix Rank

Sometimes, although \( A \) cannot maintain the linear independence of the largest set of vectors in space, it can maintain the linear independence of a smaller set of vectors. This number is often less than the dimension of \( A \) (or the dimension of the linear space), and this number is called the rank of the linear transformation \( A \).

For example, a 3x3 matrix \( A \) with a rank of 2. Because the rank is less than 3, any three-dimensional parallelepiped after its transformation has a volume of zero (degenerates into a plane); but there exists a plane with a non-zero area that can still be transformed into a plane with a non-zero area.

The so-called rank of a linear transformation is simply the maximum dimension of the geometric shapes that can maintain non-zero volume after the transformation.

Understanding the geometric meaning of rank, determinant, and invertibility, we can easily construct some linear transformations \( A \) that either preserve all geometric bodies or compress specific-dimensional geometric bodies into lower-dimensional geometric bodies. Isn’t this the so-called "dimensionality reduction strike"? Therefore, the ultimate move in the "Three-Body Problem" is essentially a linear transformation with a determinant of zero and a rank one less than the dimension.

The extension to higher dimensions is left to the reader; also, the proof of the linearity of the area function is left to the reader to verify strictly.

Bo Zheng,
UCB, 2011
From https://zhuanlan.zhihu.com/p/19609459


# My comments

Lets think some reality examples to use bozheng's theory.

## Matrix Decomposition and Transformations into n-Dimensional Subspaces

Building upon our discussion of determinants and matrix rank, we now delve into the fascinating realm of matrix decomposition. Understanding how matrices of different ranks can be decomposed not only illuminates their structural properties but also provides deep insights into how these matrices transform spaces into various dimensional subspaces.

### Matrix Decomposition Based on Rank

The **rank** of a matrix fundamentally dictates how it can be decomposed into simpler, rank-1 components. This decomposition is pivotal for simplifying complex linear transformations and for applications across engineering, physics, and data science.

#### 1. **Rank 0: The Zero Matrix**

- **Definition**: A matrix $A$ has rank 0 if and only if all its entries are zero.
  
- **Decomposition**:
  $$
  A = 0 = \mathbf{0} \cdot \mathbf{0}^T
  $$
  
- **Geometric Interpretation**: The zero matrix maps every vector to the zero vector, effectively collapsing the entire space into a single point.

#### 2. **Rank 1: Outer Product of Two Vectors**

- **Definition**: A matrix $A$ has rank 1 if it can be expressed as the outer product of two non-zero vectors.
  
- **Decomposition**:
  $$
  A = \mathbf{u} \mathbf{v}^T
  $$
  where $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$.
  
- **Geometric Interpretation**:
  - **Column Space**: All columns of $A$ are scalar multiples of $\mathbf{u}$, lying along a single line in $\mathbb{R}^3$.
  - **Row Space**: All rows of $A$ are scalar multiples of $\mathbf{v}^T$, also lying along a single line.
  - **Transformation**: $A$ maps any vector $\mathbf{x}$ to a vector in the direction of $\mathbf{u}$, scaled by the projection of $\mathbf{x}$ onto $\mathbf{v}$.
  
- **Example**:
  $$
  A = \begin{pmatrix} 2 \\ 4 \\ 6 \end{pmatrix} \begin{pmatrix} 1 & 0 & -1 \end{pmatrix} = \begin{pmatrix} 2 & 0 & -2 \\ 4 & 0 & -4 \\ 6 & 0 & -6 \end{pmatrix}
  $$
  This matrix has rank 1, as all columns are multiples of $\begin{pmatrix} 2 \\ 4 \\ 6 \end{pmatrix}$.

#### 3. **Rank 2: Sum of Two Rank-1 Matrices**

- **Definition**: A matrix $A$ has rank 2 if it can be expressed as the sum of two rank-1 matrices.
  
- **Decomposition**:

  $$
  A = \mathbf{a}_1 \mathbf{b}_1^T + \mathbf{a}_2 \mathbf{b}_2^T
  $$

  where $\mathbf{a}_1, \mathbf{a}_2 \in \mathbb{R}^3$ are linearly independent, and $\mathbf{b}_1, \mathbf{b}_2 \in \mathbb{R}^3$.
  
- **Geometric Interpretation**:
  - **Column Space**: Spanned by the two vectors $\mathbf{a}_1$ and $\mathbf{a}_2$, forming a plane in $\mathbb{R}^3$.
  - **Row Space**: Spanned by the two vectors $\mathbf{b}_1$ and $\mathbf{b}_2$, also forming a plane.
  - **Transformation**: $A$ maps vectors in $\mathbb{R}^3$ onto a two-dimensional subspace, effectively "flattening" the space onto a plane.
  
- **Example**:


  $$
  A = \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} \begin{pmatrix} 4 & 5 & 6 \end{pmatrix} + \begin{pmatrix} 7 \\ 8 \\ 9 \end{pmatrix} \begin{pmatrix} 10 & 11 & 12 \end{pmatrix} = \begin{pmatrix} 74 & 82 & 90 \\ 88 & 98 & 108 \\ 102 & 114 & 126 \end{pmatrix}
  $$
  This matrix has rank 2, as it is the sum of two rank-1 matrices with linearly independent column vectors.

#### 4. **Rank 3: Full-Rank Matrix**

- **Definition**: A matrix $A$ has rank 3 if it cannot be expressed as the sum of fewer than three rank-1 matrices.
  
- **Decomposition**:
  $$
  A = \mathbf{u}_1 \mathbf{v}_1^T + \mathbf{u}_2 \mathbf{v}_2^T + \mathbf{u}_3 \mathbf{v}_3^T
  $$
  where $\mathbf{u}_1, \mathbf{u}_2, \mathbf{u}_3 \in \mathbb{R}^3$ are linearly independent, and $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3 \in \mathbb{R}^3$.
  
- **Geometric Interpretation**:
  - **Column Space**: Spanned by three linearly independent vectors, filling the entire $\mathbb{R}^3$ space.
  - **Row Space**: Similarly, spanned by three linearly independent vectors.
  - **Transformation**: $A$ is invertible and maps $\mathbb{R}^3$ onto itself without any loss of dimensionality.
  
- **Example**:
  $$
  A = \mathbf{u}_1 \mathbf{v}_1^T + \mathbf{u}_2 \mathbf{v}_2^T + \mathbf{u}_3 \mathbf{v}_3^T
  $$
  Where $\mathbf{u}_1, \mathbf{u}_2, \mathbf{u}_3$ and $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3$ are all linearly independent vectors in $\mathbb{R}^3$.

### Transformations into n-Dimensional Subspaces

Matrix decomposition provides a powerful framework for understanding how linear transformations interact with the geometry of space. By decomposing a matrix based on its rank, we can visualize how it projects, rotates, scales, or otherwise transforms vectors within $\mathbb{R}^n$.

#### 1. **Rank 1 Transformations: Projection onto a Line**

- **Description**: A rank 1 matrix maps all vectors onto a single line in $\mathbb{R}^n$.
  
- **Geometric Action**: Every input vector is scaled and directed along the vector $\mathbf{u}$, effectively projecting the entire space onto the line spanned by $\mathbf{u}$.
  
- **Visualization**: Imagine shining a light perpendicular to the line spanned by $\mathbf{u}$; all shadows (images) of vectors under the transformation $A = \mathbf{u} \mathbf{v}^T$ fall onto that line.

#### 2. **Rank 2 Transformations: Projection onto a Plane**

- **Description**: A rank 2 matrix maps all vectors onto a two-dimensional plane within $\mathbb{R}^n$.
  
- **Geometric Action**: The transformation combines projections along two independent directions, preserving the planar structure while collapsing higher-dimensional information.
  
- **Visualization**: Picture projecting vectors onto a sheet of paper. The transformation preserves two-dimensional relationships while losing information in the perpendicular direction.

#### 3. **Rank $k$ Transformations: Projection onto a $k$-Dimensional Subspace**

- **Description**: In general, a rank $k$ matrix maps vectors onto a $k$-dimensional subspace of $\mathbb{R}^n$.
  
- **Geometric Action**: The transformation maintains the structure within the $k$-dimensional subspace while eliminating components orthogonal to it.
  
- **Visualization**: For $k = 3$, the transformation preserves three-dimensional volume. For higher $k$, it preserves higher-dimensional analogs of volume, such as hypervolumes.

### Singular Value Decomposition (SVD) and Rank

One of the most powerful tools for matrix decomposition is the **Singular Value Decomposition (SVD)**. SVD provides a canonical form that reveals the rank and intrinsic geometric properties of a matrix.

#### **Singular Value Decomposition**

- **Definition**:
  $$
  A = U \Sigma V^T
  $$
  where:
  - $U$ is an $m \times m$ orthogonal matrix.
  - $\Sigma$ is an $m \times n$ diagonal matrix with non-negative real numbers on the diagonal (singular values).
  - $V$ is an $n \times n$ orthogonal matrix.
  
- **Relation to Rank**:
  - The number of non-zero singular values in $\Sigma$ corresponds to the rank of $A$.
  - Each non-zero singular value represents a dimension in the column and row spaces.
  
- **Geometric Interpretation**:
  - **Columns of $V$**: Represent the directions in the input space that are stretched or compressed.
  - **Columns of $U$**: Represent the directions in the output space corresponding to these stretched or compressed inputs.
  - **Singular Values**: Indicate the magnitude of stretching or compression along each corresponding direction.

#### **Example of SVD**

Consider a rank 2 matrix $A$:
$$
A = \mathbf{a}_1 \mathbf{b}_1^T + \mathbf{a}_2 \mathbf{b}_2^T
$$
Its SVD can be written as:
$$
A = U \Sigma V^T = \sigma_1 \mathbf{u}_1 \mathbf{v}_1^T + \sigma_2 \mathbf{u}_2 \mathbf{v}_2^T
$$
where $\sigma_1, \sigma_2$ are the non-zero singular values, and $\mathbf{u}_1, \mathbf{u}_2$, $\mathbf{v}_1, \mathbf{v}_2$ are the corresponding singular vectors.

### Practical Implications of Matrix Decomposition

Understanding matrix decomposition based on rank has profound implications in various fields:

#### 1. **Data Compression and Dimensionality Reduction**

- **Principal Component Analysis (PCA)**:
  - Utilizes SVD to identify the principal components that capture the most variance in the data.
  - Reduces the dimensionality of data by projecting it onto a lower-dimensional subspace spanned by the top singular vectors.

#### 2. **Signal Processing**

- **Noise Reduction**:
  - By decomposing a signal matrix and truncating smaller singular values, it's possible to filter out noise while preserving significant signal components.

#### 3. **Machine Learning and Recommendation Systems**

- **Latent Factor Models**:
  - Decompose user-item interaction matrices to uncover underlying factors that explain observed interactions, enabling personalized recommendations.

#### 4. **Computer Graphics and Image Processing**

- **Image Compression**:
  - Represent images as low-rank matrices to reduce storage requirements without significant loss of quality.

### Conclusion

Matrix decomposition based on rank is not merely an abstract mathematical exercise but a cornerstone of modern computational techniques. By decomposing matrices into sums of rank-1 components or through SVD, we gain invaluable insights into the structure and transformative capabilities of linear operators. This understanding enables us to manipulate and analyze high-dimensional data efficiently, paving the way for advancements in technology, science, and engineering.

Understanding how different ranks correspond to transformations into various dimensional subspaces empowers us to harness the full potential of linear algebra in practical applications. Whether compressing data, filtering signals, or making informed recommendations, matrix decomposition remains an indispensable tool in the mathematician's and engineer's toolkit.

