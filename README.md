# EasyDoc

An extension that makes it easier to document your code with the help of custom made template files.

## Features

* Generates snippet from custom made template files
* Built with documentation in mind but support normal snippets as well
* Aims to support every documentation format
* Currently supports Haskell, Python and Ruby with more to come

## Installation

Install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Torphage.easydoc)

## Getting Started

1. Start of by opening the VS Code [settings.json](/.vscode/settings.json) file.

2. Find the configuration "EasyDoc.dir", add your desired directories as abosolute paths to where you want to store the custom made template.

3. Create a .txt file in one of the directories chosen above. This is the files that the snippets will be created from.

4. After you have created a file and ran the extension once a configuration have been added for that specific file. These will also be found in [settings.json](/.vscode/settings.json).

5. Learn how to create a snippet [here](https://github.com/Torphage/EasyDoc/wiki/Template-Syntax)