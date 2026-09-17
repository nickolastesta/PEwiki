from flask import Flask, render_template
import os
app = Flask(__name__)

@app.route('/')

def home():
    return render_template('index.html')

@app.route('/bistahieversor')
def bistahieversor():
    return render_template('bistahieversor.html')

@app.route('/dacentrurus')
def dacentrurus():
    return render_template('dacentrurus.html')

@app.route('/stegosaurus')
def stegosaurus():
    return render_template('stegosaurus.html')

@app.route('/allosaurus')
def allosaurus():
    return render_template('allosaurus.html')

@app.route('/iguanodon')
def iguanodon():
    return render_template('iguanodon.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)