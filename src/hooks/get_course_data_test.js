import { useState, useEffect } from "react";
import ill1 from "@/assets/images/illstration_2.jpg";
import ill2 from "@/assets/images/illstration_1.jpg";
import ill3 from "@/assets/images/illu3.jpg";
import ill4 from "@/assets/images/illu4.jpg";
import ill5 from "@/assets/images/illu5.jpg";
const dummyCourses = [
  {
    program_id: "program1",
    title: "Example program",
    courses: [
      {
        course_id: "dig_lit",
        title: "Digital Media Literacy And Storytelling",
        description:
          "An introductory course to the scientific method, focusing on how scientific inquiry works.",
        image: ill3,
        modules: [
          {
            title: "Finding and Structuring Your Personal Story",
            module_id: "1",
            content: [
              {
                id: "sec-1",
                title: "Introduction to Biology",
                content: [
                  {
                    header: "",
                    text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                    media: "https://example.com/images/biology_intro.jpg",
                  },
                ]
              },
              {
                id: "sec-2",
                title: "The Scientific Method",
                content: [
                  {
                    text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                    media: "https://example.com/images/scientific_method.jpg",
                  },
                ],
              },
            ],
            questions: [{
                    question: "What is biology the study of?",
                    options: [
                      "Rocks and minerals",
                      "The Earth’s atmosphere",
                      "Life and living organisms",
                      "Stars and planets",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question:
                      "Which of the following is NOT a step in the scientific method?",
                    options: [
                      "Observation",
                      "Hypothesis",
                      "Experimentation",
                      "Guesswork",
                    ],
                    answer: 3,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },],

            metadata: {
              estimated_time: "45 minutes",
              level: "Beginner",
              release_date: "2025-06-01",
            },
          },
          {
            title: "Recording and Editing with Your Phone",
            module_id: "2",
            sections: [
              {
                id: "sec-1",
                title: "Introduction to Biology",
                content: [
                  {
                    text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                    media: "https://example.com/images/biology_intro.jpg",
                  },
                ],
                quiz: [
                  {
                    question: "What is biology the study of?",
                    options: [
                      "Rocks and minerals",
                      "The Earth’s atmosphere",
                      "Life and living organisms",
                      "Stars and planets",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question:
                      "Which of the following is NOT a step in the scientific method?",
                    options: [
                      "Observation",
                      "Hypothesis",
                      "Experimentation",
                      "Guesswork",
                    ],
                    answer: 3,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
              {
                id: "sec-2",
                title: "The Scientific Method",
                content: [
                  {
                    text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                    media: "https://example.com/images/scientific_method.jpg",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the first step in the scientific method?",
                    options: [
                      "Form a hypothesis",
                      "Conduct an experiment",
                      "Make an observation",
                      "Analyze results",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question: "Why must a hypothesis be falsifiable?",
                    options: [
                      "To make it sound scientific",
                      "So it can be proven true",
                      "So it can be tested and possibly disproven",
                      "To ensure it aligns with existing theories",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
            ],
            final_quiz: {
              title: "Biology 102 Final Evaluation",
              description:
                "A comprehensive quiz to assess your understanding of Biology and the Scientific Method.",
              questions: [
                {
                  question:
                    "Which of the following best describes the scientific method?",
                  options: [
                    "A set of beliefs that explain life",
                    "A way to test ideas using observation and experimentation",
                    "An unchanging list of facts",
                    "A government-mandated procedure",
                  ],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "Biology includes the study of all of the following EXCEPT:",
                  options: [
                    "Cellular structure",
                    "Chemical reactions",
                    "Economic systems",
                    "Evolution",
                  ],
                  answer: 2,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "True or False: A hypothesis must always be correct.",
                  options: ["True", "False"],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
              ],
            },
            metadata: {
              estimated_time: "45 minutes",
              level: "Beginner",
              author: "Novage Learning Team",
              release_date: "2025-06-01",
            },
          },
          {
            title: "Sharing Safely and Measuring Your Impact",
            module_id: "3",
            sections: [
              {
                id: "sec-1",
                title: "Introduction to Biology",
                content: [
                  {
                    text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                    media: "https://example.com/images/biology_intro.jpg",
                  },
                ],
                quiz: [
                  {
                    question: "What is biology the study of?",
                    options: [
                      "Rocks and minerals",
                      "The Earth’s atmosphere",
                      "Life and living organisms",
                      "Stars and planets",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question:
                      "Which of the following is NOT a step in the scientific method?",
                    options: [
                      "Observation",
                      "Hypothesis",
                      "Experimentation",
                      "Guesswork",
                    ],
                    answer: 3,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
              {
                id: "sec-2",
                title: "The Scientific Method",
                content: [
                  {
                    text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                    media: "https://example.com/images/scientific_method.jpg",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the first step in the scientific method?",
                    options: [
                      "Form a hypothesis",
                      "Conduct an experiment",
                      "Make an observation",
                      "Analyze results",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question: "Why must a hypothesis be falsifiable?",
                    options: [
                      "To make it sound scientific",
                      "So it can be proven true",
                      "So it can be tested and possibly disproven",
                      "To ensure it aligns with existing theories",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
            ],
            final_quiz: {
              title: "Biology 102 Final Evaluation",
              description:
                "A comprehensive quiz to assess your understanding of Biology and the Scientific Method.",
              questions: [
                {
                  question:
                    "Which of the following best describes the scientific method?",
                  options: [
                    "A set of beliefs that explain life",
                    "A way to test ideas using observation and experimentation",
                    "An unchanging list of facts",
                    "A government-mandated procedure",
                  ],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "Biology includes the study of all of the following EXCEPT:",
                  options: [
                    "Cellular structure",
                    "Chemical reactions",
                    "Economic systems",
                    "Evolution",
                  ],
                  answer: 2,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "True or False: A hypothesis must always be correct.",
                  options: ["True", "False"],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
              ],
            },
            metadata: {
              estimated_time: "45 minutes",
              level: "Beginner",
              author: "Novage Learning Team",
              release_date: "2025-06-01",
            },
          },
        ],
        metadata: {
          no_of_lessons: 3,
        },
      },
      {
        course_id: "bio_101",
        title: "Course 2 example",
        description:
          "An introductory course to biology, focusing on the fundamentals of life.",
        image: ill4,
        no_of_lessons: 1,
        modules: [
          {
            title: "Finding and Structuring Your Personal Story",
            module_id: "bio_101_1",
            course_id: "bio_101",
            sections: [
              {
                id: "sec-1",
                title: "Introduction to Biology",
                content: [
                  {
                    media: ill1,
                    text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                  },
                  {
                    media: ill2,
                    header: "what does this mean?",
                    text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                  },
                ],
                quiz: [
                  {
                    question: "What is biology the study of?",
                    options: [
                      "Rocks and minerals",
                      "The Earth’s atmosphere",
                      "Life and living organisms",
                      "Stars and planets",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question:
                      "Which of the following is NOT a step in the scientific method?",
                    options: [
                      "Observation",
                      "Hypothesis",
                      "Experimentation",
                      "Guesswork",
                    ],
                    answer: 3,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
              {
                id: "sec-2",
                title: "The Scientific Method",
                content: [
                  {
                    text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                    media: "https://example.com/images/scientific_method.jpg",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the first step in the scientific method?",
                    options: [
                      "Form a hypothesis",
                      "Conduct an experiment",
                      "Make an observation",
                      "Analyze results",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question: "Why must a hypothesis be falsifiable?",
                    options: [
                      "To make it sound scientific",
                      "So it can be proven true",
                      "So it can be tested and possibly disproven",
                      "To ensure it aligns with existing theories",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
            ],
            final_quiz: {
              title: "Biology 102 Final Evaluation",
              description: "Let's review what you have learned so far!!",
              questions: [
                // {
                //   question:
                //     "Which of the following best describes the scientific method?",
                //   options: [
                //     "A set of beliefs that explain life",
                //     "A way to test ideas using observation and experimentation",
                //     "An unchanging list of facts",
                //     "A government-mandated procedure",
                //   ],
                //   answer: 1,
                //   explanation:
                //     "The mitochondria produce ATP, the main energy currency of the cell.",
                // },
                // {
                //   question: "What is biology the study of?",
                //   options: [
                //     "Rocks and minerals",
                //     "The Earth’s atmosphere",
                //     "Life and living organisms",
                //     "Stars and planets",
                //   ],
                //   answer: 2,
                //   explanation:
                //     "The mitochondria produce ATP, the main energy currency of the cell.",
                // },
                // {
                //   question: "What is the first step in the scientific method?",
                //   options: [
                //     "Form a hypothesis",
                //     "Conduct an experiment",
                //     "Make an observation",
                //     "Analyze results",
                //   ],
                //   answer: 2,
                //   explanation:
                //     "The mitochondria produce ATP, the main energy currency of the cell.",
                // },
                // {
                //   question: "Why must a hypothesis be falsifiable?",
                //   options: [
                //     "To make it sound scientific",
                //     "So it can be proven true",
                //     "So it can be tested and possibly disproven",
                //     "To ensure it aligns with existing theories",
                //   ],
                //   answer: 2,
                //   explanation:
                //     "The mitochondria produce ATP, the main energy currency of the cell.",
                // },
                {
                  question:
                    "Which of the following is NOT a step in the scientific method?",
                  options: [
                    "Observation",
                    "Hypothesis",
                    "Experimentation",
                    "Guesswork",
                  ],
                  answer: 3,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "Biology includes the study of all of the following EXCEPT:",
                  options: [
                    "Cellular structure",
                    "Chemical reactions",
                    "Economic systems",
                    "Evolution",
                  ],
                  answer: 2,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "True or False: A hypothesis must always be correct.",
                  options: ["True", "False"],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
              ],
            },
          },
          {
            title: "Recording and Editing with Your Phone",
            module_id: "2",
            sections: [
              {
                id: "sec-1",
                title: "Introduction to Biology",
                content: [
                  {
                    text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                    media: "https://example.com/images/biology_intro.jpg",
                  },
                ],
                quiz: [
                  {
                    question: "What is biology the study of?",
                    options: [
                      "Rocks and minerals",
                      "The Earth’s atmosphere",
                      "Life and living organisms",
                      "Stars and planets",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question:
                      "Which of the following is NOT a step in the scientific method?",
                    options: [
                      "Observation",
                      "Hypothesis",
                      "Experimentation",
                      "Guesswork",
                    ],
                    answer: 3,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
              {
                id: "sec-2",
                title: "The Scientific Method",
                content: [
                  {
                    text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                    media: "https://example.com/images/scientific_method.jpg",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the first step in the scientific method?",
                    options: [
                      "Form a hypothesis",
                      "Conduct an experiment",
                      "Make an observation",
                      "Analyze results",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                  {
                    question: "Why must a hypothesis be falsifiable?",
                    options: [
                      "To make it sound scientific",
                      "So it can be proven true",
                      "So it can be tested and possibly disproven",
                      "To ensure it aligns with existing theories",
                    ],
                    answer: 2,
                    explanation:
                      "The mitochondria produce ATP, the main energy currency of the cell.",
                  },
                ],
              },
            ],
            final_quiz: {
              title: "Biology 102 Final Evaluation",
              description:
                "A comprehensive quiz to assess your understanding of Biology and the Scientific Method.",
              questions: [
                {
                  question:
                    "Which of the following best describes the scientific method?",
                  options: [
                    "A set of beliefs that explain life",
                    "A way to test ideas using observation and experimentation",
                    "An unchanging list of facts",
                    "A government-mandated procedure",
                  ],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "Biology includes the study of all of the following EXCEPT:",
                  options: [
                    "Cellular structure",
                    "Chemical reactions",
                    "Economic systems",
                    "Evolution",
                  ],
                  answer: 2,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
                {
                  question:
                    "True or False: A hypothesis must always be correct.",
                  options: ["True", "False"],
                  answer: 1,
                  explanation:
                    "The mitochondria produce ATP, the main energy currency of the cell.",
                },
              ],
            },
            metadata: {
              estimated_time: "45 minutes",
              level: "Beginner",
              author: "Novage Learning Team",
              release_date: "2025-06-01",
            },
          },
        ],
      },
    ],
    final_quiz: {
      quiz_title: "",
      quiz_description: "",
      isFinal: true,
      questions: [],
      metadata: {
        question_num: 5,
        difficulty: "",
        pass_grade_percentage: "",
      },
    },
    metadata: {
      course_num: 2,
      difficulty: "",
      estimated_time: "",
      uploaded_by: "",
      release_date: "",
    },
  },
];

export const useModuleData = (courseId, moduleId) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const course = dummyCourses.find((c) => c.course_id === courseId);
    if (course) {
      const module_read = course.modules.find((m) => m.module_id === moduleId);
      setTimeout(() => {
        setModule(module_read || null);
        setLoading(false);
      }, 500); // simulate loading delay
    }
  }, [courseId, moduleId]);

  return { module, loading };
};

export default dummyCourses;
