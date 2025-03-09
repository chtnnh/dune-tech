/**
 * A simplified parser for the specific markdown format in sample-content.md
 */
export const parseMarkdown = (markdown) => {
    console.log("Starting to parse markdown content");
    console.log("Full content first 500 chars:", markdown.substring(0, 500));

    // CRITICAL DEBUGGING: Log the raw content with line numbers for inspection
    console.log("DEBUGGING RAW CONTENT:");
    const rawLines = markdown.split('\n');
    rawLines.forEach((line, index) => {
        console.log(`Line ${index + 1}: ${line}`);
    });

    const stories = [];

    // Split the content by story headers (# **)
    const storyBlocks = markdown.split(/# \*\*/);
    console.log(`Found ${storyBlocks.length - 1} story blocks`); // First block is empty

    // Examine each story block in detail
    storyBlocks.forEach((block, index) => {
        if (index === 0) return; // Skip first empty block

        console.log(`\n\nEXAMINING STORY BLOCK #${index}:`);
        console.log("First 300 chars:", block.substring(0, 300));

        // Look for assessment and resources sections
        const hasAssessment = block.includes('Assessment Options');
        const hasResources = block.includes('Further Exploration');
        console.log(`Block ${index} has Assessment: ${hasAssessment}, Resources: ${hasResources}`);

        // Check for specific section headers
        const assessmentHeader = block.includes('## **Assessment Options**');
        const resourcesHeader = block.includes('## **Further Exploration**');
        console.log(`Block ${index} has Assessment Header: ${assessmentHeader}, Resources Header: ${resourcesHeader}`);
    });

    // Skip the first element (it's empty if the file starts with a header)
    for (let i = 1; i < storyBlocks.length; i++) {
        const block = storyBlocks[i];

        // Get story title (first line)
        const titleEndIdx = block.indexOf('\n');
        let title = block.substring(0, titleEndIdx).replace(/\*\*/g, '').trim();
        console.log(`\n\nProcessing story: "${title}"`);

        // Skip if this isn't a real story
        if (title === "Assessment Options" || title === "Further Exploration") {
            console.log(`Skipping non-story section: ${title}`);
            continue;
        }

        // Include the full content as narrative
        const narrative = `# **${block}`;

        // Extract decision points
        const decisionPoints = extractDecisionPoints(narrative);
        console.log(`Extracted ${decisionPoints.length} decision points`);

        // Create empty structures for assessment and resources
        let assessment = {
            openEndedQuestions: [],
            mcqs: [],
            discussionPrompts: []
        };

        let resources = [];

        // Since we know stories are coming from the same markdown file,
        // we can look for assessment and resources in adjacent sections

        // Use the story index to locate the related sections
        // The Assessment Options and Further Exploration sections are separate in the array
        const assessmentIndex = findBlockIndexWithTitle(storyBlocks, "Assessment Options");
        const resourcesIndex = findBlockIndexWithTitle(storyBlocks, "Further Exploration");

        console.log(`Assessment section index: ${assessmentIndex}, Resources section index: ${resourcesIndex}`);

        // Extract assessment data
        if (assessmentIndex !== -1) {
            console.log("Found Assessment Options section block");
            const assessmentBlock = storyBlocks[assessmentIndex];

            // Parse open-ended questions
            const openEndedQuestions = extractQuestionsWithPattern(assessmentBlock, "Open-ended questions");
            if (openEndedQuestions.length > 0) {
                assessment.openEndedQuestions = openEndedQuestions;
                console.log(`Extracted ${openEndedQuestions.length} open-ended questions`);
            }

            // Parse MCQs
            const mcqs = extractMCQs(assessmentBlock, "Multiple-choice questions");
            if (mcqs.length > 0) {
                assessment.mcqs = mcqs;
                console.log(`Extracted ${mcqs.length} MCQs`);
            }

            // Parse discussion prompts
            const discussionPrompts = extractQuestionsWithPattern(assessmentBlock, "Discussion prompts");
            if (discussionPrompts.length > 0) {
                assessment.discussionPrompts = discussionPrompts;
                console.log(`Extracted ${discussionPrompts.length} discussion prompts`);
            }
        }

        // Extract resources data
        if (resourcesIndex !== -1) {
            console.log("Found Further Exploration section block");
            const resourcesBlock = storyBlocks[resourcesIndex];

            // Extract resource categories and items
            resources = extractResources(resourcesBlock);
            console.log(`Extracted ${resources.length} resource categories`);
        }

        // Create the story object
        stories.push({
            title,
            narrative,
            decisionPoints,
            assessment,
            resources
        });

        // Log summary
        console.log(`Summary for story "${title}":
            - Decision points: ${decisionPoints.length}
            - Open-ended questions: ${assessment.openEndedQuestions.length}
            - MCQs: ${assessment.mcqs.length}
            - Discussion prompts: ${assessment.discussionPrompts.length}
            - Resource categories: ${resources.length}
        `);
    }

    console.log(`Completed parsing, found ${stories.length} stories`);
    return stories;
};

/**
 * Extract decision points from the narrative text, carefully handling regular and final decision points
 */
const extractDecisionPoints = (narrative) => {
    const decisionPoints = [];

    // Find all regular Decision Point markers
    const regularDpRegex = /\*\*Decision Point (\d+):\*\* ([^\n]+)/g;
    const regularDpMatches = [...narrative.matchAll(regularDpRegex)];

    // Find Final Decision Point marker
    const finalDpRegex = /\*\*Final Decision Point:\*\* ([^\n]+)/g;
    const finalDpMatches = [...narrative.matchAll(finalDpRegex)];

    // Combine all decision points in order
    const allDpMatches = [...regularDpMatches];

    // Add the final decision point (if it exists)
    if (finalDpMatches.length > 0) {
        allDpMatches.push(finalDpMatches[0]);
    }

    // Sort by position in text to ensure correct order
    allDpMatches.sort((a, b) => a.index - b.index);

    // Process each decision point
    for (let i = 0; i < allDpMatches.length; i++) {
        const dpMatch = allDpMatches[i];

        // Get the decision point number and question
        let number, question;

        if (dpMatch[0].includes("Final Decision Point:")) {
            number = "Final";
            question = dpMatch[1].trim();
        } else {
            number = parseInt(dpMatch[1], 10);
            question = dpMatch[2].trim();
        }

        // Find the start of this decision point
        const dpStartIdx = dpMatch.index;

        // Find the end of this decision point (start of next decision point or end of narrative)
        let dpEndIdx;
        if (i < allDpMatches.length - 1) {
            dpEndIdx = allDpMatches[i + 1].index;
        } else {
            dpEndIdx = narrative.length;
        }

        // Extract the content for this decision point
        const dpContent = narrative.substring(dpStartIdx, dpEndIdx);

        // Extract choices for this decision point using a more reliable pattern
        const choices = [];

        // Match choice patterns (handling multiline content)
        const choiceRegex = /\* \*\*If you ([^:]+):\*\* ([\s\S]*?)(?=\* \*\*If you|\*\*Decision Point|\*\*Final Decision Point|$)/g;
        const choiceMatches = [...dpContent.matchAll(choiceRegex)];

        for (const choice of choiceMatches) {
            choices.push({
                action: choice[1].trim(),
                consequence: choice[2].trim()
            });
        }

        // Add this decision point to the list
        decisionPoints.push({
            number,
            question,
            choices
        });
    }

    console.log(`Total decision points extracted: ${decisionPoints.length}`);
    decisionPoints.forEach((dp, i) => {
        console.log(`DP ${dp.number}: ${dp.choices.length} choices`);
    });

    return decisionPoints;
};

// Helper function to find a block with a specific title
function findBlockIndexWithTitle(blocks, title) {
    for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i];
        const titleEndIdx = block.indexOf('\n');
        const blockTitle = block.substring(0, titleEndIdx).replace(/\*\*/g, '').trim();

        if (blockTitle === title) {
            return i;
        }
    }
    return -1;
}

