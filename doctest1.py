
from docx import Document
from docx.enum.text import WD_UNDERLINE
import os
import requests
class Execute:
    '''
        Execute Paragraphs KeyWords Replace
        paragraph: docx paragraph
    '''

    def __init__(self, paragraph):
        self.paragraph = paragraph


    def p_replace(self, x:int, key:str, value:str):
        '''
        paragraph replace
        The reason why you do not replace the text in a paragraph directly is that it will cause the original format to
        change. Replacing the text in runs will not cause the original format to change
        :param x:       paragraph id
        :param key:     Keywords that need to be replaced
        :param value:   The replaced keywords
        :return:
        '''
        # Gets the coordinate index values of all the characters in this paragraph [{run_index , char_index}]
        p_maps = [{"run": y, "char": z} for y, run in enumerate(self.paragraph.runs) for z, char in enumerate(list(run.text))]
        # Handle the number of times key occurs in this paragraph, and record the starting position in the list.
        # Here, while self.text.find(key) >= 0, the {"ab":"abc"} term will enter an endless loop
        # Takes a single paragraph as an independent body and gets an index list of key positions within the paragraph, or if the paragraph contains multiple keys, there are multiple index values
        k_idx = [s for s in range(len(self.paragraph.text)) if self.paragraph.text.find(key, s, len(self.paragraph.text)) == s]
        for i, start_idx in enumerate(reversed(k_idx)):       # Reverse order iteration
            end_idx = start_idx + len(key)                    # The end position of the keyword in this paragraph
            k_maps = p_maps[start_idx:end_idx]                # Map Slice List A list of dictionaries for sections that contain keywords in a paragraph
            self.r_replace(k_maps, value)
            # print(f"\t |Paragraph {x+1: >3}, object {i+1: >3} replaced successfully! | {key} ===> {value}")


    def r_replace(self, k_maps:list, value:str):
        '''
        :param k_maps: The list of indexed dictionaries containing keywords， e.g:[{"run":15, "char":3},{"run":15, "char":4},{"run":16, "char":0}]
        :param value:
        :return:
        Accept arguments, removing the characters in k_maps from back to front, leaving the first one to replace with value
        Note: Must be removed in reverse order, otherwise the list length change will cause IndedxError: string index out of range
        '''
        for i, position in enumerate(reversed(k_maps), start=1):
            y, z = position["run"], position["char"]
            run:object = self.paragraph.runs[y]         # "k_maps" may contain multiple run ids, which need to be separated
            # Pit: Instead of the replace() method, str is converted to list after a single word to prevent run.text from making an error in some cases (e.g., a single run contains a duplicate word)
            thisrun = list(run.text)
            if i < len(k_maps):
                thisrun.pop(z)          # Deleting a corresponding word
            if i == len(k_maps):        # The last iteration (first word), that is, the number of iterations is equal to the length of k_maps
                thisrun[z] = value      # Replace the word in the corresponding position with the new content
            run.text = ''.join(thisrun) # Recover


class WordReplacer:
    def __init__(self, file):
        self.docx = Document(file)
    
    def replace_in_paragraph(self, paragraph, replace_dict):
        for idx, para in enumerate(self.docx.paragraphs):
            # if paragraph._element.xpath('.//w:endnoteReference'):
            #     print("This paragraph contains endnotes:")
            if para.text == paragraph:
                Execute(para).p_replace(idx, paragraph, replace_dict)
                break

        for section in self.docx.sections:
            for header_paragraph in section.header.paragraphs:
                if header_paragraph.text == paragraph:
                    Execute(header_paragraph).p_replace(0, header_paragraph.text, replace_dict)

            for footer_paragraph in section.footer.paragraphs:
                if footer_paragraph.text == paragraph:
                    Execute(footer_paragraph).p_replace(0, footer_paragraph.text, replace_dict)

            for header_table in section.header.tables:
                for row in header_table.rows:
                    for cell in row.cells:
                        for cell_paragraph in cell.paragraphs:
                            if cell_paragraph.text == paragraph:
                                Execute(cell_paragraph).p_replace(0, cell_paragraph.text, replace_dict)

            for footer_table in section.footer.tables:
                for row in footer_table.rows:
                    for cell in row.cells:
                        for cell_paragraph in cell.paragraphs:
                            if cell_paragraph.text == paragraph:
                                Execute(cell_paragraph).p_replace(0, cell_paragraph.text, replace_dict)
                                
    def replace_in_table(self, paragraph, replace_word):
        for table in self.docx.tables:
            for row in table.rows:
                for cell in row.cells:
                    for cell_paragraph in cell.paragraphs:
                        if cell_paragraph.text == paragraph:
                            Execute(cell_paragraph).p_replace(0, cell_paragraph.text, replace_word)

    def save(self, filepath:str):
        '''
        :param filepath: File saving path
        :return:
        '''
        print(filepath)
        self.docx.save(filepath)
        
    @staticmethod
    def docx_list(dirPath):
        '''
        :param dirPath:
        :return: List of docx files in the current directory
        '''
        fileList = []
        for roots, dirs, files in os.walk(dirPath):
            for file in files:
                if file.endswith("docx") and file[0] != "~":  # Find the docx document and exclude temporary files
                    fileRoot = os.path.join(roots, file)
                    fileList.append(fileRoot)
        print("This directory finds a total of {0} related files!".format(len(fileList)))
        return fileList

