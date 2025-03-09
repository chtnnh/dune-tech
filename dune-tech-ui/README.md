# Hikayat Scenarios UI

A React-based user interface for displaying AI safety educational scenarios from markdown content.

## Overview

This application takes structured markdown content about AI safety scenarios and presents it in an interactive, user-friendly UI. Users can navigate between different sections and scenarios, answer multiple-choice questions, and respond to scenario-based questions and self-reflection prompts.

## Features

- **Interactive Scenario Cards**: Each scenario is presented in a well-structured card with narrative, decision points, consequences, and assessment sections.
- **Multiple Choice Questions**: Users can answer multiple-choice questions and see correct answers when ready.
- **Scenario-Based Questions**: Users can respond to scenario-based questions to practice applying concepts.
- **Self-Reflection Prompts**: Includes prompts to encourage personal reflection on the topics.
- **Responsive Design**: Works well on both desktop and mobile devices.
- **Modern UI**: Bootstrap-based styling with custom CSS for a clean, modern look.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher recommended)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd dune-tech-ui
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## Project Structure

- `src/components/`: Contains all React components
  - `MainContainer.js`: Main wrapper component for the application
  - `SectionContainer.js`: Displays all scenarios for a section
  - `ScenarioCard.js`: Displays a single scenario
  - `MCQSection.js`: Handles multiple choice questions
  - `TextQuestionSection.js`: Handles text-based questions and prompts
- `src/utils/`: Utility functions
  - `markdownParser.js`: Parses markdown content into structured data

## Content Format

The application expects markdown content in a specific format. Each section should contain scenarios with the following structure:

```markdown
## **Section Title**

### **Scenario X: Scenario Title**

**Narrative:**  
Scenario description...

**Decision Points:**
* Point 1
* Point 2
* Point 3

**Consequences:**
* **Positive:** Positive consequences...
* **Negative:** Negative consequences...

#### **Assessment for Scenario X**

**Multiple Choice Questions (MCQs):**
1. Question 1?
   * A. Option A
   * B. Option B
   * C. Option C
   * D. Option D
      **Correct Answer:** B

**Scenario-Based Questions:**
1. Question 1?
2. Question 2?

**Self-Reflection Prompts:**
1. Prompt 1?
2. Prompt 2?
```

## License

MIT

## Acknowledgments

- Bootstrap for the UI components
- React for the frontend framework
- Bootstrap Icons for the iconography
