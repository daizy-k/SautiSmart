import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const GRADE_ORDER = ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];

export default function TheoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGrade, setActiveGrade] = useState('Grade 4');

  // Route Protection: Redirect unauthenticated users to /login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let isMounted = true;
    async function fetchModules() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/theory`);
        if (!res.ok) {
          throw new Error(`Failed to load theory modules (status ${res.status})`);
        }
        const data = await res.json();
        if (isMounted) {
          setModules(Array.isArray(data.data) ? data.data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    if (user) {
      fetchModules();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const modulesByGrade = useMemo(() => {
    const grouped = {};
    GRADE_ORDER.forEach((grade) => {
      grouped[grade] = [];
    });
    modules.forEach((module) => {
      if (!grouped[module.gradeLevel]) {
        grouped[module.gradeLevel] = [];
      }
      grouped[module.gradeLevel].push(module);
    });
    Object.keys(grouped).forEach((grade) => {
      grouped[grade].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    return grouped;
  }, [modules]);

  const availableGrades = useMemo(
    () => GRADE_ORDER.filter((grade) => modulesByGrade[grade] && modulesByGrade[grade].length > 0),
    [modulesByGrade]
  );

  if (authLoading || !user) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" style={{ color: '#0F7173' }} role="status">
          <span className="visually-hidden">Checking access...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Theory Revision | SautiSmart</title>
      </Head>

      <section style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }} className="py-5">
        <div className="container">
          <h1 className="fw-bold">Music Theory Revision Modules</h1>
          <p className="lead mb-0">
            Structured, syllabus-aligned theory lessons for Grade 4 through Grade 9.
          </p>
        </div>
      </section>

      <section className="container py-4">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#0F7173' }} role="status">
              <span className="visually-hidden">Loading theory modules...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            Could not load theory modules: {error}
          </div>
        )}

        {!loading && !error && modules.length === 0 && (
          <div className="alert" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
            No theory modules have been published yet.
          </div>
        )}

        {!loading && !error && modules.length > 0 && (
          <>
            <ul className="nav nav-pills mb-4 flex-wrap gap-2">
              {availableGrades.map((grade) => (
                <li className="nav-item" key={grade}>
                  <button
                    type="button"
                    className="nav-link"
                    style={
                      activeGrade === grade
                        ? { backgroundColor: '#0F7173', color: '#FFFFFF' }
                        : { backgroundColor: '#FFFFFF', color: '#0C0C0C', border: '1px solid #0F7173' }
                    }
                    onClick={() => setActiveGrade(grade)}
                  >
                    {grade}
                  </button>
                </li>
              ))}
            </ul>

            <div className="accordion" id="theoryAccordion">
              {(modulesByGrade[activeGrade] || []).map((theoryModule, index) => {
                const collapseId = `theory-collapse-${theoryModule._id}`;
                return (
                  <div className="accordion-item" key={theoryModule._id}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded={index === 0 ? 'true' : 'false'}
                        aria-controls={collapseId}
                        style={{ color: '#0C0C0C' }}
                      >
                        <span className="fw-semibold me-2">{theoryModule.title}</span>
                        <span
                          className="badge rounded-pill ms-2"
                          style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}
                        >
                          {theoryModule.strand}
                        </span>
                      </button>
                    </h2>
                    <div id={collapseId} className="accordion-collapse collapse" data-bs-parent="#theoryAccordion">
                      <div className="accordion-body">
                        {theoryModule.subStrand && (
                          <p className="small text-secondary mb-2">
                            <strong>Sub-Strand:</strong> {theoryModule.subStrand}
                          </p>
                        )}
                        {Array.isArray(theoryModule.learningObjectives) &&
                          theoryModule.learningObjectives.length > 0 && (
                            <div className="mb-3">
                              <p className="fw-semibold small mb-1" style={{ color: '#0F7173' }}>
                                Learning Objectives
                              </p>
                              <ul className="small">
                                {theoryModule.learningObjectives.map((objective, objectiveIndex) => (
                                  <li key={objectiveIndex}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        <div dangerouslySetInnerHTML={{ __html: theoryModule.content || '' }} />
                        {Array.isArray(theoryModule.quizQuestions) && theoryModule.quizQuestions.length > 0 && (
                          <div
                            className="mt-3 p-3 rounded"
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid #69DC9E' }}
                          >
                            <p className="fw-semibold small mb-2" style={{ color: '#0F7173' }}>
                              Quick Check
                            </p>
                            {theoryModule.quizQuestions.map((question, questionIndex) => (
                              <div key={questionIndex} className="mb-2">
                                <p className="small fw-semibold mb-1">{question.questionText}</p>
                                <ul className="small mb-0">
                                  {Array.isArray(question.options) &&
                                    question.options.map((option, optionIndex) => (
                                      <li
                                        key={optionIndex}
                                        style={
                                          optionIndex === question.correctAnswerIndex
                                            ? { color: '#0F7173', fontWeight: 600 }
                                            : {}
                                        }
                                      >
                                        {option}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                        {Array.isArray(theoryModule.resources) && theoryModule.resources.length > 0 && (
                          <div className="mt-3">
                            <p className="fw-semibold small mb-1" style={{ color: '#0F7173' }}>
                              Further Resources
                            </p>
                            <ul className="small">
                              {theoryModule.resources.map((resource) => (
                                <li key={resource.url}>
                                  <a href={resource.url} target="_blank" rel="noreferrer">
                                    {resource.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
}
