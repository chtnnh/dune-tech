import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const HomePage = ({ sections, onSelectSection }) => {
    // Helper function to get the icon for each story
    const getStoryIcon = (index) => {
        const icons = ['book', 'person-fill', 'cpu', 'globe', 'shield', 'chat-quote'];
        return icons[index % icons.length];
    };

    // Helper function to get a brief description based on the story title
    const getStoryDescription = (story) => {
        if (!story || !story.narrative) return '';

        // Extract the first few sentences of the narrative for a brief description
        const firstParagraph = story.narrative.split('\n\n')[0];
        // Limit to around 150 characters
        return firstParagraph.length > 150
            ? firstParagraph.substring(0, 150) + '...'
            : firstParagraph;
    };

    return (
        <Container className="py-5 fade-in">
            <div className="text-center mb-5">
                <h1 className="display-4 mb-3">Dune Tech AI Safety Stories</h1>
                <p className="lead text-muted">
                    Explore interactive stories that highlight ethical challenges and safety concerns in artificial intelligence, featuring decision points that let you shape the narrative.
                </p>
            </div>

            <Row xs={1} md={2} className="g-4">
                {sections.map((story, index) => (
                    <Col key={index}>
                        <Card className="h-100 shadow-sm story-card">
                            <Card.Header className="bg-dark text-white d-flex align-items-center">
                                <i className={`bi bi-${getStoryIcon(index)} me-2 fs-4`}></i>
                                <h3 className="mb-0 fs-5">{story.title}</h3>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {getStoryDescription(story)}
                                </Card.Text>
                                {story.decisionPoints && story.decisionPoints.length > 0 && (
                                    <div className="mt-3">
                                        <h6>Make decisions at these key points:</h6>
                                        <ul className="list-group list-group-flush">
                                            {story.decisionPoints.map((point, idx) => (
                                                <li key={idx} className="list-group-item bg-light mb-2 rounded">
                                                    <i className="bi bi-signpost-2 me-2"></i>
                                                    <strong>Decision Point {point.number}:</strong>{" "}
                                                    {point.question.length > 65
                                                        ? point.question.substring(0, 65).trim() + '...'
                                                        : point.question}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card.Body>
                            <Card.Footer className="bg-white border-0 text-end">
                                <Button
                                    variant="primary"
                                    onClick={() => onSelectSection(index)}
                                    className="start-story-btn"
                                >
                                    <i className="bi bi-play-circle-fill me-2"></i>
                                    Start this Story
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage;
