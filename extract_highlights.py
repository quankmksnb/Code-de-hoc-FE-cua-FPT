import docx
from docx.enum.text import WD_COLOR_INDEX
import sys
import io

# Set encoding for output
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

def extract_quiz_data(file_path):
    doc = docx.Document(file_path)
    questions = []
    current_q = None
    
    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()
        if not text:
            continue
            
        # Detect a question (usually starts with "Câu" or just a sentence before options)
        # In this specific file, questions seem to be before options like 'a.', 'b.', 'c.', 'd.'
        
        is_option = False
        option_prefix = None
        for prefix in ['a.', 'b.', 'c.', 'd.', 'A.', 'B.', 'C.', 'D.']:
            if text.lower().startswith(prefix.lower()):
                is_option = True
                option_prefix = prefix.lower()[0]
                break
        
        if is_option:
            if current_q:
                # Check if this option is correct (highlighted)
                is_correct = False
                for run in para.runs:
                    if run.font.highlight_color == WD_COLOR_INDEX.YELLOW:
                        is_correct = True
                        break
                
                current_q["options"].append({
                    "text": text,
                    "letter": option_prefix,
                    "isCorrect": is_correct
                })
        else:
            # New question
            if current_q and current_q["options"]:
                questions.append(current_q)
            
            current_q = {
                "id": len(questions) + 1,
                "question": text,
                "options": []
            }
            
    # Add final question
    if current_q and current_q["options"]:
        questions.append(current_q)
        
    return questions

if __name__ == "__main__":
    import json
    file_path = "OnDeKi9.docx"
    try:
        quiz_data = extract_quiz_data(file_path)
        with open("questions.json", "w", encoding="utf-8") as f:
            json.dump(quiz_data, f, ensure_ascii=False, indent=2)
        print(f"Extracted {len(quiz_data)} questions to questions.json")
    except Exception as e:
        print(f"Error: {e}")
