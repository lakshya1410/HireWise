import google.generativeai as genai
from app.config import settings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import re
from typing import Dict, List

genai.configure(api_key=settings.gemini_api_key)

class JDMatcher:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    def calculate_match_score(self, resume_text: str, job_description: str) -> Dict:
        """
        Calculate JD match score using weighted average
        Formula: Match Score = (Semantic * 0.30) + (Keywords * 0.25) + 
                               (Skills * 0.25) + (Experience * 0.20)
        """
        # 1. Semantic similarity (30% weight)
        semantic_score = self.calculate_semantic_similarity(resume_text, job_description)
        
        # 2. Keywords match (25% weight)
        keywords_score = self.calculate_keyword_match(resume_text, job_description)
        
        # 3. Skills match (25% weight)
        skills_match = self.extract_and_match_skills(resume_text, job_description)
        skills_score = skills_match['score']
        
        # 4. Experience level match (20% weight)
        experience_score = self.calculate_experience_match(resume_text, job_description)
        
        # Calculate weighted average
        match_score = (
            (semantic_score * 0.30) +
            (keywords_score * 0.25) +
            (skills_score * 0.25) +
            (experience_score * 0.20)
        )
        
        # Get AI analysis
        ai_analysis = self.get_ai_match_analysis(resume_text, job_description)
        
        # Combine with AI score (weighted: 50% formula, 50% AI)
        if ai_analysis and 'match_score' in ai_analysis:
            match_score = (match_score * 0.5) + (ai_analysis['match_score'] * 0.5)
        
        # Generate recommendations
        recommendations = self.generate_recommendations(
            skills_match, ai_analysis, match_score
        )
        
        return {
            'match_score': round(match_score, 1),
            'technical_skills': round(skills_score, 1),
            'experience_score': round(experience_score, 1),
            'education_score': 85,  # Placeholder, can be enhanced
            'keywords_score': round(keywords_score, 1),
            'matched_skills': skills_match['matched'],
            'missing_skills': skills_match['missing'],
            'recommendations': recommendations,
            'ai_analysis': ai_analysis
        }
    
    def calculate_semantic_similarity(self, resume: str, jd: str) -> float:
        """Calculate semantic similarity using TF-IDF"""
        try:
            vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
            vectors = vectorizer.fit_transform([resume, jd])
            similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
            return similarity * 100
        except:
            return 50.0
    
    def calculate_keyword_match(self, resume: str, jd: str) -> float:
        """Calculate keyword overlap percentage"""
        # Extract words (simple tokenization)
        resume_words = set(re.findall(r'\b\w+\b', resume.lower()))
        jd_words = set(re.findall(r'\b\w+\b', jd.lower()))
        
        # Remove common words
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        resume_words -= common_words
        jd_words -= common_words
        
        # Calculate overlap
        if len(jd_words) > 0:
            overlap = len(resume_words.intersection(jd_words)) / len(jd_words)
            return overlap * 100
        return 0
    
    def extract_and_match_skills(self, resume: str, jd: str) -> Dict:
        """Extract and match technical skills"""
        # Common tech skills (expand this list)
        tech_skills = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'nodejs',
            'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'sql', 'mongodb', 'postgresql', 'mysql', 'redis',
            'git', 'github', 'gitlab', 'jira', 'agile', 'scrum',
            'machine learning', 'data analysis', 'deep learning', 'tensorflow',
            'pytorch', 'pandas', 'numpy', 'scikit-learn',
            'rest api', 'graphql', 'microservices', 'ci/cd'
        ]
        
        resume_lower = resume.lower()
        jd_lower = jd.lower()
        
        # Find skills in JD and resume
        jd_skills = [skill for skill in tech_skills if skill in jd_lower]
        resume_skills = [skill for skill in tech_skills if skill in resume_lower]
        
        matched_skills = list(set(jd_skills).intersection(set(resume_skills)))
        missing_skills = list(set(jd_skills) - set(resume_skills))
        
        # Calculate score
        if len(jd_skills) > 0:
            score = (len(matched_skills) / len(jd_skills)) * 100
        else:
            score = 75  # Default if no tech skills found in JD
        
        return {
            'score': score,
            'matched': matched_skills[:10],
            'missing': missing_skills[:10]
        }
    
    def calculate_experience_match(self, resume: str, jd: str) -> float:
        """Match experience level requirements"""
        # Extract years of experience mentioned in JD
        jd_years = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)', jd.lower())
        resume_years = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)', resume.lower())
        
        if not jd_years:
            return 80  # No specific requirement mentioned
        
        required_years = int(jd_years[0]) if jd_years else 0
        candidate_years = max([int(y) for y in resume_years]) if resume_years else 0
        
        if candidate_years >= required_years:
            return 100
        elif candidate_years >= required_years * 0.75:
            return 85
        else:
            return max(50, (candidate_years / required_years) * 100)
    
    def get_ai_match_analysis(self, resume: str, jd: str) -> Dict:
        """Get AI-powered job match analysis using Gemini"""
        try:
            prompt = f"""
Compare this resume with the job description and provide a detailed match analysis.

Job Description:
{jd[:2000]}

Resume:
{resume[:2000]}

Return ONLY valid JSON in this exact format:
{{
    "match_score": 75,
    "matched_requirements": ["list of matching qualifications"],
    "missing_requirements": ["list of gaps"],
    "recommendations": ["specific actions to improve match"],
    "strength_areas": ["areas where candidate excels"],
    "improvement_areas": ["areas needing improvement"]
}}
"""
            
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean markdown
            if response_text.startswith('```'):
                response_text = response_text.split('```')[1]
                if response_text.startswith('json'):
                    response_text = response_text[4:]
            
            ai_result = json.loads(response_text)
            return ai_result
            
        except Exception as e:
            print(f"AI match analysis error: {e}")
            return {
                'match_score': 70,
                'matched_requirements': [],
                'missing_requirements': [],
                'recommendations': [],
                'strength_areas': [],
                'improvement_areas': []
            }
    
    def generate_recommendations(
        self, skills_match: Dict, ai_analysis: Dict, match_score: float
    ) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Skill-based recommendations
        if skills_match['missing']:
            top_missing = skills_match['missing'][:3]
            for skill in top_missing:
                recommendations.append(
                    f"Consider adding '{skill}' to your skills if you have experience with it"
                )
        
        # AI recommendations
        if ai_analysis and 'recommendations' in ai_analysis:
            recommendations.extend(ai_analysis['recommendations'][:3])
        
        # Score-based recommendations
        if match_score < 60:
            recommendations.append("Consider tailoring your resume more closely to this job description")
        elif match_score < 80:
            recommendations.append("Highlight relevant achievements that match job requirements")
        
        # Ensure we have at least some recommendations
        if not recommendations:
            recommendations = [
                "Quantify your achievements with metrics and numbers",
                "Use keywords from the job description throughout your resume",
                "Highlight relevant projects that demonstrate required skills"
            ]
        
        return recommendations[:6]  # Top 6 recommendations
