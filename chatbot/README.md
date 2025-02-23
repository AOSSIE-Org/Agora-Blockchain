## Installation

### Create an environment using venv

```console
$ cd chatbot
$ python3 -m venv venv
```

### Activate it

Mac / Linux:

```console
. venv/bin/activate
```

Windows:

```console
venv\Scripts\activate
```

### Install PyTorch and dependencies

For Installation of PyTorch see [official website](https://pytorch.org/).

You also need `nltk`:

```console
pip install nltk flask_cors numpy torch flask
```

If you get an error during the first run, you also need to install `nltk.tokenize.punkt`:
Run this once in your terminal:

```console
$ python
>>> import nltk
>>> nltk.download('punkt_tab')
```

## Usage

Run

```console
python train.py
```

This will dump `data.pth` file. And then run

```console
python app.py
```

## Customize

Have a look at [intents.json](intents.json). You can customize it according to your own use case. Just define a new `tag`, possible `patterns`, and possible `responses` for the chat bot. You have to re-run the training whenever this file is modified.

```console
{
  "intents": [
    {
      "tag": "greeting",
      "patterns": [
        "Hi",
        "Hey",
        "How are you",
        "Is anyone there?",
        "Hello",
        "Good day"
      ],
      "responses": [
        "Hey :-)",
        "Hello, thanks for visiting",
        "Hi there, what can I do for you?",
        "Hi there, how can I help?"
      ]
    },
    ...
  ]
}
```
