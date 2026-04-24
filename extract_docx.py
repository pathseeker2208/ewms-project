import zipfile
import xml.etree.ElementTree as ET

def extract():
    docx = zipfile.ZipFile(r'c:\Incture\frontend\Project\Enterprise Work Management System.docx')
    tree = ET.XML(docx.read('word/document.xml'))
    text = []
    for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        t = ''.join(node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text)
        if t:
            text.append(t)
    
    with open(r'c:\Incture\frontend\Project\requirements.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(text))

if __name__ == '__main__':
    extract()
