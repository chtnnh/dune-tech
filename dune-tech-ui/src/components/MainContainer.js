import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Spinner, Alert } from 'react-bootstrap';
import StoryContainer from './StoryContainer';
import HomePage from './HomePage';
import { parseMarkdown } from '../utils/markdownParser';

const MainContainer = ({ markdownContent }) => {
    const [stories, setStories] = useState([]);
    const [activeStory, setActiveStory] = useState(null);
    const [showHomePage, setShowHomePage] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (markdownContent) {
            try {
                const parsedStories = parseMarkdown(markdownContent);
                setStories(parsedStories);
                setLoading(false);
            } catch (err) {
                console.error('Error parsing markdown content:', err);
                setError('Failed to parse content. Please check the format.');
                setLoading(false);
            }
        }
    }, [markdownContent]);

    const handleStorySelect = (index) => {
        setActiveStory(index);
        setShowHomePage(false);
    };

    const handleBackToHome = () => {
        setShowHomePage(true);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-2">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Loading stories...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Error
                    </Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-4 shadow">
                <Container>
                    <Navbar.Brand href="#" onClick={handleBackToHome} style={{ cursor: 'pointer' }}>
                        <i className="bi bi-shield-fill-check me-2"></i>
                        Dune Tech AI Safety Stories
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {stories.map((story, index) => (
                                <Nav.Link
                                    key={index}
                                    active={!showHomePage && activeStory === index}
                                    onClick={() => handleStorySelect(index)}
                                    className="px-3"
                                >
                                    <i className={`bi bi-${index === 0 ? 'book' : index === 1 ? 'person-fill' : 'cpu'} me-2`}></i>
                                    {story.title}
                                </Nav.Link>
                            ))}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {showHomePage ? (
                <HomePage
                    sections={stories}
                    onSelectSection={handleStorySelect}
                />
            ) : (
                stories.length > 0 &&
                activeStory !== null &&
                stories[activeStory] && (
                    <StoryContainer
                        story={stories[activeStory]}
                        onBack={handleBackToHome}
                    />
                )
            )}

            {stories.length === 0 && (
                <Container className="my-5">
                    <Alert variant="info">
                        <Alert.Heading>
                            <i className="bi bi-info-circle-fill me-2"></i>
                            No stories found
                        </Alert.Heading>
                        <p>
                            No stories were found in the provided content. Please check the format of your markdown file.
                        </p>
                    </Alert>
                </Container>
            )}
        </div>
    );
};

export default MainContainer;
