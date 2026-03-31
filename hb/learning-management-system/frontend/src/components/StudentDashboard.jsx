import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'

export default function StudentDashboard() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseDetails, setCourseDetails] = useState({ lessons: [], tests: [] })

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch(`${API_BASE_URL}/api/courses`)
      const data = await res.json()
      setCourses(data)
    }
    fetchCourses()
  }, [])

  const loadCourse = async (courseId) => {
    setSelectedCourse(courseId)
    const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/details`)
    const data = await res.json()
    setCourseDetails(data)
  }

  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <h2>AVAILABLE DIRECTIVES (Courses)</h2>
        <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {courses.map(course => (
            <div key={course.id} className="course-card" onClick={() => loadCourse(course.id)} style={{ cursor: 'pointer' }}>
              <h3>{course.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
              <span className="link" style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'inline-block' }}>ACCESS DATABANK &rarr;</span>
            </div>
          ))}
          {courses.length === 0 && <p>No databanks found in the system.</p>}
        </div>
      </div>

      <div className="glass-panel">
        <h2>DATABANK VIEWER</h2>
        {!selectedCourse ? (
          <p className="mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>
             [ SYSTEM AWAITING SELECTION ]
          </p>
        ) : (
          <div className="mt-4">
             <h3>MODULE CONTENT</h3>
             {courseDetails.lessons.length === 0 && <p>No holotapes (videos) found.</p>}
             
             {courseDetails.lessons.map(lesson => (
               <div key={lesson.id} style={{ marginBottom: '2rem' }}>
                 <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>{lesson.title}</h4>
                 <div className="video-container">
                   <iframe 
                      src={lesson.youtube_url} 
                      title={lesson.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                   </iframe>
                 </div>
               </div>
             ))}

             {courseDetails.tests.length > 0 && (
               <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                 <h3>EVALUATION PROTOCOLS</h3>
                 <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                   {courseDetails.tests.map(test => (
                     <a key={test.id} href={test.test_url} target="_blank" rel="noreferrer" className="test-link">
                       [{test.title}] INITIALIZE &rarr;
                     </a>
                   ))}
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  )
}
