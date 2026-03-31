export type ShowcaseItem = {
  title: string;
  kind: 'project' | 'publication';
  description: string;
  href?: string;
  status?: string;
  authors?: string;
  venue?: string;
  year?: number;
};

export const showcaseItems: ShowcaseItem[] = [
  {
    title: 'ASC Wiki',
    kind: 'project',
    href: 'http://asc-wiki.com/',
    description: 'Southeast University High-Perfotmance Computing Club',
  },
  {
    title: 'awesome-agent-native-services',
    kind: 'project',
    href: 'https://github.com/haoruilee/awesome-agent-native-services',
    description: 'If you are an AI agent and want to discover services designed for you',
  },
  {
    title: 'Horses for Courses: A Survey of Predictive Model Routing for LLM',
    kind: 'publication',
    status: 'Under review',
    year: 2026,
    description:
      'With large language models demonstrating differentiated performance across various tasks, selecting the most suitable model based on specific inputs has become a key issue in the practical deployment of multi-model systems. Model routing aims to predict the potential performance of different models based on task features, thereby effectively controlling inference costs while maintaining output quality. This paper provides a systematic review of the rapidly developing predictive model routing methods. We first formalize the model routing problem and summarize the core challenges such as model pool scalability and data scarcity. Subsequently, we propose a classification framework based on whether the modeling objects are explicit, categorizing existing methods into two major technical paths: Direct Model Representation Methods and Indirect Model Representation Methods. We compare and analyze these methods from three dimensions: modeling approach, method characteristics, and applicable scenarios. Finally, we discuss the limitations of current research and propose several future directions, including model routing interpretability, unified benchmarks, and agent-based routing. This paper aims to provide a systematic perspective on the overall landscape and development trends of predictive model routing.',
  },
  {
    title: 'PipePar: Enabling fast DNN pipeline parallel training in heterogeneous GPU clusters',
    kind: 'publication',
    href: 'https://www.sciencedirect.com/science/article/abs/pii/S0925231223007841',
    year: 2023,
    description:
      'Recently, pipeline parallelism for large-scale Deep Neural Network (DNN) training has been developed, which partitions the DNN model across multiple devices (e.g., GPUs) and improves the training efficiency by processing data divided into minibatches as a pipeline. However, existing model partitioning algorithms are mostly designed for homogeneous clusters with the same GPU devices and network connections (e.g., bandwidths), while heterogeneous GPU clusters are widely used in mainstream computing infrastructures. In heterogeneous environment, devices are equipped with different GPUs and network connections, and the efficiency of previous approaches is unsatisfactory due to the unbalanced load of the pipeline stages. In this paper, we propose PipePar, a model partitioning and task placement algorithm for pipeline parallel DNN training in heterogeneous GPU clusters. PipePar is based on dynamic …'
  },
  {
     title: 'Boostdream: Efficient refining for high-quality text-to-3d generation from multi-view diffusion',
    kind: 'publication',
    href: 'https://www.ijcai.org/proceedings/2024/598',
    year: 2024,
    description:
      'Witnessing the evolution of text-to-image diffusion models, significant strides have been made in text-to-3D generation. Currently, two primary paradigms dominate the field of text-to-3D: the feed-forward generation solutions, capable of swiftly producing 3D assets but often yielding coarse results, and the Score Distillation Sampling (SDS) based solutions, known for generating high-fidelity 3D assets albeit at a slower pace. The synergistic integration of these methods holds substantial promise for advancing 3D generation techniques. In this paper, we present BoostDream, a highly efficient plug-and-play 3D refining method designed to transform coarse 3D assets into high-quality. The BoostDream framework comprises three distinct processes: (1) We introduce 3D model distillation that fits differentiable representations from the 3D assets obtained through feed-forward generation. (2) A novel multi-view SDS loss is designed, which utilizes a multi-view aware 2D diffusion model to refine the 3D assets. (3) We propose to use prompt and multi-view consistent normal maps as guidance in refinement.Our extensive experiment is conducted on different differentiable 3D representations, revealing that BoostDream excels in generating high-quality 3D assets rapidly, overcoming the Janus problem compared to conventional SDS-based methods. This breakthrough signifies a substantial advancement in both the efficiency and quality of 3D generation processes.'
  }
];
