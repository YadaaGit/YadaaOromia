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
                header: "",
                text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                media: "https://example.com/images/biology_intro.jpg",
              },
              {
                header: "",
                text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                media: "https://example.com/images/scientific_method.jpg",
              },
            ],
            questions: [
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
            metadata: {
              estimated_time: "45 minutes",
              level: "Beginner",
              release_date: "2025-06-01",
            },
          },
          {
            title: "Recording and Editing with Your Phone",
            module_id: "2",
            contents: [
              {
                text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                media: "https://example.com/images/biology_intro.jpg",
              },
              {
                header: "",
                text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                media: "https://example.com/images/scientific_method.jpg",
              },
            ],
            questions: [
              {
                question: "What is the first step in the scientific method?",
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
            content: [
              {
                header: "",
                text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                media: "https://example.com/images/biology_intro.jpg",
              },
              {
                header: "",
                text: `The scientific method is a systematic process for learning about the world around us and answering questions.
It typically involves making observations, forming a hypothesis, conducting experiments, and drawing conclusions based on the results.

This process allows scientists to test ideas and refine their understanding through repeatable and measurable results.
A good scientific hypothesis is testable and falsifiable.`,
                media: "https://example.com/images/scientific_method.jpg",
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
              {
                question: "What is the first step in the scientific method?",
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
        metadata: {
          no_of_lessons: 3,
          difficulty: "Easy",
          estimated_time: "45min",
          author: "Novage Edu",
          release_date: "07/09/2025",
        },
      },
      {
        course_id: "bio_101",
        title: "Course 2 example",
        description:
          "An introductory course to biology, focusing on the fundamentals of life.",
        image: ill4,
        modules: [
          {
            title: "Finding and Structuring Your Personal Story",
            module_id: "bio_101_1",
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
                question: "What is the first step in the scientific method?",
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
            title: "Recording and Editing with Your Phone",
            module_id: "2",
            content: [
              {
                text: `Biology is the study of life. It is a broad field that covers the structure, function, growth, origin, evolution, and distribution of living organisms.
As a science, biology relies on the scientific method to answer questions about life and living organisms. This includes careful observation, hypothesis formulation, experimentation, and data analysis.

In this section, you will learn the core characteristics that define life and explore why biology is such a crucial field in understanding our natural world.`,
                media: "https://example.com/images/biology_intro.jpg",
              },
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
              {
                question: "What is the first step in the scientific method?",
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
        metadata: {
          no_of_lessons: 3,
          difficulty: "Medium",
          estimated_time: "45min",
          author: "Novage Edu",
          release_date: "07/09/2025",
        },
      },
    ],
    final_quiz: {
      quiz_title: "final quiz",
      quiz_description: "eyyeyyegygvdyegce",
      isFinal: true,
      image: ill5,
      questions: [
        {
          question: "What is the first step in the scientific method?",
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
      author: "",
      release_date: "",
    },
  },
];

export const useProgramData = (programId) => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program_data = dummyCourses.find((p) => p.program_id === programId);
    if (program_data) {
      setTimeout(() => {
        setProgram(program_data || null);
        setLoading(false);
      }, 500); // simulate loading delay
    } else {
      setTimeout(() => {
        setCourse(null);
        setLoading(false);
      }, 500);
    }
  }, [programId]);

  return { program, loading };
};

export const useCourseData = (programId, courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program = dummyCourses.find((p) => p.program_id === programId);
    if (program) {
      const course = program.courses.find((c) => c.course_id === courseId);
      setTimeout(() => {
        setCourse(course || null);
        setLoading(false);
      }, 500); // simulate loading delay
    } else {
      setTimeout(() => {
        setCourse(null);
        setLoading(false);
      }, 500);
    }
  }, [programId, courseId]);

  return { course, loading };
};

export const useModuleData = (programId, courseId, moduleId) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program = dummyCourses.find((p) => p.program_id === programId);
    if (program) {
      const course = program.courses.find((c) => c.course_id === courseId);
      if (course) {
        const module = course.modules.find((c) => c.module_id === moduleId);
        setTimeout(() => {
          setModule(module || null);
          setLoading(false);
        }, 500);
      } else {
        setTimeout(() => {
          setModule(null);
          setLoading(false);
        }, 500);
      }
    } else {
      setTimeout(() => {
        setModule(null);
        setLoading(false);
      }, 500);
    }
  }, [programId, courseId, moduleId]);

  return { module, loading };
};

export default dummyCourses;
