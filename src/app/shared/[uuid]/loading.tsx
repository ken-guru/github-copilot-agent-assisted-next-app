/**
 * Loading component for shared session pages
 * Displays while session data is being fetched
 */

import { Card, Placeholder, Row, Col } from 'react-bootstrap';

export default function Loading() {
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <Card className="summary-card h-100">
            <Card.Header className="card-header-consistent">
              <Placeholder as="h5" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <div className="d-flex gap-2 align-items-center">
                <Placeholder.Button variant="primary" xs={4} />
              </div>
            </Card.Header>
            
            <Card.Body>
              {/* Session metadata placeholder */}
              <div className="alert alert-info mb-3">
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={7} className="mb-1" />
                  <Placeholder xs={5} className="mb-1" />
                  <Placeholder xs={6} />
                </Placeholder>
              </div>

              {/* Status message placeholder */}
              <div className="alert alert-secondary mb-3">
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
              </div>

              {/* Stats grid placeholder */}
              <Row className="stats-grid g-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <Col xs={6} md={3} key={i}>
                    <Card className="text-center h-100">
                      <Card.Body>
                        <Placeholder as="div" animation="glow">
                          <Placeholder xs={8} size="sm" className="mb-2" />
                          <Placeholder xs={6} size="lg" />
                        </Placeholder>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Activity list placeholder */}
              <div className="mt-4">
                <Placeholder as="h3" animation="glow" className="h5 mb-3">
                  <Placeholder xs={5} />
                </Placeholder>
                
                <div className="list-group list-group-flush">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <Placeholder as="span" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder.Button variant="primary" xs={2} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info section placeholder */}
              <div className="mt-4">
                <div className="alert alert-light border">
                  <div className="d-flex align-items-start">
                    <div className="me-2 mt-1">
                      <i className="bi bi-info-circle"></i>
                    </div>
                    <div className="flex-grow-1">
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={4} className="fw-bold mb-1" />
                        <Placeholder xs={12} className="mb-1" />
                        <Placeholder xs={8} />
                      </Placeholder>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}