import os
import PyPDF2
import re
from docx import Document
import textract

class DocumentUtils:

    # Split text into sentences
    @staticmethod
    def split_text_on_sentences(text):
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return sentences
    
    # Split text into chunks of max_length
    @staticmethod
    def split_text_into_chunks(text, max_length):
        chunks = []
        current_chunk = ""
    
        sentences = DocumentUtils.split_text_on_sentences(text)
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) + 1 > max_length:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                if current_chunk:
                    current_chunk += ' '
                current_chunk += sentence
        if current_chunk:
            chunks.append(current_chunk.strip())
        return chunks

    # Extract text from pdf
    @staticmethod
    def extract_text_from_file(file_path):
        _, file_extension = os.path.splitext(file_path)
        file_extension = file_extension.lower()
        
        text = ''

        try:
            if file_extension == '.pdf':
                # Extract text from PDF
                with open(file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    for page in reader.pages:
                        text += page.extract_text() or ""
            elif file_extension == '.docx':
                # Extract text from DOCX
                doc = Document(file_path)
                for paragraph in doc.paragraphs:
                    text += paragraph.text + '\n'
            elif file_extension in ['.doc', '.odt', '.rtf', '.txt']:
                # Extract text from other formats using textract
                text = textract.process(file_path).decode('utf-8')
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        
        except Exception as e:
            raise RuntimeError(f"Error processing file {file_path}: {e}")
        
        # Split text into chunks for better processing
        texts = DocumentUtils.split_text_into_chunks(text, 4000 * 3)
        return texts