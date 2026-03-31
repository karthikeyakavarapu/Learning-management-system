import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  // Lesson/Test Inputs
  const [lessonTitle, setLessonTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [testTitle, setTestTitle] = useState('')
  const [testUrl, setTestUrl] = useState('')

  const fetchCourses = async () => {
    const res = await fetch(`${API_BASE_URL}/api/courses`)
    const data = await res.json()
    // Normally filter by instructor ID, assuming simple demo filter
    setCourses(data)
  }

  useEffect(() => { fetchCourses() }, [])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    // Simulated auth token extraction
    const userId = localStorage.getItem('user_id') || 1
    await fetch(`${API_BASE_URL}/api/courses?instructor_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })
    setTitle('')
    setDescription('')
    fetchCourses()
  }

  const handleAddLesson = async (courseId) => {
    if(!lessonTitle || !youtubeUrl) return
    let embedUrl = youtubeUrl
    // Transform tu embed URL if needed
    if (youtubeUrl.includes('watch?v=')) {
        embedUrl = youtubeUrl.replace('watch?v=', 'embed/')
    } else if (youtubeUrl.includes('youtu.be/')) {
        embedUrl = youtubeUrl.replace('youtu.be/', 'youtube.com/embed/')
    }
    await fetch(`${API_BASE_URL}/api/courses/${courseId}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: lessonTitle, youtube_url: embedUrl })
    })
    setLessonTitle('')
    setYoutubeUrl('')
    alert("Lesson uploaded successfully.")
  }

  const handleAddTest = async (courseId) => {
    if(!testTitle || !testUrl) return
    await fetch(`${API_BASE_URL}/api/courses/${courseId}/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: testTitle, test_url: testUrl })
    })
    setTestTitle('')
    setTestUrl('')
    alert("Test uploaded successfully.")
  }

  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <h2>CREATE NEW MODULE</h2>
        <form onSubmit={handleCreateCourse} className="mt-4">
          <div className="form-group">
            <label>COURSE_TITLE</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>SYSTEM_DIRECTIVE (Description)</label>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} required />
          </div>
          <button className="btn" type="submit">INITIALIZE PROTOCOL</button>
        </form>
      </div>

      <div className="glass-panel">
        <h2>YOUR UPLOADED DATABANKS</h2>
        <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
              
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <h4>UPLOAD HOLOTAPE (Lesson)</h4>
                <div className="embed-group">
                  <input placeholder="Title" value={lessonTitle} onChange={(e)=>setLessonTitle(e.target.value)} />
                  <input placeholder="YouTube Link" value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.target.value)} />
                  <button className="btn" onClick={() => handleAddLesson(course.id)}>PUSH</button>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4>UPLOAD EVALUATION (Test)</h4>
                <div className="embed-group">
                  <input placeholder="Test Title" value={testTitle} onChange={(e)=>setTestTitle(e.target.value)} />
                  <input placeholder="Assessment Link" value={testUrl} onChange={(e)=>setTestUrl(e.target.value)} />
                  <button className="btn" onClick={() => handleAddTest(course.id)}>PUSH</button>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p>No databanks found in the system.</p>}
        </div>
      </div>
    </div>
  )
}
