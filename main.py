
import os
from flask import Flask, render_template, request, redirect, url_for, send_file, make_response
from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

# Initialize Firebase Admin SDK
cred = credentials.Certificate('privateKey.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'uploadjs-7f8e6.appspot.com'
})

app = Flask(__name__)
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
            # Upload file to Firebase Storage
            bucket = storage.bucket()
            blob = bucket.blob(filename)
            blob.upload_from_filename(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            response = make_response('', 204)
            return response
            #os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    else: return render_template('upload.html')
if __name__ == '__main__':
    app.run(host='127.0.0.1')
