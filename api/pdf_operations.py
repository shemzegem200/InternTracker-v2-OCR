# from pdf2image import convert_from_path
# from pytesseract import image_to_string

# def convert_pdf_to_img(pdf_file):
#     return convert_from_path(pdf_file, poppler_path="C:\\Users\\LAKSHMI_USER\\Downloads\\poppler-install\\poppler-24.08.0\\Library\\bin")

# def convert_image_to_text(file):
#     text = image_to_string(file)
#     return text

# def get_text_from_any_pdf(pdf_file):
#     images = convert_pdf_to_img(pdf_file)
#     final_text = ""
#     for pg, img in enumerate(images):
#         print(final_text)
#         final_text += convert_image_to_text(img)
    
#     return final_text



# POPPLER_PATH = r"C:\Users\LAKSHMI_USER\Downloads\poppler-install\poppler-24.08.0\Library\bin"

# import pytesseract
# from pdf2image import convert_from_path
# from PIL import Image

# def extract_text_from_pdf(pdf_path):
#     images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
#     text = ""
#     for img in images:
#         text += pytesseract.image_to_string(img) + "\n"
#     return text

# pdf_path = "C:\\Users\\LAKSHMI_USER\\Downloads\\InternTrack\\InternTrack\\InternTrack\\api\\uploads\\1134\\1134-Permission-Letter.pdf"  # Change this to your PDF file path
# extracted_text = extract_text_from_pdf(pdf_path)
# print(extracted_text)



#testing it
# path = 'C:\\Users\\LAKSHMI_USER\\Downloads\\InternTrack\\InternTrack\\InternTrack\\api\\uploads\\1134\\1134-Permission-Letter.pdf'
# print(get_text_from_any_pdf(path))




import sys
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No PDF file path provided.")
        sys.exit(1)

    pdf_path = sys.argv[1]  # Get the path from command-line arguments
    extracted_text = extract_text_from_pdf(pdf_path)
    print(extracted_text)  # Print output so Node.js can capture it