// Extract questions with a specific pattern
function extractQuestionsWithPattern(text, sectionName) {
    const questions = [];

    // First find the section
    const sectionRegex = new RegExp(`\\*\\s*\\*\\*${sectionName}:\\*\\*([\\s\\S]*?)(?=\\*\\s*\\*\\*|$)`, 'i');
    const sectionMatch = text.match(sectionRegex);

    if (sectionMatch && sectionMatch[1]) {
        const sectionContent = sectionMatch[1];
        console.log(`Found ${sectionName} section content:`, sectionContent);

        // Extract questions in quotes
        const lines = sectionContent.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('*') && line.includes('"')) {
                const questionMatch = line.match(/"([^"]+)"/);
                if (questionMatch && questionMatch[1]) {
                    questions.push(questionMatch[1].trim());
                    console.log(`Added ${sectionName} item: "${questionMatch[1].trim()}"`);
                }
            }
        }
    }

    return questions;
}

// Extract MCQs with their options
function extractMCQs(text, sectionName) {
    const mcqs = [];

    // First find the section
    const sectionRegex = new RegExp(`\\*\\s*\\*\\*${sectionName}:\\*\\*([\\s\\S]*?)(?=\\*\\s*\\*\\*|$)`, 'i');
    const sectionMatch = text.match(sectionRegex);

    if (sectionMatch && sectionMatch[1]) {
        const sectionContent = sectionMatch[1];
        console.log(`Found ${sectionName} section content:`, sectionContent);

        // Extract questions with options
        const lines = sectionContent.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('*') &&
                line.includes('"') &&
                line.includes('(a)') &&
                line.includes('(b)')) {

                const questionMatch = line.match(/"([^"]+)"/);
                if (questionMatch && questionMatch[1]) {
                    const question = questionMatch[1].trim();
                    const options = { A: '', B: '', C: '', D: '' };

                    // Extract options
                    const optionAMatch = line.match(/\(a\)\s*([^,)]+)/i);
                    if (optionAMatch) options.A = optionAMatch[1].trim();

                    const optionBMatch = line.match(/\(b\)\s*([^,)]+)/i);
                    if (optionBMatch) options.B = optionBMatch[1].trim();

                    const optionCMatch = line.match(/\(c\)\s*([^,)]+)/i);
                    if (optionCMatch) options.C = optionCMatch[1].trim();

                    const optionDMatch = line.match(/\(d\)\s*([^,)]+)/i);
                    if (optionDMatch) options.D = optionDMatch[1].trim();

                    mcqs.push({
                        question,
                        options,
                        correctAnswer: ""
                    });
                    console.log(`Added MCQ: "${question}" with options`);
                }
            }
        }
    }

    return mcqs;
}

