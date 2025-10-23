import google.generativeai as genai
from app.config import settings
from app.utils.pdf_utils import (
    extract_sections, extract_contact_info, 
    extract_keywords, check_formatting
)
import json
from typing import Dict, List

# Configure Gemini
genai.configure(api_key=settings.gemini_api_key)

class ATSScorer:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    def calculate_ats_score(self, resume_text: str) -> Dict:
        """
        Calculate ATS score using weighted average of multiple factors
        Formula: Overall Score = (Formatting * 0.25) + (Keywords * 0.30) + 
                                 (Structure * 0.25) + (Readability * 0.20)
        """
        # 1. Check formatting (25% weight)
        formatting_result = check_formatting(resume_text)
        formatting_score = formatting_result['score']
        
        # 2. Check keywords (30% weight)
        keywords = extract_keywords(resume_text)
        keywords_score = min((len(keywords) / 15) * 100, 100)  # Target: 15+ keywords
        
        # 3. Check structure (25% weight)
        sections = extract_sections(resume_text)
        required_sections = ['experience', 'education', 'skills']
        found_sections = sum(1 for sec in required_sections if sec in sections)
        structure_score = (found_sections / len(required_sections)) * 100
        
        # Check contact info
        contact_info = extract_contact_info(resume_text)
        if contact_info['has_email']:
            structure_score = min(structure_score + 10, 100)
        if contact_info['has_phone']:
            structure_score = min(structure_score + 10, 100)
        
        # 4. Readability (20% weight)
        word_count = len(resume_text.split())
        if 300 <= word_count <= 800:
            readability_score = 100
        elif word_count < 300:
            readability_score = (word_count / 300) * 100
        else:
            readability_score = max(100 - ((word_count - 800) / 20), 60)
        
        # Calculate weighted average
        overall_score = (
            (formatting_score * 0.25) +
            (keywords_score * 0.30) +
            (structure_score * 0.25) +
            (readability_score * 0.20)
        )
        
        # Get AI analysis
        ai_analysis = self.get_ai_analysis(resume_text)
        
        # Combine AI score with formula (weighted: 60% formula, 40% AI)
        if ai_analysis and 'score' in ai_analysis:
            overall_score = (overall_score * 0.6) + (ai_analysis['score'] * 0.4)
        
        # Generate suggestions
        suggestions = self.generate_suggestions(
            formatting_result, keywords, sections, 
            contact_info, word_count, ai_analysis
        )
        
        return {
            'overall_score': round(overall_score, 1),
            'formatting_score': round(formatting_score, 1),
            'keywords_score': round(keywords_score, 1),
            'structure_score': round(structure_score, 1),
            'readability_score': round(readability_score, 1),
            'suggestions': suggestions,
            'ai_analysis': ai_analysis,
            'found_keywords': keywords,
            'sections_found': list(sections.keys())
        }
    
    def get_ai_analysis(self, resume_text: str) -> Dict:
        """Get AI-powered ATS analysis using Gemini"""
        try:
            prompt = f"""
Analyze this resume for ATS (Applicant Tracking System) compatibility.
Provide a detailed analysis in JSON format with:
1. Overall ATS compatibility score (0-100)
2. Specific formatting issues
3. Missing critical sections
4. Keyword optimization suggestions
5. Specific improvements needed

Resume:
{resume_text[:3000]}  # Limit to avoid token limits

Return ONLY valid JSON in this exact format:
{{
    "score": 85,
    "formatting_issues": ["list of issues"],
    "missing_sections": ["list of missing sections"],
    "keyword_suggestions": ["list of keywords to add"],
    "improvements": ["list of specific improvements"]
}}
"""
            
            response = self.model.generate_content(prompt)
            # Extract JSON from response
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            if response_text.startswith('```'):
                response_text = response_text.split('```')[1]
                if response_text.startswith('json'):
                    response_text = response_text[4:]
            
            ai_result = json.loads(response_text)
            return ai_result
            
        except Exception as e:
            print(f"AI analysis error: {e}")
            return {
                'score': 75,
                'formatting_issues': [],
                'missing_sections': [],
                'keyword_suggestions': [],
                'improvements': []
            }
    
    def generate_suggestions(
        self, formatting_result, keywords, sections, 
        contact_info, word_count, ai_analysis
    ) -> List[str]:
        """Generate actionable suggestions"""
        suggestions = []
        
        # Formatting suggestions
        if formatting_result['issues']:
            suggestions.extend(formatting_result['issues'])
        
        # Section suggestions
        if 'experience' not in sections:
            suggestions.append("Add a Work Experience section with detailed descriptions")
        if 'education' not in sections:
            suggestions.append("Include an Education section with degrees and institutions")
        if 'skills' not in sections:
            suggestions.append("Add a Skills section highlighting technical and soft skills")
        
        # Contact info
        if not contact_info['has_email']:
            suggestions.append("Include your email address in the header")
        if not contact_info['has_phone']:
            suggestions.append("Add your phone number for easy contact")
        
        # Keywords
        if len(keywords) < 10:
            suggestions.append("Use more action verbs (managed, developed, led, achieved)")
        
        # Word count
        if word_count < 300:
            suggestions.append("Expand your resume with more details about achievements")
        elif word_count > 1000:
            suggestions.append("Condense content to keep it within 2 pages")
        
        # Add AI suggestions
        if ai_analysis and 'improvements' in ai_analysis:
            suggestions.extend(ai_analysis['improvements'][:3])
        
        return suggestions[:8]  # Limit to top 8 suggestions
