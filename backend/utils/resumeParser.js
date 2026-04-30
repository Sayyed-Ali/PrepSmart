const pdfParse = require('pdf-parse');
const fs = require('fs');

const extractResumeText = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        let text = data.text
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();

        return text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return ''; // Return empty string instead of throwing
    }
};

const extractResumeInfo = (resumeText) => {
    if (!resumeText) return { skills: [], experience: 'fresher', education: '', projects: [] };

    const info = {
        skills: [],
        experience: '',
        education: '',
        projects: []
    };

    const skillKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB',
        'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'C++', 'Machine Learning', 'AI'];

    skillKeywords.forEach(skill => {
        if (resumeText.toLowerCase().includes(skill.toLowerCase())) {
            info.skills.push(skill);
        }
    });

    if (resumeText.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*experience/i)) {
        info.experience = 'experienced';
    } else if (resumeText.toLowerCase().includes('fresher') ||
        resumeText.toLowerCase().includes('student')) {
        info.experience = 'fresher';
    } else {
        info.experience = 'intermediate';
    }

    return info;
};

module.exports = {
    extractResumeText,
    extractResumeInfo
};