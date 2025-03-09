import React, { useState } from 'react';
import { Form, Card, Alert, ProgressBar } from 'react-bootstrap';

const MCQSection = ({ questions, showAnswers }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [userScore, setUserScore] = useState(null);

    const handleAnswerChange = (questionIndex, value) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: value
        });

        // Calculate score when showAnswers is true
        if (showAnswers) {
            const correctAnswers = questions.reduce((count, question, idx) => {
                return selectedAnswers[idx] === question.correctAnswer ? count + 1 : count;
            }, 0);

            const scorePercentage = (correctAnswers / questions.length) * 100;
            setUserScore(scorePercentage);
        }
    };

    const getOptionStyle = (questionIndex, optionKey) => {
        if (!showAnswers) {
            return selectedAnswers[questionIndex] === optionKey ? 'selected' : '';
        }

        if (optionKey === questions[questionIndex].correctAnswer) {
            return 'correct';
        }

        if (selectedAnswers[questionIndex] === optionKey &&
            optionKey !== questions[questionIndex].correctAnswer) {
            return 'incorrect';
        }

        return '';
    };

    return (
        <div>
            {showAnswers && userScore !== null && (
                <div className="mb-4">
                    <h5>Your Score: {Math.round(userScore)}%</h5>
                    <ProgressBar
                        now={userScore}
                        variant={userScore >= 70 ? 'success' : userScore >= 40 ? 'warning' : 'danger'}
                        className="mb-3"
                    />
                </div>
            )}

            {questions.map((question, index) => (
                <div key={index} className="mb-4 fade-in">
                    <h5 className="mb-3">
                        <i className="bi bi-question-square me-2"></i>
                        {index + 1}. {question.question}
                    </h5>

                    <div className="mcq-options-container">
                        {Object.entries(question.options).map(([key, value]) => (
                            <Card
                                key={key}
                                className={`mb-2 mcq-option ${getOptionStyle(index, key)}`}
                                onClick={() => !showAnswers && handleAnswerChange(index, key)}
                            >
                                <Card.Body className="py-2">
                                    <Form.Check
                                        type="radio"
                                        id={`q${index}-option${key}`}
                                        name={`question-${index}`}
                                        label={
                                            <div className="d-flex align-items-center">
                                                <strong className="option-key">{key}.</strong>
                                                <span className="ms-2">{value}</span>
                                                {showAnswers && key === question.correctAnswer && (
                                                    <i className="bi bi-check-circle-fill text-success ms-auto fs-5"></i>
                                                )}
                                                {showAnswers && key === selectedAnswers[index] && key !== question.correctAnswer && (
                                                    <i className="bi bi-x-circle-fill text-danger ms-auto fs-5"></i>
                                                )}
                                            </div>
                                        }
                                        checked={selectedAnswers[index] === key}
                                        onChange={() => !showAnswers && handleAnswerChange(index, key)}
                                        disabled={showAnswers}
                                        inline
                                    />
                                </Card.Body>
                            </Card>
                        ))}
                    </div>

                    {showAnswers && (
                        <Alert
                            variant={selectedAnswers[index] === question.correctAnswer ? "success" : "info"}
                            className="mt-3"
                        >
                            <Alert.Heading>
                                <i className={`bi ${selectedAnswers[index] === question.correctAnswer ? 'bi-check-circle' : 'bi-info-circle'} me-2`}></i>
                                Correct Answer: {question.correctAnswer}
                            </Alert.Heading>
                            {selectedAnswers[index] && selectedAnswers[index] !== question.correctAnswer && (
                                <p>
                                    <i className="bi bi-x-circle me-2"></i>
                                    You selected: {selectedAnswers[index]}
                                </p>
                            )}
                            <hr />
                            <p className="explanation-text">
                                <strong>Explanation:</strong> {question.options[question.correctAnswer]} is the correct choice because it addresses the primary concern presented in the scenario.
                            </p>
                        </Alert>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MCQSection;
