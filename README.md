# EasyDoc

An extension that makes it easier to document your code with the help of custom made template files.

## Features

* Generates snippet from custom made template files
* Built with documentation in mind but support normal snippets just as well
* Aims to support every documentation format
* Currently supports, with more to come:
  * C++
  * Haskell
  * Javascript
  * Python
  * Ruby
  * Typescript

## Basics

Some basic info about what EasyDoc do and what it can do.

* EasyDoc works by reading a file, which will be called a template file. This file is read by EasyDoc and will generate a appropriate result based on different conditions
* EasyDoc allows all forms of text to be included except some limitations where a conflict would emerge with the different syntaxes that is supported. Info about the different syntaxes, including what they are capable of and how you can use them is available at [Docs](#Docs)
* These template files can generate normal snippets or if specific conditions are met include different variables, more info at [Docs](#Docs)
* Every template file has its own configurations, with the file name and configuration name matching
* EasyDoc can be run by either writing in a preselected text and pressing enter or by doing a series of methods for activating the same command, more info at [Usage](#Usage)

## Installation

You can either install the extension from the `Extensions` tab in VS-Code:

1. Press `Ctrl+Shift+X` to bring up the extension tab
2. Search for `EasyDoc`
3. Select the extension and install it by pressing the `Install` button

or by downloading it from [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Torphage.easydoc)

## Setup

Easydoc requires a small setup in order to be able to use all of its features.

In [settings.json](/.vscode/settings.json), add a property named `EasyDoc.dir` and this will come up:

```JSON
"EasyDoc.dir": [
    "./templates"
]
```

This is the directories where EasyDoc searches for template files. The template files have to end with the file extension `.txt`.

When a file has been found within any of the directories within `EasyDoc.dir` a configuration will be created for each and every file. The configuration name will be the same as the files names. So if you put a file named `foo.txt` withing a directory included in `EasyDoc.dir`, a configuration would be made with the name `EasyDoc.foo`. EasyDoc will only check for new files every time you try to run it.

If intellisense does not find your newly generated configuration, do not worry. It will come back if you restart your editor, but is not required for EasyDoc to detect the configurations.

The default configuration, in this example on a file named `foo.txt`, looks like this:

```JSON
"EasyDoc.foo": {
    "alignIndentation": true,
    "commentAboveTarget": false,
    "docType": "function",
    "triggerString": "$$$"
}
```

For what to type in template, please look at [Docs](#Docs)

### Notes

`"./templates"` is the path of preinstalled samples ready to use, they are located within the extension folder. In order to add custom paths you need to use **absolute paths**.

Naming your template file `dir.txt` is not allowed due to `EasyDoc.dir` already being defined.

## Usage

The usage of EasyDoc can be found [here](https://github.com/Torphage/EasyDoc/wiki/usage).

## Docs

* A detailed explanation for the syntax of the template file can be found [here](https://github.com/Torphage/EasyDoc/wiki/Template-Syntax). Additional examples to help that shows more visually can be found here [here](https://github.com/Torphage/EasyDoc/wiki/Simple-Syntax-Explanation)
* Examples of working template files can be found [here](https://github.com/Torphage/EasyDoc/wiki/Template-Examples)
* Generated documentation of the source. Ode can be found [here](https://torphage.github.io/EasyDoc/)
