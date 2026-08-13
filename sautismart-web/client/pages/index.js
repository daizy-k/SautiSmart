import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>SautiSmart | Kenyan CBC Music Education Platform</title>
      </Head>

      <section
        className="d-flex align-items-center"
        style={{ backgroundColor: '#0F7173', color: '#FFFFFF', minHeight: '60vh' }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span
                className="badge rounded-pill mb-3 px-3 py-2"
                style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}
              >
                Grades 4 &ndash; 9 &middot; CBC Aligned
              </span>
              <h1 className="display-4 fw-bold mb-3">Learn, Practice, and Preserve Kenyan Music.</h1>
              <p className="lead mb-4">
                SautiSmart replaces static MP3s and worn-out CDs with an interactive digital
                guide &mdash; giving every learner access to a specialist music teacher, a
                cultural archive of Kenyan folk songs and instruments, and set-piece practice
                tools that slow down without losing pitch.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  href="/setpieces"
                  className="btn btn-lg fw-semibold"
                  style={{ backgroundColor: '#69DC9E', color: '#0C0C0C' }}
                >
                  Practice a Set Piece
                </Link>
                <Link href="/archive" className="btn btn-lg btn-outline-light fw-semibold">
                  Explore the Cultural Archive
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#0C0C0C' }}>
            Everything a Music Classroom Needs, in One Platform
          </h2>
          <p className="text-secondary">
            Built to close the resource gap in Kenyan public primary and junior secondary
            schools.
          </p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ backgroundColor: '#E59F71', width: '56px', height: '56px', color: '#0C0C0C' }}
                >
                  <span className="fs-4">&#9835;</span>
                </div>
                <h3 className="h5 fw-bold" style={{ color: '#0F7173' }}>
                  Cultural Archive
                </h3>
                <p className="card-text text-secondary">
                  Discover traditional folk songs and indigenous instruments, organized by
                  tribe of origin and cultural occasion.
                </p>
                <Link href="/archive" className="fw-semibold" style={{ color: '#E59F71' }}>
                  Browse the Archive &rarr;
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ backgroundColor: '#69DC9E', width: '56px', height: '56px', color: '#0C0C0C' }}
                >
                  <span className="fs-4">&#9658;</span>
                </div>
                <h3 className="h5 fw-bold" style={{ color: '#0F7173' }}>
                  Set Piece Practice
                </h3>
                <p className="card-text text-secondary">
                  Slow set pieces down or speed them up in real time, and isolate individual
                  stems to practice your part alone.
                </p>
                <Link href="/setpieces" className="fw-semibold" style={{ color: '#E59F71' }}>
                  Start Practicing &rarr;
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ backgroundColor: '#0F7173', width: '56px', height: '56px', color: '#FFFFFF' }}
                >
                  <span className="fs-4">&#9834;</span>
                </div>
                <h3 className="h5 fw-bold" style={{ color: '#0F7173' }}>
                  Theory Revision
                </h3>
                <p className="card-text text-secondary">
                  Structured, syllabus-aligned music theory modules for every grade level, from
                  Grade 4 to Grade 9.
                </p>
                <Link href="/theory" className="fw-semibold" style={{ color: '#E59F71' }}>
                  Revise Theory &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
