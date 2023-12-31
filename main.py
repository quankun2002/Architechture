
import os
from flask import Flask, render_template, request, redirect, url_for, send_file, make_response, send_from_directory, send_file
from werkzeug.utils import secure_filename
from doctest1 import *

app = Flask(__name__, template_folder='templates')
app.config['UPLOAD_FOLDER'] = r'temp'  # replace with your upload directory

@app.route('/')
def main():
   return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/userDetail')
def userDetail():
    return render_template('userDetail.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part in the request.'
        file = request.files['file']
        if file.filename == '':
            return 'No selected file.'
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    # Construct the full file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # Define the API endpoint for code generation
        api_url = "https://polite-horribly-cub.ngrok-free.app/generate_code?max_length=512"

        #for i, file in enumerate(WordReplacer.docx_list(filedir), start=1):
            #print(f"{i} Processing file: {file}")

            # Load the Word document
            #word_replacer = WordReplacer(filedir2)
        # Load the Word document
        word_replacer = WordReplacer(file_path)
        
        underline_finder = WordUnderlineFinder()
        underlined_text_array = underline_finder.collect_underlined_text(word_replacer.docx)

        # Extract all paragraphs from the document
        paragraphs = []
        for paragraph in word_replacer.docx.paragraphs:
            #if paragraph.style.base_style is not None and (paragraph.style.base_style.name == 'Normal' or "normal" in paragraph.style.name.lower()):
                #continue
            if "reference" in paragraph.text.lower() and is_real_reference(paragraph):
                break
            if paragraph.text!="": paragraphs.append(paragraph.text)
        
        table_texts = []
        for table in word_replacer.docx.tables:
            for row in table.rows:
                row_text = [cell.text for cell in row.cells]
                for text in row_text:
                    table_texts.append(text)

        # Create a list of prompts
        prompts_list = []
        for paragraph in paragraphs:
            if not paragraph.strip():  # Skip empty
                continue
            prompt = f"Correct English in the following text: '{paragraph}.' \n Corrected version must follows these requirement:\n 1. keep it in one paragraph\n2. do not change curly brackets\n3.do not add space after text\n4.do not add anything after colon\n5. return only the text no explain needed\n"
            for underlined_text in underlined_text_array:
                if underlined_text in paragraph:
                    prompt += f"Don't change: {underlined_text}\n"
            prompt += "Here is the corrected version: "
            prompts_list.append(prompt)

        prompts_list_table = []
        filtered_table_texts = []

        for table_text in table_texts:
            ignore_this_prompt = any(underlined_text in table_text for underlined_text in underlined_text_array)

            if not ignore_this_prompt:
                table_prompt = f"Correct English in the following phrase keep it a phrase: {table_text}\nHere is the corrected version: "
                prompts_list_table.append(table_prompt)
                filtered_table_texts.append(table_text)

        # Update the original table_texts list
        table_texts = filtered_table_texts
            
        all_prompts_list = prompts_list + prompts_list_table
        
        max_prompts_per_request = 40
        
        # Split prompts into chunks of max_prompts_per_request
        prompt_chunks = [all_prompts_list[i:i + max_prompts_per_request] for i in range(0, len(all_prompts_list), max_prompts_per_request)]
        
        for i, prompts_chunk in enumerate(prompt_chunks, start=1):
            print(f"Sending request for chunk {i}...")
            # Define API parameters
            api_params = {'prompts': prompts_chunk}
            
            # Send a GET request to the API
            response = requests.get(api_url, params=api_params)
            
            # Check the status code and response content
            if response.status_code == 200:
                corrected_paragraphs = response.json()
                
                all_text = paragraphs + table_texts

                # Replace original paragraphs with corrected paragraphs
                for i, (original, corrected) in enumerate(zip(all_text, corrected_paragraphs), start=1):
                    word_replacer.replace_in_paragraph(original, corrected.strip())
                    word_replacer.replace_in_table(original, corrected.strip())
                    print(f"Paragraph {i}: Replaced successfully!")
                    print(corrected)
        
        # Save the document with replaced paragraphs
        output_filepath = os.path.join(app.config['UPLOAD_FOLDER'], "document_updated.docx")
        word_replacer.save(output_filepath)
        print(f"Saved updated document to: {output_filepath}\n")
        return  send_from_directory(app.config['UPLOAD_FOLDER'], "document_updated.docx", as_attachment=True)  
    else: return render_template('upload.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
