import { useState, useEffect } from "react";
import ill1 from "@/assets/images/illstration_2.jpg";
import ill2 from "@/assets/images/illstration_1.jpg";
import ill3 from "@/assets/images/illu3.jpg";
import ill4 from "@/assets/images/illu4.jpg";
import ill5 from "@/assets/images/illu5.jpg";
import picC from "@/assets/test_imgs/close.png"
import picCA from "@/assets/test_imgs/cutaway.png"
import picM from "@/assets/test_imgs/mid.png"
import picOTS from "@/assets/test_imgs/ots.png"
import picW from "@/assets/test_imgs/wide.png"

const dummyCourses = [
  {
    program_id: "program1",
    title: "Example program",
    courses: [
      {
        course_id: "dig_lit",
        title: "Digital Media Literacy And Storytelling",
        description:
          "From story to impact: a complete 3-module course to help you shape, record, and share a personal story ethically and powerfully using just your phone.",
        image: ill3,
        modules: [
          {
            module_id: "dig_lit_1",
            title: "Finding and Structuring Your Personal Story",
            content: [
              {
                header: "Stories shape memory, emotion, and action.",
                text: "What you post online can either build understanding and peace or spread division and hate. Your story has real-world consequences, influencing how people think and behave.",
              },
              {
                header: "A strong personal story has structure and emotion.",
                text: "A compelling story usually has three main parts: a beginning (who you are and where you come from), a middle (a meaningful experience or conflict), and an end (how you or your perspective changed). This arc gives your audience a journey to follow and connect with.",
              },
              {
                header: "Themes matter!",
                text: "Stories that center around peace, justice, hope, or community connect deeply with audiences. These universal themes help others relate to your journey and create space for dialogue.",
              },
              {
                header: "⚠️ Avoid general or vague storytelling.",
                text: "If your story is too distant or impersonal, people may not connect with it. Use vivid, specific details to show what happened and how it felt. Vulnerability makes your story powerful.",
              },
            ],
            quiz: [
              {
                question:
                  "What three parts should every good personal story include?",
                options: [
                  "Start, Conflict, Solution",
                  "Facts, Feelings, Feedback",
                  "Beginning, Middle, and End",
                  "Introduction, Body, and Summary",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "Why are personal stories more powerful than abstract messages online?",
                options: [
                  "They are always true",
                  "They sound more professional",
                  "They help people emotionally connect and understand better",
                  "They get more likes",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "If your story’s theme is “community,” what kind of moment could you share?",
                options: [
                  "A time you saw a post about your community",
                  "A time you helped neighbors or your community support you",
                  "A news article about the community",
                  "A funny video about teamwork",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "What makes a story feel more personal and emotional?",
                options: [
                  "Using big words",
                  "Speaking quickly",
                  "Sharing specific, real-life moments",
                  "Talking about other people’s stories",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question: "Which of these is a universal theme?",
                options: [
                  "Your favorite food",
                  "Justice",
                  "A new phone review",
                  "School rules",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
            ],
            metadata: {
              estimated_time: "10 minutes",
              level: "Beginner",
              release_date: "2025-06-01",
            },
          },
          {
            module_id: "dig_lit_2",
            title: "Recording and Editing with Your Phone",
            content: [
              {
                header: "Steps to prepare your phone for storytelling",
                text: "Use natural lighting (like sitting near a window), clean your camera lens, and stabilize your phone to avoid shaky shots. These simple steps make your video feel more trustworthy and engaging.",
              },
              {
                header: "Film three essential shots to tell a full story:",
                text: "Wide shot (shows where you are)",
                media: picW,
                breaker: true,
              },
              {
                text: "Medium shot (shows you or another person talking)",
                media: picM,
                breaker: true,
              },
              {
                text: "Close-up (captures feelings or emotional moments)",
                media: picC,
              },
              {
                header: "These angles create rhythm and keep viewers interested.",
                text: "Cutaways and over-the-shoulder shots show objects, memories, or the world around you. These visuals enrich the narrative and add emotional texture.",
              },
              {
                text: "Cutaways shots",
                media: picCA,
                breaker: true,
              },
              {
                text: "over-the-shoulder shots",
                media: picOTS,
              },
              {
                header: "⚠️ Don’t only talk — show",
                text: "Visual storytelling is stronger than words alone. Let your setting, objects, or photos support your spoken message.",
              },
              {
                header: "Finally...",
                text: "Editing apps help shape your final video. Use free tools like CapCut, VN Editor, or InShot to trim, rearrange, add subtitles, and voice-overs. Edit with feeling—let emotion guide your choices.",
              },
            ],
            quiz: [
              {
                question:
                  "What are the three important shot types for story filming?",
                options: [
                  "Zoom, Pan, Flash",
                  "Horizontal, Vertical, Tilt",
                  "Wide shot, Medium shot, Close-up",
                  "Daylight, Twilight, Night",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "Why use a cutaway or over-the-shoulder shot in your video?",
                options: [
                  "To make the video longer",
                  "To show objects or emotions without only using your face",
                  "To hide mistakes",
                  "To make the video look more dramatic",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "Which free app can you use to edit your story video on your phone?",
                options: [
                  "TikTok",
                  "CapCut, VN Editor, or InShot",
                  "YouTube",
                  "Safari",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "Why should you clean your camera lens before filming?",
                options: [
                  "To make your phone work faster",
                  "To save battery",
                  "To get a clear, sharp video",
                  "To make your phone lighter",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question: "Why is editing important?",
                options: [
                  "To make your story longer",
                  "To organize the message and add feeling",
                  "To remove the sound",
                  "To add funny filters",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
            ],
            metadata: {
              estimated_time: "10 minutes",
              level: "Beginner",
              release_date: "2025-06-01",
            },
          },
          {
            module_id: "dig_lit_3",
            title: "Sharing Safely and Measuring Your Impact",
            content: [
              {
                header: "",
                text: "Make your video accessible: include captions and describe visuals. Use clear, simple audio so your message reaches more people.",
              },
              {
                header: "",
                text: "Use inclusive language. Avoid inside jokes or slang and speak in a way that welcomes all audiences.",
              },
              {
                header: "",
                text: "Be authentic and include a message. Speak from the heart and add a call to action for what viewers can do or feel after watching.",
              },
              {
                header: "",
                text: "⚠️ Always ask for consent before filming others. Respect people’s dignity, especially in emotional or sensitive settings.",
              },
              {
                header: "",
                text: "Know your impact: look beyond likes. Notice if your story sparks comments, shares, or real conversation.",
              },
            ],
            quiz: [
              {
                question:
                  "What are two important things to include to make your video more accessible?",
                options: [
                  "Emojis and jokes",
                  "Subtitles and background music",
                  "Captions and clear descriptions of visuals",
                  "Filters and effects",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "Why should you get someone’s consent before filming them?",
                options: [
                  "So they can post it themselves",
                  "To protect their dignity, privacy, and safety",
                  "Because it’s polite",
                  "To follow social media rules",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "How can you tell if your video made an impact online?",
                options: [
                  "It gets 1,000 views",
                  "People follow your account",
                  "People comment, share, or talk about it",
                  "You get tagged in other posts",
                ],
                answer: 2,
                explanation: "some text explaining this and that",
              },
              {
                question: "What is a call to action in your video?",
                options: [
                  "A long quote at the end",
                  "A suggestion for what people can do or feel after watching",
                  "A phone call in your video",
                  "A funny meme",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
              {
                question:
                  "What should you do if someone doesn’t permit you to be filmed?",
                options: [
                  "Post it anyway",
                  "Blur their face or don’t include the footage",
                  "Say sorry in the comments",
                  "Tell them later",
                ],
                answer: 1,
                explanation: "some text explaining this and that",
              },
            ],
            metadata: {
              estimated_time: "7 minutes",
              level: "Beginner",
              release_date: "2025-06-01",
            },
          },
        ],
        metadata: {
          no_of_lessons: 3,
          difficulty: "Easy",
          estimated_time: "27min",
          author: "Novage Edu",
          release_date: "2025-07-09",
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
      quiz_title: "program 1 final quiz",
      quiz_description: "final quiz description this ans that you know",
      isFinal: true,
      image: ill5,
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
      final_pass_point: 80,
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
    setTimeout(() => {
      setProgram(program_data || null);
      setLoading(false);
    }, 500); // simulate loading
  }, [programId]);

  return { program, loading };
};

export const useCourseData = (programId, courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program = dummyCourses.find((p) => p.program_id === programId);
    const foundCourse = program?.courses.find((c) => c.course_id === courseId);
    setTimeout(() => {
      setCourse(foundCourse || null);
      setLoading(false);
    }, 500);
  }, [programId, courseId]);

  return { course, loading };
};

export const useModuleData = (programId, courseId, moduleId) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program = dummyCourses.find((p) => p.program_id === programId);
    const course = program?.courses.find((c) => c.course_id === courseId);
    const foundModule = course?.modules.find((m) => m.module_id === moduleId);
    setTimeout(() => {
      setModule(foundModule || null);
      setLoading(false);
    }, 500);
  }, [programId, courseId, moduleId]);

  return { module, loading };
};

export default dummyCourses;