// Extract resource categories and items
function extractResources(text) {
    const resources = [];

    if (!text) {
        return resources;
    }

    // Split into lines for processing
    const lines = text.split('\n');

    let currentCategory = null;
    let currentItems = [];

    // Skip the first line (it's the title line)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // Check for category headers like: * **Books:**
        if (line.includes('**') && line.includes(':') && line.trim().startsWith('*')) {
            // If we have a current category, save its items before starting a new one
            if (currentCategory && currentItems.length > 0) {
                resources.push({
                    category: currentCategory,
                    items: [...currentItems]
                });
                console.log(`Added resource category "${currentCategory}" with ${currentItems.length} items`);
                currentItems = [];
            }

            // Extract the category name
            const categoryMatch = line.match(/\*\*([^:*]+):\*\*/);
            if (categoryMatch && categoryMatch[1]) {
                currentCategory = categoryMatch[1].trim();
                console.log(`Found resource category: "${currentCategory}"`);
            }
        }
        // Check for item lines - any bullet point that's not a category
        else if (currentCategory && line.trim().startsWith('*') && !line.includes('**')) {
            // Extract the item text
            const itemText = line.substring(line.indexOf('*') + 1).trim();
            if (itemText) {
                currentItems.push(itemText);
                console.log(`Added resource item: "${itemText}"`);
            }
        }
    }

    // Add the final category if we have one
    if (currentCategory && currentItems.length > 0) {
        resources.push({
            category: currentCategory,
            items: [...currentItems]
        });
        console.log(`Added final resource category "${currentCategory}" with ${currentItems.length} items`);
    }

    return resources;
}
