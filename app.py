from flask import Flask, render_template

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


if __name__ == '__main__':
    app.run(debug=True)