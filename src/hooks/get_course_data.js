import react, { useState, useEffect } from "react";
import { useAllPrograms } from "./get_courses.js";

export const useProgramData = (programId) => {
  const { programsData, loading_p, error_p } = useAllPrograms();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program_data =
      programsData && programsData.find((p) => p.uid === programId);
      setProgram(program_data || null);
      setLoading(false);
  }, [programId, programsData]);

  return { program, loading };
};

export const useCourseData = (programId, courseId) => {
  const { programsData, loading_p, error_p } = useAllPrograms();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program =
      programsData && programsData.find((p) => p.uid === programId);
    const foundCourse = program?.courses.find((c) => c.uid === courseId);
      setCourse(foundCourse || null);
      setLoading(false);
  }, [programId, courseId, programsData]);

  return { course, loading };
};

export const useModuleData = (programId, courseId, moduleId) => {
  const { programsData } = useAllPrograms();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const program =
      programsData && programsData.find((p) => p.uid === programId);
    const course = program?.courses.find((c) => c.uid === courseId);
    const foundModule = course?.modules.find((m) => m.uid === moduleId);
      setModule(foundModule || null);
      setLoading(false);
  }, [programId, courseId, moduleId, programsData]);

  return { module, loading };
};
