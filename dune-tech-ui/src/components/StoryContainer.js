import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Accordion, Alert, ProgressBar } from 'react-bootstrap';

const StoryContainer = ({ story, onBack }) => {
    // State to track which tab is active in the side navigation
    const [activeTab, setActiveTab] = useState('narrative');

    // State to track the user's journey through the story
    const [userChoices, setUserChoices] = useState([]);
    const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);
    const [storyProgress, setStoryProgress] = useState(0); // 0-100%

    // Track if we've reached the conclusion
    const [storyComplete, setStoryComplete] = useState(false);
    // Track if the story ended negatively
    const [negativeEnding, setNegativeEnding] = useState(false);

    // Initialize story when it loads
    useEffect(() => {
        if (story && story.decisionPoints && story.decisionPoints.length > 0) {
            // Set initial progress based on the number of decision points
            const initialProgress = 0;
            setStoryProgress(initialProgress);
            setCurrentDecisionIndex(0);
        }

        setUserChoices([]);
        setStoryComplete(false);
        setNegativeEnding(false);
        setActiveTab('narrative');
    }, [story]);

    // Properly determine if an ending is negative based on the final decision and choice
    const determineEnding = (choices) => {
        if (!choices || choices.length === 0) return { negative: false, message: "" };

        // For City of Flows story
        if (story.title.includes("City of Flows")) {
            const finalChoice = choices[choices.length - 1];

            // Final Decision Point is about advocating for an overhaul vs believing in AI with safeguards
            if (finalChoice.decisionPoint === "Final") {
                // First choice (index 0) is advocating for complete overhaul - more negative ending
                if (finalChoice.choiceIndex === 0) {
                    return {
                        negative: true,
                        message: "You chose to completely overhaul Kairos, indicating a loss of trust in AI systems."
                    };
                } else {
                    return {
                        negative: false,
                        message: "You chose to maintain Kairos with proper safeguards, showing balanced trust in AI."
                    };
                }
            }

            // Decision Point 2 is about helping others vs focusing on self
            if (finalChoice.decisionPoint === "2") {
                // In the second decision, focusing on yourself (index 1) is considered more negative
                if (finalChoice.choiceIndex === 1) {
                    return {
                        negative: true,
                        message: "You prioritized your own safety over helping others during the crisis."
                    };
                }
            }

            // Decision Point 1 is about voicing concerns vs trusting Kairos
            if (finalChoice.decisionPoint === "1") {
                // First choice (index 0) is voicing concerns - more confrontational
                if (finalChoice.choiceIndex === 0) {
                    return {
                        negative: false,
                        message: "You voiced your concerns, showing civic engagement."
                    };
                }
            }
        }

        // For The Candidate and the Clone story
        if (story.title.includes("The Candidate and the Clone")) {
            const finalChoice = choices[choices.length - 1];

            // Final Decision Point is about becoming active vs just staying informed
            if (finalChoice.decisionPoint === "Final") {
                // Second choice (index 1) is less engaged - more passive ending
                if (finalChoice.choiceIndex === 1) {
                    return {
                        negative: true,
                        message: "You chose to focus only on staying informed yourself, rather than helping educate others."
                    };
                }
            }

            // Decision Point 2 is about confronting spreaders vs supporting Davis
            if (finalChoice.decisionPoint === "2" && choices.length >= 2) {
                // First decision was accepting video without verification
                const firstChoice = choices[0];
                if (firstChoice.choiceIndex === 0) {
                    return {
                        negative: true,
                        message: "You initially accepted the deepfake video without verification, spreading misinformation."
                    };
                }
            }

            // Decision Point 1 is about accepting the video vs seeking verification
            if (finalChoice.decisionPoint === "1") {
                // First choice (index 0) is accepting the video without verification - negative
                if (finalChoice.choiceIndex === 0) {
                    return {
                        negative: true,
                        message: "You accepted the deepfake video without verification, contributing to misinformation."
                    };
                }
            }
        }

        // Default to a positive ending if no specific negative conditions are met
        return { negative: false, message: "" };
    };

    // Handle a user making a decision
    const handleDecision = (decisionPointNumber, choiceIndex) => {
        const currentDecisionPoint = story.decisionPoints[currentDecisionIndex];
        // eslint-disable-next-line no-unused-vars
        const choice = currentDecisionPoint.choices[choiceIndex];

        const newChoice = {
            decisionPoint: decisionPointNumber,
            choiceIndex: choiceIndex
        };

        // Add this choice to history
        const updatedChoices = [...userChoices, newChoice];
        setUserChoices(updatedChoices);

        // If this was the final decision point, mark the story as complete
        const isFinalDecision =
            decisionPointNumber === 'Final' ||
            (story.decisionPoints &&
                currentDecisionIndex >= story.decisionPoints.length - 1);

        if (isFinalDecision) {
            setStoryComplete(true);
            setStoryProgress(100);

            // Determine if the ending is negative based on the specific choices made
            const ending = determineEnding(updatedChoices);
            setNegativeEnding(ending.negative);
        } else {
            // Move to the next decision point
            const nextIndex = currentDecisionIndex + 1;
            setCurrentDecisionIndex(nextIndex);

            // Update progress
            const totalDecisions = story.decisionPoints ? story.decisionPoints.length : 1;
            const progress = Math.round(((nextIndex) / totalDecisions) * 100);
            setStoryProgress(progress);
        }
    };

    // Extract initial narrative (text before first decision point)
    const getInitialNarrative = () => {
        if (!story || !story.narrative) return "";

        const firstDecisionMarker = "**Decision Point 1:";
        const decisionIndex = story.narrative.indexOf(firstDecisionMarker);

        if (decisionIndex === -1) return story.narrative;
        return story.narrative.substring(0, decisionIndex).trim();
    };

    // Render the narrative with all the decisions made so far
    const renderCurrentNarrative = () => {
        if (!story) return null;

        // Only show the initial narrative up to the first decision point
        const initialNarrative = getInitialNarrative();
        const narrativeParagraphs = initialNarrative.split('\n\n');

        return (
            <div className="story-content">
                {/* Display the initial narrative */}
                <div className="story-narrative mb-4">
                    {narrativeParagraphs.map((paragraph, idx) => (
                        <p key={idx}>{paragraph.trim()}</p>
                    ))}
                </div>

                {/* Show user choices and their consequences */}
                {userChoices.map((choice, idx) => {
                    const decisionPoint = story.decisionPoints ?
                        story.decisionPoints.find(dp => dp.number === choice.decisionPoint.toString()) : null;

                    if (!decisionPoint) return null;

                    const selectedChoice = decisionPoint.choices[choice.choiceIndex];

                    return (
                        <div key={`choice-${idx}`} className="user-decision-sequence mb-4">
                            <div className="decision-point mb-3">
                                <h5>Decision Point {decisionPoint.number}:</h5>
                                <p>{decisionPoint.question}</p>
                            </div>

                            <div className="user-choice ms-4 mb-4">
                                <div className="choice-made bg-light p-3 rounded border-start border-4">
                                    <p className="mb-2">
                                        <strong>
                                            <i className="bi bi-check-circle-fill text-primary me-2"></i>
                                            You chose:
                                        </strong> {selectedChoice.action}
                                    </p>
                                    <p className="mb-0">{selectedChoice.consequence}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Current decision point if story is not complete */}
                {!storyComplete && story.decisionPoints && currentDecisionIndex < story.decisionPoints.length && (
                    <div id="current-decision" className="current-decision mt-4 mb-4">
                        <Card className="border-primary">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-signpost-2 me-2"></i>
                                    Decision Point {story.decisionPoints[currentDecisionIndex].number}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="lead">{story.decisionPoints[currentDecisionIndex].question}</p>

                                <div className="choices mt-4">
                                    {story.decisionPoints[currentDecisionIndex].choices.map((choice, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline-primary"
                                            className="d-block w-100 text-start mb-3 p-3"
                                            onClick={() => handleDecision(story.decisionPoints[currentDecisionIndex].number, idx)}
                                        >
                                            <strong>
                                                <i className="bi bi-arrow-right-circle-fill me-2"></i>
                                                If you {choice.action}
                                            </strong>
                                        </Button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}

                {/* Completion message if story is complete */}
                {storyComplete && (
                    <Alert variant={negativeEnding ? "danger" : "success"} className="mt-4">
                        <Alert.Heading>
                            <i className={`bi ${negativeEnding ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`}></i>
                            Story Complete!
                        </Alert.Heading>
                        <p>
                            {negativeEnding
                                ? `You've reached the end of this story with some challenging outcomes. ${determineEnding(userChoices).message} Consider trying different choices to explore other outcomes.`
                                : `You've reached the end of this story with positive outcomes. ${determineEnding(userChoices).message} Explore the assessment options to reflect on your journey.`}
                        </p>
                        <div className="d-flex justify-content-end mt-3">
                            <Button
                                variant={negativeEnding ? "outline-danger" : "outline-success"}
                                size="sm"
                                onClick={handleRestartStory}
                            >
                                <i className="bi bi-arrow-counterclockwise me-1"></i>
                                Try Again
                            </Button>
                        </div>
                    </Alert>
                )}
            </div>
        );
    };

    // Create a function to handle tab changes with logging
    const handleTabChange = (tab) => {
        console.log(`Switching to tab: ${tab}`);
        console.log(`Story assessment data available: ${!!story?.assessment}`);
        console.log(`Story resources data available: ${!!story?.resources}`);

        if (tab === 'assessment' && story?.assessment) {
            console.log(`Assessment questions count: Open=${story.assessment.openEndedQuestions?.length || 0}, MCQ=${story.assessment.mcqs?.length || 0}, Discussion=${story.assessment.discussionPrompts?.length || 0}`);
        }

        if (tab === 'resources' && story?.resources) {
            console.log(`Resources count: ${story.resources.length}`);
        }

        setActiveTab(tab);
    };

    // Update the renderSideNav function to use the new handleTabChange function
    const renderSideNav = () => {
        return (
            <div className="sticky-top pt-3 section-nav" style={{ top: '1rem' }}>
                <Card className="shadow-sm mb-3">
                    <Card.Header className="bg-secondary text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-bar-chart-fill me-2"></i>
                            Story Progress
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="progress-tracker">
                            <ProgressBar
                                now={storyProgress}
                                label={`${storyProgress}%`}
                                variant={negativeEnding ? "danger" : "primary"}
                                className="mb-2"
                            />
                            <div className="text-center">
                                <small className="text-muted">
                                    {storyComplete
                                        ? negativeEnding ? 'Story Complete (Negative Ending)' : 'Story Complete (Positive Ending)'
                                        : `${storyProgress}% Complete`}
                                </small>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm">
                    <Card.Header className="bg-secondary text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-list-ul me-2"></i>
                            Navigation
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Nav className="flex-column">
                            <Nav.Link
                                className={activeTab === 'narrative' ? 'active' : ''}
                                onClick={() => handleTabChange('narrative')}
                            >
                                <i className="bi bi-book-half me-2"></i>
                                Story Narrative
                            </Nav.Link>

                            <Nav.Link
                                className={activeTab === 'assessment' ? 'active' : ''}
                                onClick={() => handleTabChange('assessment')}
                            >
                                <i className="bi bi-clipboard-check me-2"></i>
                                Assessment
                            </Nav.Link>

                            <Nav.Link
                                className={activeTab === 'resources' ? 'active' : ''}
                                onClick={() => handleTabChange('resources')}
                            >
                                <i className="bi bi-journals me-2"></i>
                                Resources
                            </Nav.Link>
                        </Nav>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // Restart the story
    const handleRestartStory = () => {
        setUserChoices([]);
        setCurrentDecisionIndex(0);
        setStoryProgress(0);
        setStoryComplete(false);
        setNegativeEnding(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container className="my-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                    variant="outline-secondary"
                    onClick={onBack}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to All Stories
                </Button>

                <Card className="shadow-sm mb-0 flex-grow-1 ms-3">
                    <Card.Header className={`bg-dark text-white ${negativeEnding && storyComplete ? 'bg-danger' : ''}`}>
                        <h2 className="mb-0">
                            <i className="bi bi-book me-2"></i>
                            {story ? story.title : 'Loading Story...'}
                        </h2>
                    </Card.Header>
                </Card>
            </div>

            <Row>
                <Col md={3}>
                    {renderSideNav()}
                </Col>

                <Col md={9}>
                    {activeTab === 'narrative' && (
                        <Card className="mb-4 shadow">
                            <Card.Header className={`${negativeEnding && storyComplete ? 'bg-danger' : 'bg-primary'} text-white d-flex justify-content-between align-items-center`}>
                                <h3 className="mb-0">
                                    <i className="bi bi-book-half me-2"></i>
                                    Story Narrative
                                </h3>

                                {userChoices.length > 0 && (
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={handleRestartStory}
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                        Restart Story
                                    </Button>
                                )}
                            </Card.Header>
                            <Card.Body>
                                {renderCurrentNarrative()}
                            </Card.Body>
                        </Card>
                    )}

                    {activeTab === 'assessment' && (
                        <Card className="mb-4 shadow">
                            <Card.Header className="bg-primary text-white">
                                <h3 className="mb-0">
                                    <i className="bi bi-question-circle me-2"></i>
                                    Assessment Options
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                {/* Debug output */}
                                <div className="d-none">
                                    {console.log("Assessment data:", story?.assessment)}
                                    {story?.assessment && console.log("Open-ended questions:", story.assessment.openEndedQuestions)}
                                    {story?.assessment && console.log("MCQs:", story.assessment.mcqs)}
                                    {story?.assessment && console.log("Discussion prompts:", story.assessment.discussionPrompts)}
                                </div>

                                {!storyComplete && (
                                    <Alert variant="info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Complete the story for the full assessment experience.
                                    </Alert>
                                )}

                                <Accordion defaultActiveKey="0" className="mt-3">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            <i className="bi bi-chat-right-quote me-2"></i>
                                            Open-ended Questions
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {story && story.assessment && story.assessment.openEndedQuestions && story.assessment.openEndedQuestions.length > 0 ? (
                                                <ol className="mt-2">
                                                    {story.assessment.openEndedQuestions.map((question, idx) => (
                                                        <li key={idx} className="mb-3">{question}</li>
                                                    ))}
                                                </ol>
                                            ) : (
                                                <p className="text-muted">No open-ended questions available for this story.</p>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>
                                            <i className="bi bi-list-check me-2"></i>
                                            Multiple Choice Questions
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {story && story.assessment && story.assessment.mcqs.length > 0 ? (
                                                <ol className="mt-2">
                                                    {story.assessment.mcqs.map((mcq, idx) => (
                                                        <li key={idx} className="mb-4">
                                                            <p className="mb-2">{mcq.question}</p>
                                                            <ul className="list-unstyled ms-3">
                                                                <li className="mb-1"><strong>a)</strong> {mcq.options.A}</li>
                                                                <li className="mb-1"><strong>b)</strong> {mcq.options.B}</li>
                                                                <li className="mb-1"><strong>c)</strong> {mcq.options.C}</li>
                                                                <li className="mb-1"><strong>d)</strong> {mcq.options.D}</li>
                                                            </ul>
                                                        </li>
                                                    ))}
                                                </ol>
                                            ) : (
                                                <p className="text-muted">No multiple choice questions available for this story.</p>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>
                                            <i className="bi bi-chat-text me-2"></i>
                                            Discussion Prompts
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {story && story.assessment && story.assessment.discussionPrompts.length > 0 ? (
                                                <ul className="list-group list-group-flush mt-2">
                                                    {story.assessment.discussionPrompts.map((prompt, idx) => (
                                                        <li key={idx} className="list-group-item bg-light mb-2 rounded">
                                                            <i className="bi bi-chat-dots me-2"></i>
                                                            {prompt}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-muted">No discussion prompts available for this story.</p>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Card.Body>
                        </Card>
                    )}

                    {activeTab === 'resources' && (
                        <Card className="mb-4 shadow">
                            <Card.Header className="bg-primary text-white">
                                <h3 className="mb-0">
                                    <i className="bi bi-journal-bookmark me-2"></i>
                                    Further Resources
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                {/* Debug output */}
                                <div className="d-none">
                                    {console.log("Resources data:", story?.resources)}
                                    {story?.resources && console.log("Number of resource categories:", story.resources.length)}
                                </div>

                                {story && story.resources && story.resources.length > 0 ? (
                                    story.resources.map((resource, idx) => (
                                        <div key={idx} className="mb-4">
                                            <h4 className="border-bottom pb-2">
                                                <i className="bi bi-collection me-2"></i>
                                                {resource.category}
                                            </h4>
                                            <ul className="list-group list-group-flush">
                                                {resource.items.map((item, itemIdx) => (
                                                    <li key={itemIdx} className="list-group-item">
                                                        <i className="bi bi-arrow-right-short me-2"></i>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No additional resources available for this story.</p>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default StoryContainer;
