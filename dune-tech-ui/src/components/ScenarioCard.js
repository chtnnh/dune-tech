import React, { useState } from 'react';
import { Card, Button, Accordion, Badge, Nav } from 'react-bootstrap';
import MCQSection from './MCQSection';
import TextQuestionSection from './TextQuestionSection';

const ScenarioCard = ({ scenario, allScenarios, onNavigate, currentIndex }) => {
    const [showAnswers, setShowAnswers] = useState(false);

    // Function to handle navigation to previous scenario
    const goToPrevious = () => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    // Function to handle navigation to next scenario
    const goToNext = () => {
        if (currentIndex < allScenarios.length - 1) {
            onNavigate(currentIndex + 1);
        }
    };

    return (
        <Card className="mb-4 shadow scenario-card">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Scenario {scenario.number}: {scenario.title}</h3>
                <Badge bg="light" text="dark" pill className="badge-section">Section {scenario.number}</Badge>
            </Card.Header>

            <Card.Body className="fade-in">
                {/* Narrative Section */}
                <div className="mb-4">
                    <h4 className="border-bottom pb-2">Narrative</h4>
                    <p className="text-muted">{scenario.narrative}</p>
                </div>

                {/* Decision Points Section */}
                <div className="mb-4">
                    <h4 className="border-bottom pb-2">Decision Points</h4>
                    <div>
                        {scenario.decisionPoints.map((point, index) => (
                            <div key={index} className="decision-point">
                                <i className="bi bi-question-circle me-2"></i> {point}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Consequences Section */}
                <div className="mb-4">
                    <h4 className="border-bottom pb-2">Consequences</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="p-3 consequence-panel positive-consequence">
                                <h5 className="text-success"><i className="bi bi-check-circle me-2"></i>Positive</h5>
                                <p>{scenario.consequences.positive}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 consequence-panel negative-consequence">
                                <h5 className="text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Negative</h5>
                                <p>{scenario.consequences.negative}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assessment Section */}
                <div className="mb-3">
                    <h4 className="border-bottom pb-2">Assessment</h4>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <i className="bi bi-list-check me-2"></i> Multiple Choice Questions
                            </Accordion.Header>
                            <Accordion.Body>
                                <MCQSection
                                    questions={scenario.assessment.mcqs}
                                    showAnswers={showAnswers}
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <i className="bi bi-chat-square-text me-2"></i> Scenario-Based Questions
                            </Accordion.Header>
                            <Accordion.Body>
                                <TextQuestionSection
                                    questions={scenario.assessment.scenarioQuestions}
                                    type="scenario"
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                <i className="bi bi-journal-text me-2"></i> Self-Reflection Prompts
                            </Accordion.Header>
                            <Accordion.Body>
                                <TextQuestionSection
                                    questions={scenario.assessment.reflectionPrompts}
                                    type="reflection"
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <Button
                            variant="outline-secondary"
                            onClick={goToPrevious}
                            disabled={currentIndex === 0}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Previous Scenario
                        </Button>
                    </div>

                    <div>
                        <Button
                            variant={showAnswers ? "secondary" : "primary"}
                            onClick={() => setShowAnswers(!showAnswers)}
                            className="mx-2"
                        >
                            <i className={`bi ${showAnswers ? "bi-eye-slash" : "bi-eye"} me-2`}></i>
                            {showAnswers ? "Hide Answers" : "Show Answers"}
                        </Button>
                    </div>

                    <div>
                        <Button
                            variant="outline-secondary"
                            onClick={goToNext}
                            disabled={currentIndex === allScenarios.length - 1}
                        >
                            Next Scenario
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Button>
                    </div>
                </div>

                {/* Scenario Navigation Links */}
                <div className="mt-4">
                    <h5 className="border-bottom pb-2">
                        <i className="bi bi-signpost-2 me-2"></i>
                        Other Scenarios in this Section
                    </h5>
                    <Nav variant="pills" className="scenario-nav">
                        {allScenarios.map((s, idx) => (
                            <Nav.Item key={idx}>
                                <Nav.Link
                                    active={idx === currentIndex}
                                    onClick={() => onNavigate(idx)}
                                    className={`mb-2 ${idx === currentIndex ? 'active' : ''}`}
                                >
                                    <i className={`bi ${idx === currentIndex ? 'bi-file-earmark-text-fill' : 'bi-file-earmark-text'} me-2`}></i>
                                    {s.title}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ScenarioCard;
