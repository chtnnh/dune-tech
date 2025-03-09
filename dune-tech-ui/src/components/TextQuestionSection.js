import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const TextQuestionSection = ({ questions, type }) => {
    const [responses, setResponses] = useState({});
    const [submitted, setSubmitted] = useState({});

    const handleResponseChange = (questionIndex, value) => {
        setResponses({
            ...responses,
            [questionIndex]: value
        });
    };

    const handleSubmit = (questionIndex) => {
        setSubmitted({
            ...submitted,
            [questionIndex]: true
        });
    };

    return (
        <div>
            {questions.map((question, index) => (
                <Card
                    key={index}
                    className={`mb-4 ${type === 'scenario' ? 'text-question-card' : 'reflection-prompt-card'}`}
                >
                    <Card.Body>
                        <h5 className="mb-3">
                            <i className={`bi ${type === 'scenario' ? 'bi-chat-dots' : 'bi-journal-richtext'} me-2`}></i>
                            {index + 1}. {question}
                        </h5>

                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder={type === 'scenario' ? 'Enter your response...' : 'Reflect on this prompt...'}
                                value={responses[index] || ''}
                                onChange={(e) => handleResponseChange(index, e.target.value)}
                                disabled={submitted[index]}
                                className={submitted[index] ? 'bg-light' : ''}
                            />
                        </Form.Group>

                        {!submitted[index] ? (
                            <Button
                                variant={type === 'scenario' ? "outline-secondary" : "outline-danger"}
                                onClick={() => handleSubmit(index)}
                                disabled={!responses[index] || responses[index].trim() === ''}
                            >
                                <i className="bi bi-send me-2"></i>
                                Submit Response
                            </Button>
                        ) : (
                            <div className="text-success">
                                <i className="bi bi-check-circle me-2"></i> Response submitted
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default TextQuestionSection;
