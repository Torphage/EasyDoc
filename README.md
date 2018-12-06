# EasyDoc

Makes 

An extension that makes it easier to document your code with the help of custom made template files.

## Features

* Generates snippet from custom made template files
* Built with documentation in mind but support normal snippets just as well
* Aims to support every documentation format
* Currently supports Haskell, Python and Ruby with more to come

## Installation

First, install the extension from either [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Torphage.easydoc)

or by downloading it from the [Extensions]() tab in VS-Code:

1. Pressing `Ctrl+Shift+X`
2. Search for `EasyDoc`
3. Select the extension and install it by pressing the `Install` button

## Usage

In [settings.json](/.vscode/settings.json), locate:

```JSON
"EasyDoc.dir": [
    "./templates"
]
```

> `"./templates"` is the path of example testing templates located within the extension folder. For custom paths you need to use **absolute paths**.

This is where EasyDoc finds all the directories that includes template files.

When naming a template file, make sure the extension ends with `.txt`. The base name is what the configuration name also will be named. **Naming your template file `dir.txt` is due to that `EasyDoc.dir` already is defined**.

> When adding a new template file for the extension read from a restart of the editor is required.

After adding a template file and restarted the editor, run the extension once and a new configuration will have been made in [settings.json](/.vscode/settings.json). On a file named `foo.txt` the default configuration would look like this:


```JSON
"EasyDoc.foo": {
    "alignIndentation": true,
    "commentAboveTarget": false,
    "docType": "function",
    "triggerString": "$$$"
}
```

* A detailed explanation for the syntax of the template file can be found [here](https://github.com/Torphage/EasyDoc/wiki/Template-Syntax)
* Examples of working template files can be found [here](https://github.com/Torphage/EasyDoc/wiki/Template-Examples)