class WordUnderlineFinder:
    def is_underlined(self, run):
        """
        Check if the run is underlined.
        """
        return run.underline
    def collect_underlined_text(self, doc):
        """
        Collect underlined text from the document.
        """
        underlined_text = []
        for paragraph in doc.paragraphs:
            for run in paragraph.runs:
                if self.is_underlined(run):
                    underlined_text.append(run.text)
                    
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for cell_paragraph in cell.paragraphs:
                        current_phrase = ""
                        for run in cell_paragraph.runs:
                            if self.is_underlined(run):
                                current_phrase += run.text
                        if (current_phrase != ""):
                            underlined_text.append(current_phrase)
        return underlined_text

def is_real_reference(ref_paragraph):
    """
    Check if "reference" is in real (non-bold and non-italic) text.
    """
    for run in ref_paragraph.runs:
        if "reference" in run.text.lower() and not (run.bold or run.italic):
            return True
            
    return False

def main():
    '''
    To use: Modify the values in replace dict and filedir
    replace_dict ：key:to be replaced, value:new content
    filedir ：Directory where docx files are stored. Subdirectories are supported
    '''
    # Quan dir
    # filedir = r"C:\Users\quank\Documents\rmit\engineering science\architndesign\word_file"
    # Long dir
    # filedir = "/Users/phamlong/Desktop/RMIT/Architecture and Design/Sample Doc"
    
    # Directory where docx files are stored. Subdirectories are supported
    filedir = "/Users/phamlong/Desktop/RMIT/Architecture and Design/Sample Doc"

    # Define the API endpoint for code generation
    #api_url = "https://3c92-103-253-89-37.ngrok-free.app/generate_code?max_length=1028"
    api_url = "https://trusting-inherently-feline.ngrok-free.app/generate_code?max_length=1028"

    for i, file in enumerate(WordReplacer.docx_list(filedir), start=1):
        print(f"{i} Processing file: {file}")

        # Load the Word document
        word_replacer = WordReplacer(file)
        
        underline_finder = WordUnderlineFinder()
        underlined_text_array = underline_finder.collect_underlined_text(word_replacer.docx)

        # Extract all paragraphs from the document
        paragraphs = []
        for paragraph in word_replacer.docx.paragraphs:
            if "reference" in paragraph.text.lower() and is_real_reference(paragraph):
                break
            paragraphs.append(paragraph.text)
        
        table_texts = []
        for table in word_replacer.docx.tables:
            for row in table.rows:
                row_text = [cell.text for cell in row.cells]
                for text in row_text:
                    table_texts.append(text)
    
        # Create a list of prompts
        prompts_list = []
        for paragraph in paragraphs:
            prompt = f"Correct English in the following text keep curly brackets keep it in one paragraph: {paragraph}\n"
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
            
        # prompts_list_table = [f"Correct English in the following phrase keep it a phrase: {table_text}\nHere is the corrected version: " for table_text in table_texts]
        
        all_prompts_list = prompts_list + prompts_list_table
        
        # Define API parameters
        api_params = {'prompts': all_prompts_list}
        
        # Send a GET request to the API
        response = requests.get(api_url, params=api_params)
        
        # Check the status code and response content
        if response.status_code == 200:
            corrected_paragraphs = response.json()
            
            all_text = paragraphs + table_texts

            # Replace original paragraphs with corrected paragraphs
            for i, (original, corrected) in enumerate(zip(all_text, corrected_paragraphs), start=1):
                word_replacer.replace_in_paragraph(original, corrected)
                word_replacer.replace_in_table(original, corrected)
                print(f"Paragraph {i}: Replaced successfully!")
                
            # Save the document with replaced paragraphs
            output_filepath = f"document_updated_{i}.docx"
            word_replacer.save(output_filepath)
            print(f"Saved updated document to: {output_filepath}\n")
        else:
            print("Failed to retrieve corrections. Status code:", response.status_code)



if __name__ == "__main__":
    main()
    print("All complete!")